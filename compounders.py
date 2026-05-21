#!/usr/bin/env python3
"""
============================================================
COMPOUNDERS SCREENER v1.0 — Quality Growth Watchlist
============================================================
A fundamentally different beast from screener.py / turnaround.py:

  screener.py     — technical, daily, swing trades (5-15% targets)
  turnaround.py   — technical reversal, daily, swing trades
  picks.py        — trade manager, paper positions
  compounders.py  — FUNDAMENTAL, weekly, 5-10 YEAR holds (5-10x targets)

Hunts for businesses that compound capital for years — the kind of
stocks where the right answer is BUY and HOLD through 30-50%
drawdowns, not stop out at -4%.

100-POINT QUALITY SCORE:
  Growth Quality    35pts  3y revenue CAGR + 1y growth + earnings growth
  Profitability     25pts  Gross margin + operating margin + ROE
  Cash + Balance    20pts  FCF margin + debt ratios
  Moat Indicators   10pts  Insider ownership + analyst coverage
  Valuation Sanity  10pts  PEG + EV/Sales (not paying crazy multiples)

Output is a WATCHLIST. Not auto-traded. You manually review and decide.
Run weekly (data doesn't change daily — financials report quarterly).

  compounders_report.html
  reports/compounders_{ts}.html
  money_flow_history.db -> compounders_scores table

Not financial advice. Compounders fail too. Position size accordingly.
============================================================
"""
import sys, os, json, math, sqlite3, time
from datetime import datetime

try:
    import yfinance as yf
    import numpy as np
    import pandas as pd
except ImportError:
    print("\n  pip install yfinance pandas numpy\n"); sys.exit(1)

DB_PATH = "money_flow_history.db"

# ============================================================
# UNIVERSE — quality candidates across categories
# Deliberately different from screener.py: includes small/mid caps
# where 10-baggers hide. Some overlap with screener is fine.
# ============================================================
COMPOUNDER_UNIVERSE = {
    "Compounders Core": [
        "NVDA","AVGO","LLY","COST","V","MA","MSFT","GOOGL","AMZN",
        "NOW","INTU","CDNS","SNPS","NFLX","AAPL","BRK-B","UNH","HD",
    ],
    "Quality Growth": [
        "META","TSLA","ABBV","CRM","ADBE","CRWD","PANW","ANET","AXP",
        "ISRG","REGN","VRTX","ASML","TMO","ORCL","MCO","SPGI","BKNG",
        "PGR","CMG","SHW","ECL","WM","TJX","ROST","FAST","ODFL",
    ],
    "Mid-Cap Growth": [
        "DDOG","OKTA","ZS","NET","ESTC","MDB","PCTY","PAYC","TOST",
        "ROKU","RBLX","DKNG","AXON","GTLB","U","HUBS","TEAM","WDAY",
        "MKTX","NDAQ","DASH","ABNB","SNOW","TWLO","WIX","FIVN",
    ],
    "Secular Trends": [
        # AI Infrastructure
        "SMCI","ALAB","VRT","DELL","ARM","MRVL","CRDO","ANET",
        # Nuclear Revival
        "CCJ","UEC","NXE","BWXT","OKLO","SMR","LEU","UUUU",
        # GLP-1 / Obesity
        "NVO","ROIV","SLN","TRMD","STRC",
        # Defense Modernization
        "LMT","RTX","NOC","GD","KTOS","AVAV","CW","HEI",
        # Data Center / Power
        "DLR","EQIX","PWR","ETN","IRM","ED","CEG","VST",
    ],
    "Founder-Led / High Insider": [
        "META","TSLA","NVDA","CRM","SHOP","CRWD","NFLX","DOCN",
        "PLTR","RDDT","DASH","CHWY","ETSY","CARV","SOFI","HOOD","COIN",
        "SQ","AFRM","UBER","LYFT","RIVN","LCID","MARA","RIOT",
    ],
    "Quality Small-Cap": [
        "AEHR","NVMI","CAMT","CRDO","SITM","PI","AOSL","AMBA","ACLS",
        "PLAB","FORM","MKSI","ONTO","COHU","ICHR","RMBS","ALGM","SLAB",
        "INSM","HALO","MDGL","VKTX","BPMC","CYTK","NUVL","ARWR",
    ],
}

# Build flat universe (deduplicated)
ALL_COMPOUNDERS = []
_seen = set()
for cat, syms in COMPOUNDER_UNIVERSE.items():
    for s in syms:
        if s not in _seen:
            ALL_COMPOUNDERS.append(s)
            _seen.add(s)

# Map symbol -> primary category for tagging
SYMBOL_CATEGORY = {}
for cat, syms in COMPOUNDER_UNIVERSE.items():
    for s in syms:
        SYMBOL_CATEGORY.setdefault(s, cat)


# ============================================================
# HELPERS
# ============================================================
def sf(x):
    if x is None: return None
    try:
        f = float(x)
        return None if math.isnan(f) or math.isinf(f) else round(f, 4)
    except (TypeError, ValueError):
        return None

def fmt(n, d=2):
    return f"{n:.{d}f}" if n is not None else "-"

def fmt_pct(n):
    if n is None: return "-"
    return f"{'+' if n >= 0 else ''}{n:.1f}%"

def fmt_b(n):
    """Format dollar amount as B/M."""
    if n is None: return "-"
    if abs(n) >= 1e12: return f"${n/1e12:.2f}T"
    if abs(n) >= 1e9:  return f"${n/1e9:.1f}B"
    if abs(n) >= 1e6:  return f"${n/1e6:.0f}M"
    return f"${n:,.0f}"


# ============================================================
# FUNDAMENTAL FETCH
# ============================================================
def get_metric(df, candidates):
    """Try multiple row-name candidates against a yfinance DataFrame."""
    if df is None or df.empty:
        return None
    for c in candidates:
        if c in df.index:
            try:
                return df.loc[c]
            except Exception:
                continue
    return None


def fetch_fundamentals(symbol):
    """
    Pull comprehensive fundamentals from yfinance. Returns dict or None.
    Wraps every access in try/except — yfinance data is inconsistent.
    """
    try:
        t = yf.Ticker(symbol)
        info = t.info or {}
        fin  = None
        try: fin = t.financials
        except Exception: pass
        bs   = None
        try: bs = t.balance_sheet
        except Exception: pass
        cf   = None
        try: cf = t.cashflow
        except Exception: pass

        # Annual revenue series (most recent → oldest)
        rev_series = get_metric(fin, ["Total Revenue", "TotalRevenue", "Revenue"])
        revenues = []
        if rev_series is not None:
            for v in rev_series.values:
                try:
                    f = float(v)
                    if not math.isnan(f):
                        revenues.append(f)
                except (TypeError, ValueError):
                    pass

        # 3-year revenue CAGR (uses oldest available, falls back to 2yr or 1yr)
        rev_cagr_3y = None
        if len(revenues) >= 4 and revenues[3] > 0:
            try:
                rev_cagr_3y = ((revenues[0] / revenues[3]) ** (1/3) - 1) * 100
            except (ValueError, ZeroDivisionError):
                pass
        elif len(revenues) >= 3 and revenues[2] > 0:
            try:
                rev_cagr_3y = ((revenues[0] / revenues[2]) ** (1/2) - 1) * 100
            except (ValueError, ZeroDivisionError):
                pass

        # Operating income series
        oi_series = get_metric(fin, ["Operating Income", "OperatingIncome"])
        op_incomes = []
        if oi_series is not None:
            for v in oi_series.values:
                try:
                    f = float(v)
                    if not math.isnan(f):
                        op_incomes.append(f)
                except (TypeError, ValueError):
                    pass

        # FCF: prefer info["freeCashflow"]; fallback to cashflow statement
        fcf = info.get("freeCashflow")
        if fcf is None and cf is not None:
            ocf_s = get_metric(cf, ["Total Cash From Operating Activities",
                                     "Operating Cash Flow", "OperatingCashFlow"])
            capex_s = get_metric(cf, ["Capital Expenditures",
                                       "Capital Expenditure", "CapitalExpenditure"])
            try:
                if ocf_s is not None and capex_s is not None:
                    fcf = float(ocf_s.iloc[0]) + float(capex_s.iloc[0])
            except (IndexError, ValueError, TypeError):
                pass

        fcf_margin = None
        if fcf is not None and revenues and revenues[0] > 0:
            try:
                fcf_margin = (fcf / revenues[0]) * 100
            except (ZeroDivisionError, TypeError):
                pass

        return {
            "name":            info.get("longName") or info.get("shortName") or symbol,
            "price":           info.get("currentPrice") or info.get("regularMarketPrice"),
            "mkt_cap":         info.get("marketCap"),
            "enterprise_value":info.get("enterpriseValue"),
            "sector":          info.get("sector"),
            "industry":        info.get("industry"),
            # growth
            "rev_growth_1y":   (info.get("revenueGrowth") or 0) * 100 if info.get("revenueGrowth") is not None else None,
            "rev_cagr_3y":     rev_cagr_3y,
            "earnings_growth": (info.get("earningsGrowth") or 0) * 100 if info.get("earningsGrowth") is not None else None,
            "earnings_qgrowth":(info.get("earningsQuarterlyGrowth") or 0) * 100 if info.get("earningsQuarterlyGrowth") is not None else None,
            # profitability
            "gross_margin":    (info.get("grossMargins") or 0) * 100 if info.get("grossMargins") is not None else None,
            "operating_margin":(info.get("operatingMargins") or 0) * 100 if info.get("operatingMargins") is not None else None,
            "profit_margin":   (info.get("profitMargins") or 0) * 100 if info.get("profitMargins") is not None else None,
            "roe":             (info.get("returnOnEquity") or 0) * 100 if info.get("returnOnEquity") is not None else None,
            "roa":             (info.get("returnOnAssets") or 0) * 100 if info.get("returnOnAssets") is not None else None,
            # cash + balance sheet
            "fcf":             fcf,
            "fcf_margin":      fcf_margin,
            "total_cash":      info.get("totalCash"),
            "total_debt":      info.get("totalDebt"),
            "debt_to_equity":  info.get("debtToEquity"),
            "current_ratio":   info.get("currentRatio"),
            # moat / insider
            "insider_pct":     (info.get("heldPercentInsiders") or 0) * 100 if info.get("heldPercentInsiders") is not None else None,
            "institution_pct": (info.get("heldPercentInstitutions") or 0) * 100 if info.get("heldPercentInstitutions") is not None else None,
            "analyst_count":   info.get("numberOfAnalystOpinions"),
            # valuation
            "trailing_pe":     info.get("trailingPE"),
            "forward_pe":      info.get("forwardPE"),
            "peg":             info.get("pegRatio"),
            "ps":              info.get("priceToSalesTrailing12Months"),
            "ev_revenue":      info.get("enterpriseToRevenue"),
            "ev_ebitda":       info.get("enterpriseToEbitda"),
            # 52w
            "high_52w":        info.get("fiftyTwoWeekHigh"),
            "low_52w":         info.get("fiftyTwoWeekLow"),
        }
    except Exception as e:
        print(f"  fetch fail {symbol}: {e}")
        return None


# ============================================================
# SCORING
# ============================================================
def score_compounder(f):
    """100-point quality score with breakdown."""
    if not f:
        return None

    bd = {}

    # ── GROWTH QUALITY (35 pts) ────────────────────────────────
    g = 0
    cagr = f.get("rev_cagr_3y")
    if cagr is not None:
        if   cagr >= 30: g += 15
        elif cagr >= 20: g += 12
        elif cagr >= 15: g += 9
        elif cagr >= 10: g += 6
        elif cagr >= 5:  g += 3
        elif cagr < 0:   g -= 3
    r1y = f.get("rev_growth_1y")
    if r1y is not None:
        if   r1y >= 25: g += 10
        elif r1y >= 15: g += 7
        elif r1y >= 8:  g += 4
        elif r1y >= 0:  g += 1
        elif r1y < -5:  g -= 4
    eg = f.get("earnings_growth")
    if eg is not None:
        if   eg >= 30: g += 10
        elif eg >= 15: g += 7
        elif eg >= 5:  g += 4
        elif eg < -10: g -= 3
    g = max(0, min(35, g))
    bd["Growth"] = round(g, 1)

    # ── PROFITABILITY (25 pts) ─────────────────────────────────
    p = 0
    gm = f.get("gross_margin")
    if gm is not None:
        if   gm >= 60: p += 10
        elif gm >= 45: p += 7
        elif gm >= 30: p += 4
        elif gm >= 20: p += 2
    om = f.get("operating_margin")
    if om is not None:
        if   om >= 25: p += 8
        elif om >= 15: p += 5
        elif om >= 5:  p += 3
        elif om < 0:   p -= 2
    roe = f.get("roe")
    if roe is not None:
        if   roe >= 25: p += 7
        elif roe >= 15: p += 4
        elif roe >= 8:  p += 2
        elif roe < 0:   p -= 2
    p = max(0, min(25, p))
    bd["Profit"] = round(p, 1)

    # ── CASH + BALANCE SHEET (20 pts) ──────────────────────────
    c = 0
    fcm = f.get("fcf_margin")
    if fcm is not None:
        if   fcm >= 25: c += 10
        elif fcm >= 15: c += 7
        elif fcm >= 8:  c += 5
        elif fcm >= 0:  c += 2
        elif fcm < -10: c -= 3
    de = f.get("debt_to_equity")
    if de is not None:
        if   de <= 30:  c += 6
        elif de <= 80:  c += 4
        elif de <= 150: c += 2
        elif de >  300: c -= 3
    cr = f.get("current_ratio")
    if cr is not None:
        if   cr >= 2.0: c += 4
        elif cr >= 1.5: c += 3
        elif cr >= 1.0: c += 1
        elif cr <  0.8: c -= 2
    c = max(0, min(20, c))
    bd["Cash"] = round(c, 1)

    # ── MOAT INDICATORS (10 pts) ───────────────────────────────
    m = 0
    ip = f.get("insider_pct")
    if ip is not None:
        if   ip >= 15: m += 5  # founder still owns big stake
        elif ip >= 5:  m += 3
        elif ip >= 1:  m += 1
    inst = f.get("institution_pct")
    if inst is not None:
        if   60 <= inst <= 85: m += 3  # sweet spot — institutional but not crowded
        elif inst >= 50:       m += 2
        elif inst >= 30:       m += 1
    ac = f.get("analyst_count")
    if ac is not None and ac >= 10:
        m += 2
    m = max(0, min(10, m))
    bd["Moat"] = round(m, 1)

    # ── VALUATION SANITY (10 pts) ──────────────────────────────
    # We don't reward "cheap" — quality compounders are rarely cheap.
    # We just penalize PAYING CRAZY MULTIPLES for stocks that don't grow enough.
    v = 5  # neutral starting point
    peg = f.get("peg")
    if peg is not None and peg > 0:
        if   peg <= 1.0:  v += 3   # cheap relative to growth
        elif peg <= 2.0:  v += 1
        elif peg <= 3.0:  v += 0
        elif peg >  4.0:  v -= 3   # expensive even for the growth
    ps = f.get("ev_revenue") or f.get("ps")
    if ps is not None:
        if   ps >= 25: v -= 3      # paying 25x+ revenue is dangerous unless triple-digit growth
        elif ps >= 15: v -= 1
        elif ps <= 4:  v += 2      # cheap for quality
    v = max(0, min(10, v))
    bd["Value"] = round(v, 1)

    total = g + p + c + m + v
    return {
        "score":          round(total),
        "bd":             bd,
        "bd_max":         {"Growth": 35, "Profit": 25, "Cash": 20, "Moat": 10, "Value": 10},
    }


def get_quality_signal(sc):
    if sc >= 80: return ("ELITE COMPOUNDER",  "#22c55e", "rgba(34,197,94,0.12)")
    if sc >= 70: return ("HIGH QUALITY",      "#4ade80", "rgba(74,222,128,0.10)")
    if sc >= 55: return ("INVESTABLE",        "#fbbf24", "rgba(251,191,36,0.10)")
    if sc >= 40: return ("MIXED",             "#f97316", "rgba(249,115,22,0.10)")
    return ("AVOID / TURNAROUND PLAY", "#ef4444", "rgba(239,68,68,0.10)")


# ============================================================
# DB
# ============================================================
class CompoundersDB:
    def __init__(self, path=DB_PATH):
        self.conn = sqlite3.connect(path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS compounders_scores (
                date TEXT, symbol TEXT, score INTEGER, category TEXT,
                mkt_cap REAL, rev_cagr_3y REAL, rev_growth_1y REAL,
                gross_margin REAL, operating_margin REAL, roe REAL,
                fcf_margin REAL, debt_to_equity REAL, insider_pct REAL,
                peg REAL, ev_revenue REAL,
                growth_pts REAL, profit_pts REAL, cash_pts REAL,
                moat_pts REAL, value_pts REAL,
                PRIMARY KEY (date, symbol)
            );
        """)
        self.conn.commit()

    def save(self, date_str, symbol, category, f, scoring):
        try:
            bd = scoring["bd"]
            self.conn.execute("""
                INSERT OR REPLACE INTO compounders_scores VALUES
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (date_str, symbol, scoring["score"], category,
                  f.get("mkt_cap"), f.get("rev_cagr_3y"), f.get("rev_growth_1y"),
                  f.get("gross_margin"), f.get("operating_margin"), f.get("roe"),
                  f.get("fcf_margin"), f.get("debt_to_equity"), f.get("insider_pct"),
                  f.get("peg"), f.get("ev_revenue"),
                  bd.get("Growth"), bd.get("Profit"), bd.get("Cash"),
                  bd.get("Moat"), bd.get("Value")))
            self.conn.commit()
        except Exception as e:
            print(f"  db save fail {symbol}: {e}")

    def close(self):
        try: self.conn.close()
        except Exception: pass


# ============================================================
# HTML
# ============================================================
GUIDE_HTML = '''
<div class="tt" id="guide-toggle" onclick="toggleGuide()" style="cursor:pointer">
  How to Read This Report &mdash; The Compounder Playbook
  <span id="guide-arrow" style="font-size:11px;color:#64748b"> &#9660; tap to expand</span>
</div>
<div id="guide-body" style="display:none">

<div class="guide-section" style="border:2px solid rgba(245,158,11,0.35);background:rgba(245,158,11,0.04)">
  <div class="guide-title" style="color:#fbbf24">THIS IS A DIFFERENT GAME</div>
  <div style="font-size:10px;color:#cbd5e1;line-height:1.6">
    The screener / turnaround / picks system is a SWING TRADER. It targets 5-15% gains over weeks.
    This compounders screener is a DIFFERENT animal: it hunts for 5-10x winners that take 5-10 YEARS to play out.
    Same companies, different stocks, different rules. <strong>Do not apply your swing-trading stop losses to compounders.</strong>
    Compounders go through 30-50% drawdowns ON THE WAY to 10x. NVDA dropped 65% in 2022 before going 10x.
    The only reason to sell a compounder is THESIS BREAK, not price action.
  </div>
</div>

<div class="guide-section" style="border:2px solid rgba(34,197,94,0.35);background:rgba(34,197,94,0.04)">
  <div class="guide-title" style="color:#4ade80">THE COMPOUNDER CUBE &mdash; 5 FACES OF QUALITY</div>
  <div style="font-size:10px;color:#cbd5e1;margin-bottom:12px;line-height:1.6">
    Every business has 5 quality dimensions. The cube is solved when growth + profit + cash + moat + valuation all align. Score 80+ = elite. 70-79 = high quality. 55-69 = investable with thesis.
  </div>
  <div class="cube-grid">
    <div class="cube-face" style="border-color:#22c55e">
      <div class="cf-tag" style="background:#22c55e;color:#000">GROW 35</div>
      <div class="cf-name">Growth Quality</div>
      <div class="cf-q">&ldquo;Is the business actually compounding?&rdquo;</div>
      <div class="cf-pts">3y revenue CAGR &bull; 1y growth (acceleration check) &bull; earnings growth &bull; 20%+ CAGR = strong</div>
    </div>
    <div class="cube-face" style="border-color:#a78bfa">
      <div class="cf-tag" style="background:#a78bfa;color:#000">PROFIT 25</div>
      <div class="cf-name">Profitability</div>
      <div class="cf-q">&ldquo;Does growth turn into profits?&rdquo;</div>
      <div class="cf-pts">Gross margin 45%+ &bull; Operating margin 15%+ &bull; ROE 15%+ &bull; Quality compounds high margins</div>
    </div>
    <div class="cube-face" style="border-color:#22d3ee">
      <div class="cf-tag" style="background:#22d3ee;color:#000">CASH 20</div>
      <div class="cf-name">Cash &amp; Balance Sheet</div>
      <div class="cf-q">&ldquo;Can it self-fund the growth?&rdquo;</div>
      <div class="cf-pts">FCF margin 15%+ &bull; Debt/equity under 80 &bull; Current ratio 1.5+ &bull; Self-funded compounders survive downturns</div>
    </div>
    <div class="cube-face" style="border-color:#fbbf24">
      <div class="cf-tag" style="background:#fbbf24;color:#000">MOAT 10</div>
      <div class="cf-name">Moat &amp; Alignment</div>
      <div class="cf-q">&ldquo;Are management interests aligned?&rdquo;</div>
      <div class="cf-pts">Insider ownership &gt; 5% (founder skin in game) &bull; Institutional 60-85% (real but not crowded)</div>
    </div>
    <div class="cube-face" style="border-color:#f97316">
      <div class="cf-tag" style="background:#f97316;color:#000">VALUE 10</div>
      <div class="cf-name">Valuation Sanity</div>
      <div class="cf-q">&ldquo;Am I paying a crazy price?&rdquo;</div>
      <div class="cf-pts">PEG under 2 ideal &bull; EV/Sales under 15 (unless triple-digit growth) &bull; Compounders are rarely cheap</div>
    </div>
  </div>
</div>

<div class="guide-section">
  <div class="guide-title">HOW TO USE THIS LIST</div>
  <div style="font-size:10px;color:#cbd5e1;line-height:1.7">
    <div><strong>1. Don&apos;t buy from this list directly.</strong> Treat it as a research queue.</div>
    <div><strong>2. For each name scoring 70+,</strong> spend 30-60 minutes: read the latest earnings call, check the 10-K, understand what the business does, identify the thesis.</div>
    <div><strong>3. Write a 3-sentence thesis before buying.</strong> What does the company do, why is it valuable for the next 5 years, what would break the thesis?</div>
    <div><strong>4. Size for 10 positions max.</strong> Each position is 5-15% of the compounder portfolio. Not equal weight &mdash; size by conviction.</div>
    <div><strong>5. Only sell on THESIS BREAK.</strong> Price dropping 30% is not thesis break. Revenue declining 3 quarters, margins permanently compressing, a competitor winning &mdash; that&apos;s thesis break.</div>
    <div><strong>6. Re-evaluate quarterly.</strong> Read every earnings report. Update the thesis. If the thesis is intact, hold. If it&apos;s evolving, decide. If it&apos;s broken, sell &mdash; ignore the price.</div>
    <div><strong>7. Track separately from your swing trades.</strong> Different mental account. Different rules.</div>
  </div>
</div>

<div class="guide-section">
  <div class="guide-title">KEY METRIC RANGES</div>
  <div class="guide-grid">
    <div class="guide-card">
      <div class="gc-title" style="color:#22c55e">Revenue Growth</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">3y CAGR &gt; 25%</span><span class="gc-label">Hypergrowth &mdash; rare and valuable</span></div>
        <div class="gc-row"><span class="gc-val green">3y CAGR 15-25%</span><span class="gc-label">Strong compounder territory</span></div>
        <div class="gc-row"><span class="gc-val muted">3y CAGR 8-15%</span><span class="gc-label">Solid but won&apos;t produce 10x alone</span></div>
        <div class="gc-row"><span class="gc-val red">3y CAGR &lt; 5%</span><span class="gc-label">Mature/declining &mdash; not a compounder</span></div>
      </div>
    </div>
    <div class="guide-card">
      <div class="gc-title" style="color:#a78bfa">Gross Margin</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">&gt; 60%</span><span class="gc-label">SaaS / luxury / IP-heavy &mdash; best</span></div>
        <div class="gc-row"><span class="gc-val green">45-60%</span><span class="gc-label">Quality consumer / strong tech</span></div>
        <div class="gc-row"><span class="gc-val muted">30-45%</span><span class="gc-label">Decent industrial / retail</span></div>
        <div class="gc-row"><span class="gc-val red">&lt; 25%</span><span class="gc-label">Commodity-like &mdash; hard to compound</span></div>
      </div>
    </div>
    <div class="guide-card">
      <div class="gc-title" style="color:#22d3ee">Free Cash Flow Margin</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">&gt; 25%</span><span class="gc-label">Exceptional &mdash; pricing power confirmed</span></div>
        <div class="gc-row"><span class="gc-val green">15-25%</span><span class="gc-label">Strong &mdash; self-funded growth</span></div>
        <div class="gc-row"><span class="gc-val muted">5-15%</span><span class="gc-label">Acceptable for growth phase</span></div>
        <div class="gc-row"><span class="gc-val red">&lt; 0%</span><span class="gc-label">Burning cash &mdash; only OK if growth &gt; 50%</span></div>
      </div>
    </div>
    <div class="guide-card">
      <div class="gc-title" style="color:#fbbf24">Insider Ownership</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">&gt; 15%</span><span class="gc-label">Founder still in control &mdash; long-term mindset</span></div>
        <div class="gc-row"><span class="gc-val green">5-15%</span><span class="gc-label">Strong alignment with shareholders</span></div>
        <div class="gc-row"><span class="gc-val muted">1-5%</span><span class="gc-label">Normal large-cap level</span></div>
        <div class="gc-row"><span class="gc-val red">&lt; 1%</span><span class="gc-label">Hired-gun management &mdash; less aligned</span></div>
      </div>
    </div>
  </div>
</div>

</div>
'''


def generate_html(ranked, scan_time):
    by_score = sorted(ranked, key=lambda x: x.get("score", 0) or 0, reverse=True)
    elite     = [r for r in by_score if r.get("score", 0) >= 80]
    hq        = [r for r in by_score if 70 <= r.get("score", 0) < 80]
    investable= [r for r in by_score if 55 <= r.get("score", 0) < 70]

    def card(r):
        f = r.get("fund", {})
        sc = r.get("score", 0)
        sig, sc_color, sc_bg = get_quality_signal(sc)
        bd     = r.get("bd", {})
        bd_max = r.get("bd_max", {})
        cat    = r.get("category", "")

        bd_html = ""
        for k, mx in bd_max.items():
            v = bd.get(k, 0)
            pct = min(100, v / mx * 100) if mx > 0 else 0
            bd_html += (f'<div class="bdi"><div class="bdl">{k}</div>'
                        f'<div class="bdo"><div class="bdf" style="width:{pct:.0f}%;background:{sc_color}"></div></div>'
                        f'<div class="bdv">{v}/{mx}</div></div>')

        return f'''<div class="cd">
<div class="r">
  <div class="ri2">
    <div class="bar" style="background:{sc_color}"></div>
    <div>
      <div class="sym">{r["symbol"]} <span style="font-size:9px;color:#94a3b8;font-weight:400">{cat}</span></div>
      <div class="nm">{f.get("name","")[:60]} &middot; {fmt_b(f.get("mkt_cap"))} &middot; {f.get("sector","")}</div>
    </div>
  </div>
  <div style="text-align:right">
    <div class="sc" style="color:{sc_color}">{sc}</div>
    <span class="sg" style="background:{sc_bg};color:{sc_color}">{sig}</span>
  </div>
</div>
<div class="grd">
  <div><div class="gl">Rev CAGR 3y</div><div class="gv {('green' if (f.get('rev_cagr_3y') or 0)>=15 else 'red' if (f.get('rev_cagr_3y') or 0)<5 else '')}">{fmt_pct(f.get('rev_cagr_3y'))}</div></div>
  <div><div class="gl">Rev 1y</div><div class="gv {('green' if (f.get('rev_growth_1y') or 0)>=10 else 'red' if (f.get('rev_growth_1y') or 0)<0 else '')}">{fmt_pct(f.get('rev_growth_1y'))}</div></div>
  <div><div class="gl">Gross M</div><div class="gv">{fmt(f.get('gross_margin'),1)}%</div></div>
  <div><div class="gl">Op M</div><div class="gv">{fmt(f.get('operating_margin'),1)}%</div></div>
  <div><div class="gl">ROE</div><div class="gv">{fmt(f.get('roe'),1)}%</div></div>
  <div><div class="gl">FCF M</div><div class="gv">{fmt(f.get('fcf_margin'),1)}%</div></div>
  <div><div class="gl">Insider%</div><div class="gv">{fmt(f.get('insider_pct'),1)}%</div></div>
  <div><div class="gl">PEG</div><div class="gv">{fmt(f.get('peg'),2)}</div></div>
</div>
<div class="bd">{bd_html}</div>
</div>'''

    elite_html = "".join(card(r) for r in elite) or '<div style="font-size:11px;color:#64748b;padding:12px 0">No ELITE-tier scorers this scan.</div>'
    hq_html    = "".join(card(r) for r in hq)    or '<div style="font-size:11px;color:#64748b;padding:12px 0">No HIGH QUALITY scorers this scan.</div>'
    inv_html   = "".join(card(r) for r in investable[:20])

    # Full table sorted by score
    rows = ""
    for r in by_score:
        f = r.get("fund", {})
        sc = r.get("score", 0)
        sig, c, _ = get_quality_signal(sc)
        rows += f'''<tr>
<td style="font-weight:700">{r["symbol"]}</td>
<td style="color:#94a3b8;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{(f.get("name") or "")[:40]}</td>
<td style="color:#64748b">{r.get("category","")}</td>
<td style="color:{c};font-weight:700">{sc}</td>
<td>{fmt_b(f.get("mkt_cap"))}</td>
<td class="{('green' if (f.get('rev_cagr_3y') or 0)>=15 else '')}">{fmt_pct(f.get('rev_cagr_3y'))}</td>
<td>{fmt(f.get('gross_margin'),0)}%</td>
<td>{fmt(f.get('operating_margin'),0)}%</td>
<td>{fmt(f.get('roe'),0)}%</td>
<td>{fmt(f.get('fcf_margin'),0)}%</td>
<td>{fmt(f.get('insider_pct'),1)}%</td>
<td>{fmt(f.get('peg'),2)}</td>
</tr>'''

    css = '''
* { margin:0; padding:0; box-sizing:border-box }
body { font-family:'JetBrains Mono',monospace; background:#080c14; color:#e2e8f0; padding:16px }
.hdr { border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:16px; margin-bottom:16px }
.hdr h1 { font-size:15px; font-weight:700; letter-spacing:.08em; color:#f8fafc; text-transform:uppercase }
.hdr .sub { font-size:10px; color:#64748b; margin-top:4px }
.cd { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);
      border-radius:6px; padding:12px; margin-bottom:8px; font-size:11px }
.r { display:flex; justify-content:space-between; align-items:flex-start }
.ri2 { display:flex; align-items:center; gap:8px }
.bar { width:3px; height:34px; border-radius:2px; flex-shrink:0 }
.sym { font-weight:700; font-size:13px }
.nm { font-size:10px; color:#64748b }
.sc { font-weight:700; font-size:22px }
.sg { font-size:8px; font-weight:700; letter-spacing:.06em; padding:2px 6px;
      border-radius:3px; display:inline-block; margin-top:4px }
.grd { display:grid; grid-template-columns:repeat(8,1fr); gap:8px; margin-top:10px }
.gl { font-size:8px; color:#64748b; text-transform:uppercase; letter-spacing:.06em }
.gv { font-size:11px; font-weight:600; margin-top:2px }
.bd { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px }
.bdi { flex:1; min-width:60px }
.bdl { font-size:7px; color:#64748b; text-transform:uppercase; letter-spacing:.04em }
.bdo { width:100%; height:3px; border-radius:2px; background:rgba(255,255,255,0.06); margin-top:2px }
.bdf { height:100%; border-radius:2px }
.bdv { font-size:8px; font-weight:600; color:#94a3b8; margin-top:1px }
.tt { font-size:13px; font-weight:700; letter-spacing:.06em; color:#f8fafc;
      text-transform:uppercase; margin:24px 0 12px }
.ft { margin-top:32px; padding:12px 0; border-top:1px solid rgba(255,255,255,0.04);
      font-size:9px; color:#334155 }
.green { color:#4ade80 }
.red   { color:#f87171 }
.muted { color:#94a3b8 }
.jtbl { width:100%; border-collapse:collapse; font-size:10px }
.jtbl th { text-align:left; padding:6px 8px; font-size:8px; color:#64748b;
           text-transform:uppercase; letter-spacing:.06em;
           border-bottom:1px solid rgba(255,255,255,0.06) }
.jtbl td { padding:6px 8px; border-bottom:1px solid rgba(255,255,255,0.04) }
.guide-section { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
                 border-radius:6px; padding:16px; margin-bottom:10px }
.guide-title { font-size:10px; font-weight:700; color:#94a3b8; letter-spacing:.1em;
               text-transform:uppercase; margin-bottom:12px }
.guide-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
              gap:10px; margin-top:8px }
.guide-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
              border-radius:6px; padding:12px }
.gc-title { font-size:11px; font-weight:700; margin-bottom:8px }
.gc-rows { display:flex; flex-direction:column; gap:5px }
.gc-row { display:flex; gap:10px; align-items:baseline }
.gc-val { font-size:9px; font-weight:700; min-width:95px; flex-shrink:0 }
.gc-label { font-size:9px; color:#64748b }
.cube-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
             gap:8px; margin-top:8px }
.cube-face { border:1px solid; border-radius:6px; padding:10px;
             background:rgba(255,255,255,0.02); position:relative }
.cf-tag { position:absolute; top:8px; right:8px; font-size:8px; font-weight:700;
          padding:2px 6px; border-radius:3px }
.cf-name { font-size:11px; font-weight:700; color:#e2e8f0; margin-bottom:6px; padding-right:60px }
.cf-q { font-size:9px; color:#94a3b8; font-style:italic; margin-bottom:6px; line-height:1.4 }
.cf-pts { font-size:8px; color:#64748b; line-height:1.5 }
@media (max-width:700px) { .grd { grid-template-columns:repeat(4,1fr) } }
'''

    return f'''<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Compounders Screener &mdash; {scan_time}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>{css}</style></head><body>

<div class="hdr">
  <h1>Compounders Screener v1.0 &mdash; Quality Growth Watchlist</h1>
  <div class="sub">{scan_time} &nbsp;|&nbsp; {len(ranked)} candidates scored on 5-year compounder framework &nbsp;|&nbsp; Not financial advice</div>
</div>

{GUIDE_HTML}

<div class="tt">Elite Tier &mdash; Score 80+ &nbsp;({len(elite)} stocks)</div>
{elite_html}

<div class="tt">High Quality &mdash; Score 70-79 &nbsp;({len(hq)} stocks)</div>
{hq_html}

<div class="tt">Investable &mdash; Score 55-69 &nbsp;(top 20 shown)</div>
{inv_html}

<div class="tt">Full Universe Ranked</div>
<div style="overflow-x:auto">
<table class="jtbl">
<thead><tr>
  <th>Symbol</th><th>Name</th><th>Category</th><th>Score</th>
  <th>Mkt Cap</th><th>Rev CAGR 3y</th><th>GM</th><th>OpM</th>
  <th>ROE</th><th>FCF M</th><th>Insider</th><th>PEG</th>
</tr></thead>
<tbody>{rows}</tbody></table></div>

<div class="ft">
  Compounders v1.0 &nbsp;|&nbsp;
  Quality scoring: Growth 35 + Profit 25 + Cash 20 + Moat 10 + Value 10 &nbsp;|&nbsp;
  Hold horizon: 3-10 years &nbsp;|&nbsp;
  Sell only on thesis break, not price action &nbsp;|&nbsp;
  Not financial advice.
</div>

<script>
function toggleGuide(){{
  var b=document.getElementById('guide-body');
  var a=document.getElementById('guide-arrow');
  var open=b.style.display==='block';
  b.style.display=open?'none':'block';
  a.innerHTML=open?'▼ tap to expand':'▲ tap to collapse';
}}
</script>
</body></html>'''


# ============================================================
# MAIN
# ============================================================
def main():
    scan_dt  = datetime.now()
    ts       = scan_dt.strftime("%Y%m%d_%H%M")
    date_str = scan_dt.strftime("%Y-%m-%d")
    print(f"\n  COMPOUNDERS SCREENER v1.0 | {scan_dt.strftime('%B %d, %Y %I:%M %p')}\n")

    os.makedirs("reports", exist_ok=True)
    db = CompoundersDB()

    print(f"  Scoring {len(ALL_COMPOUNDERS)} candidates for compounder quality...\n")
    ranked = []
    for i, sym in enumerate(ALL_COMPOUNDERS):
        cat = SYMBOL_CATEGORY.get(sym, "")
        print(f"  [{i+1:3d}/{len(ALL_COMPOUNDERS)}] {sym:6s}...", end=" ", flush=True)
        f = fetch_fundamentals(sym)
        if not f:
            print("FAIL")
            continue
        sc = score_compounder(f)
        if not sc:
            print("score fail")
            continue
        ranked.append({
            "symbol":   sym,
            "category": cat,
            "fund":     f,
            "score":    sc["score"],
            "bd":       sc["bd"],
            "bd_max":   sc["bd_max"],
        })
        sig, _, _ = get_quality_signal(sc["score"])
        print(f"{sc['score']:3d}  {sig}")
        db.save(date_str, sym, cat, f, sc)
        time.sleep(0.3)  # yfinance fundamentals can rate-limit harder than prices

    db.close()

    print("\n  Generating compounders report...")
    scan_time = scan_dt.strftime("%B %d, %Y %I:%M %p")
    html = generate_html(ranked, scan_time)
    html_path = os.path.join("reports", f"compounders_{ts}.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    with open("compounders_report.html", "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  Saved: {html_path}")
    print(f"  Saved: compounders_report.html (latest)")

    by_score = sorted(ranked, key=lambda x: x.get("score", 0), reverse=True)
    elite    = [r for r in by_score if r.get("score", 0) >= 80]
    hq       = [r for r in by_score if 70 <= r.get("score", 0) < 80]

    print(f"\n  {'='*56}")
    print(f"  RESULTS:")
    print(f"  ELITE (80+)    : {len(elite)} stocks")
    for r in elite[:10]:
        print(f"    {r['symbol']:6s}  {r['score']:3d}  {r['category']}")
    print(f"  HIGH QUALITY   : {len(hq)} stocks")
    for r in hq[:10]:
        print(f"    {r['symbol']:6s}  {r['score']:3d}  {r['category']}")
    print(f"  {'='*56}\n")


if __name__ == "__main__":
    main()
