"""
TURNAROUND SCREENER v1.0 — Reversal / Recovery Edition
============================================================
Companion to screener.py (the momentum screener).

screener.py answers:   "What is working RIGHT NOW?"      (buy strength)
turnaround.py answers: "What is ABOUT to work?"          (buy the bottom)

It deliberately INVERTS the momentum bias. A stock at all-time highs
scores ZERO here — by definition it is not a turnaround. Instead it
hunts for beaten-down names where smart money is quietly accumulating
BEFORE the recovery shows up in price.

100-point TURNAROUND score:
  Recovery Zone  25pts  % off 52-week high — must be genuinely beaten down
  Stabilization  20pts  MA reclaim from below + MA slope curling up
  Accumulation   30pts  OBV divergence + CMF crossover — the smart-money fingerprint
  Base Quality   15pts  volatility contraction + higher lows
  Momentum Turn  10pts  RSI curling up from oversold (NOT overbought)

Outputs:
  reports/turnaround_{ts}.html
  turnaround_report.html         (latest, always overwritten)
  money_flow_history.db          -> turnaround_scores table

Run daily alongside screener.py. Not financial advice.
"""
import sys, os, json, time, sqlite3
from datetime import datetime

try:
    import numpy as np
except ImportError:
    print("\n  pip install yfinance numpy\n"); sys.exit(1)

# Reuse the entire data layer + helpers from screener.py
from screener import (
    SECTOR_ETFS, SECTOR_STOCKS, BENCHMARK, DB_PATH,
    fetch_data, fetch_macro, classify_regime, build_chart_data,
    calc_sma, calc_sma_series, calc_rsi, calc_atr,
    calc_return, calc_cmf, calc_mfi, calc_obv_divergence, calc_updown_vol,
    fetch_finra_short_volume, sf, fmt, fmt_pct, pc, safe_json,
)

# ============================================================
# TURNAROUND-SPECIFIC HELPERS
# ============================================================
def pct_off_52w_high(closes, highs):
    """How far below the 52-week high the current price sits, as a %."""
    window = highs[-252:] if len(highs) >= 252 else highs
    hi = float(max(window))
    if hi <= 0: return None
    return (hi - float(closes[-1])) / hi * 100.0

def ma_reclaimed(closes, sma_series, lookback):
    """True if price is now above the MA but was below it within `lookback` days."""
    if not sma_series or sma_series[-1] is None: return False
    if float(closes[-1]) <= sma_series[-1]: return False
    for i in range(2, lookback + 2):
        if i > len(closes): break
        s = sma_series[-i]
        if s is not None and float(closes[-i]) < s:
            return True
    return False

def ma_slope_pct(sma_series, lookback):
    """% change of the MA over `lookback` bars. Positive = curling up."""
    if not sma_series or len(sma_series) <= lookback: return None
    now, then = sma_series[-1], sma_series[-1 - lookback]
    if now is None or then is None or then == 0: return None
    return (now - then) / then * 100.0

# ============================================================
# TURNAROUND SCORING
# ============================================================
def score_turnaround(closes, highs, lows, volumes, bench, finra_data=None):
    n = len(closes)
    price = float(closes[-1])
    bd = {}

    # --- 1. RECOVERY ZONE (25 pts) — the gatekeeper ---
    off_high = pct_off_52w_high(closes, highs)
    if off_high is None:
        rz = 0
    elif off_high < 8:      rz = 0    # too close to highs — this is a momentum stock, not a turnaround
    elif off_high < 15:     rz = 12   # mild dip — borderline
    elif off_high < 35:     rz = 25   # SWEET SPOT — real damage, recoverable
    elif off_high < 50:     rz = 18   # deep — more risk, more reward
    elif off_high < 65:     rz = 8    # very deep — structural risk
    else:                   rz = 3    # falling knife
    bd["Recovery"] = rz

    # --- 2. STABILIZATION (20 pts) — has it stopped falling? ---
    sma20   = calc_sma(closes, 20)
    sma50   = calc_sma(closes, 50)
    sma200  = calc_sma(closes, 200)
    s20_ser = calc_sma_series(closes, 20)
    s50_ser = calc_sma_series(closes, 50)
    s200_ser = calc_sma_series(closes, 200)
    st = 0
    if sma50 and price > sma50:
        st += 8 if ma_reclaimed(closes, s50_ser, 15) else 4   # fresh reclaim > just holding
    if sma200 and price > sma200:
        st += 5 if ma_reclaimed(closes, s200_ser, 25) else 2
    slope20 = ma_slope_pct(s20_ser, 5)
    if slope20 is not None and slope20 > 0:
        st += 4   # 20MA curling up
    slope50 = ma_slope_pct(s50_ser, 10)
    if slope50 is not None and slope50 > -1:
        st += 3   # 50MA flattening / no longer falling hard
    st = min(20, st)
    bd["Stabilize"] = st

    # --- 3. ACCUMULATION (30 pts) — smart money fingerprint ---
    cmf     = calc_cmf(closes, highs, lows, volumes, 20)
    mfi     = calc_mfi(closes, highs, lows, volumes, 14)
    obv_div = calc_obv_divergence(closes, volumes, 20)
    udv     = calc_updown_vol(closes, volumes, 20)
    cmf_10ago = (calc_cmf(closes[:-10], highs[:-10], lows[:-10], volumes[:-10], 20)
                 if n > 35 else None)
    ac = 0
    # OBV divergence is THE turnaround signal — hidden accumulation weighted heaviest
    ac += {"bullish": 12, "confirmed_bull": 8, "neutral": 2,
           "confirmed_bear": -2, "bearish": -5}.get(obv_div, 2)
    # CMF crossover: was negative, now positive = money turning before price
    if cmf is not None and cmf_10ago is not None:
        if   cmf_10ago < 0 and cmf > 0.05: ac += 10   # clean crossover
        elif cmf_10ago < 0 and cmf > 0:    ac += 6    # just crossed
        elif cmf > 0.10:                   ac += 5    # accumulation ongoing
        elif cmf > 0:                      ac += 3
        elif cmf < -0.10:                  ac -= 4    # still distribution
    elif cmf is not None:
        if   cmf > 0.10: ac += 5
        elif cmf > 0:    ac += 3
        elif cmf < -0.10: ac -= 4
    # MFI recovering from oversold
    if mfi is not None:
        if   40 <= mfi <= 60: ac += 5
        elif 30 <= mfi < 40:  ac += 3
        elif mfi < 30:        ac += 1
        elif mfi > 75:        ac -= 2
    # Up/down volume improving
    if udv is not None:
        if   udv > 1.3: ac += 3
        elif udv > 1.0: ac += 1
        elif udv < 0.6: ac -= 2
    ac = max(0, min(30, ac))
    bd["Accumulate"] = ac

    # --- 4. BASE QUALITY (15 pts) — building a base, not still crashing ---
    atr_now  = calc_atr(highs, lows, closes, 14)
    atr_then = calc_atr(highs[:-20], lows[:-20], closes[:-20], 14) if n > 45 else None
    bq = 0
    if atr_now and atr_then and atr_then > 0:
        if   atr_now < atr_then * 0.85: bq += 6   # significant volatility contraction
        elif atr_now < atr_then:        bq += 3
    recent_low = float(min(lows[-10:]))
    prior_low  = float(min(lows[-30:-10])) if n > 30 else None
    if prior_low and recent_low > prior_low:
        bq += 6   # higher low formed = base building
    low_3m = float(min(lows[-63:])) if n >= 63 else float(min(lows))
    if price > low_3m * 1.05:
        bq += 3   # at least 5% above the 3-month low
    bq = min(15, bq)
    bd["Base"] = bq

    # --- 5. MOMENTUM TURN (10 pts) — the turn confirming ---
    rsi       = calc_rsi(closes)
    rsi_10ago = calc_rsi(closes[:-10]) if n > 24 else None
    ret1w     = calc_return(closes, 5)
    ret1m     = calc_return(closes, 21)
    mt = 0
    if rsi is not None:
        if   40 <= rsi <= 60: mt += 5
        elif 30 <= rsi < 40:  mt += 3
        elif 60 < rsi <= 70:  mt += 2
        elif rsi < 30:        mt += 1
        elif rsi > 75:        mt -= 2
    if rsi is not None and rsi_10ago is not None and rsi > rsi_10ago + 5:
        mt += 3   # RSI rising meaningfully
    if ret1w is not None and ret1m is not None and ret1w > 0 and ret1m < 0:
        mt += 2   # short-term turning while still down on the month
    mt = max(0, min(10, mt))
    bd["MomTurn"] = mt

    score = rz + st + ac + bq + mt

    return {
        "score": round(score), "price": round(price, 2),
        "off_high": sf(off_high), "ret1w": ret1w, "ret1m": ret1m,
        "ret3m": calc_return(closes, 63),
        "rsi": rsi, "atr": sf(atr_now),
        "sma20": sma20, "sma50": sma50, "sma200": sma200,
        "cmf": cmf, "cmf_10ago": sf(cmf_10ago), "mfi": mfi,
        "obv_div": obv_div, "updown_vol": udv,
        "reclaim_50": ma_reclaimed(closes, s50_ser, 15),
        "reclaim_200": ma_reclaimed(closes, s200_ser, 25),
        "finra_short_pct": finra_data.get("short_pct") if finra_data else None,
        "bd": bd,
        "bd_max": {"Recovery": 25, "Stabilize": 20, "Accumulate": 30,
                   "Base": 15, "MomTurn": 10},
    }

def get_turn_signal(sc):
    if sc >= 75: return ("STRONG TURNAROUND", "#22c55e", "rgba(34,197,94,0.12)")
    if sc >= 60: return ("EMERGING TURN",     "#4ade80", "rgba(74,222,128,0.10)")
    if sc >= 45: return ("EARLY / WATCH",     "#fbbf24", "rgba(251,191,36,0.10)")
    if sc >= 30: return ("STILL FALLING",     "#f97316", "rgba(249,115,22,0.10)")
    return ("FALLING KNIFE", "#ef4444", "rgba(239,68,68,0.10)")

# ============================================================
# DB — separate table so it never collides with screener.py
# ============================================================
class TurnaroundDB:
    def __init__(self, path=DB_PATH):
        self.conn = sqlite3.connect(path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS turnaround_scores (
                date TEXT, symbol TEXT, score INTEGER,
                off_high REAL, cmf REAL, mfi REAL, rsi REAL,
                updown_vol REAL, recovery INTEGER, stabilize INTEGER,
                accumulate INTEGER, base INTEGER, momturn INTEGER,
                PRIMARY KEY (date, symbol)
            );
        """)
        self.conn.commit()

    def save(self, date_str, symbol, d):
        try:
            bd = d.get("bd", {})
            self.conn.execute(
                "INSERT OR REPLACE INTO turnaround_scores VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (date_str, symbol, d.get("score"), d.get("off_high"),
                 d.get("cmf"), d.get("mfi"), d.get("rsi"), d.get("updown_vol"),
                 bd.get("Recovery"), bd.get("Stabilize"), bd.get("Accumulate"),
                 bd.get("Base"), bd.get("MomTurn"))
            )
            self.conn.commit()
        except Exception:
            pass

    def close(self):
        try: self.conn.close()
        except Exception: pass

# ============================================================
# HTML REPORT
# ============================================================
GUIDE_HTML = '''
<div class="tt" id="guide-toggle" onclick="toggleGuide()" style="cursor:pointer">
  How to Read This Report &amp; Reconcile with the Momentum Screener
  <span id="guide-arrow" style="font-size:11px;color:#64748b"> &#9660; tap to expand</span>
</div>
<div id="guide-body" style="display:none">

<div class="guide-section" style="border:2px solid rgba(34,197,94,0.30);background:rgba(34,197,94,0.04)">
  <div class="guide-title" style="color:#4ade80">TWO SCREENERS, TWO QUESTIONS</div>
  <div class="recon-grid">
    <div class="recon-card" style="border-color:#6366f1">
      <div class="rc-h" style="color:#a5b4fc">MOMENTUM SCREENER (screener.py)</div>
      <div class="rc-q">"What is working RIGHT NOW?"</div>
      <div class="rc-d">Buys strength. Rewards stocks above their moving averages, leading the market, near highs. Trends persist — you ride them.</div>
      <div class="rc-d" style="color:#64748b">Best in: trending / bull markets.</div>
    </div>
    <div class="recon-card" style="border-color:#22c55e">
      <div class="rc-h" style="color:#4ade80">TURNAROUND SCREENER (turnaround.py)</div>
      <div class="rc-q">"What is ABOUT to work?"</div>
      <div class="rc-d">Buys the bottom. Rewards beaten-down stocks where smart money is accumulating before price recovers. A stock at all-time highs scores ZERO here.</div>
      <div class="rc-d" style="color:#64748b">Best in: choppy / correction / early-recovery markets.</div>
    </div>
  </div>
</div>

<div class="guide-section">
  <div class="guide-title">HOW TO RECONCILE THE TWO — DECISION RULES</div>
  <div class="guide-grid2">
    <div class="guide-rule green-rule">
      <div class="gr-title">THE GOLDEN OVERLAP (rare, highest conviction)</div>
      <div class="gr-items">
        <div>&#9733; A stock scoring 65+ on BOTH screeners</div>
        <div>&#8594; It was beaten down, is reclaiming its MAs, AND momentum is returning</div>
        <div>&#8594; This is the cleanest entry — damage done, recovery confirmed</div>
        <div>&#8594; Size up. These are your A+ trades.</div>
      </div>
    </div>
    <div class="guide-rule yellow-rule">
      <div class="gr-title">LET THE REGIME PICK THE LIST</div>
      <div class="gr-items">
        <div>&#8594; Regime TRENDING UP &#8594; lead with the Momentum list</div>
        <div>&#8594; Regime CHOPPY / RISK-OFF / early recovery &#8594; lead with this Turnaround list</div>
        <div>&#8594; Regime BEAR &#8594; sit out or paper-trade only</div>
        <div>&#8594; The macro panel at the top tells you which mode you're in</div>
      </div>
    </div>
    <div class="guide-rule red-rule">
      <div class="gr-title">DON'T MIX SIZING</div>
      <div class="gr-items">
        <div>&#10007; Momentum entries: tight stops, trail the trend</div>
        <div>&#10007; Turnaround entries: WIDER stops — bottoms are messy &amp; retest</div>
        <div>&#10007; Scale into turnarounds (1/3, 1/3, 1/3), don't full-send</div>
        <div>&#10007; A turnaround that breaks to a new low = thesis dead, exit</div>
      </div>
    </div>
  </div>
</div>

<div class="guide-section">
  <div class="guide-title">THE 5 TURNAROUND BUCKETS</div>
  <div class="guide-grid">
    <div class="guide-card">
      <div class="gc-title" style="color:#6366f1">Recovery Zone &mdash; 25 pts</div>
      <div class="gc-body">The gatekeeper. Measures % below the 52-week high. A stock must be genuinely beaten down to qualify &mdash; if it is within 8% of its high it scores 0, because that is a momentum stock, not a turnaround.</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">15&ndash;35% off</span><span class="gc-label">Sweet spot &mdash; real damage, recoverable</span></div>
        <div class="gc-row"><span class="gc-val green">35&ndash;50% off</span><span class="gc-label">Deep &mdash; more risk, more reward</span></div>
        <div class="gc-row"><span class="gc-val muted">8&ndash;15% off</span><span class="gc-label">Mild dip &mdash; borderline turnaround</span></div>
        <div class="gc-row"><span class="gc-val red">&lt; 8% off</span><span class="gc-label">Too close to highs &mdash; NOT a turnaround (0 pts)</span></div>
        <div class="gc-row"><span class="gc-val red">&gt; 65% off</span><span class="gc-label">Falling knife &mdash; likely structural problem</span></div>
      </div>
    </div>
    <div class="guide-card">
      <div class="gc-title" style="color:#a78bfa">Stabilization &mdash; 20 pts</div>
      <div class="gc-body">Has it stopped falling? Rewards price reclaiming the 50MA / 200MA <em>from below</em> (fresh reclaim beats just holding), the 20MA curling up, and the 50MA flattening out.</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">RECLAIM 50 &#9733;</span><span class="gc-label">Price crossed back above 50MA recently &mdash; the classic trigger</span></div>
        <div class="gc-row"><span class="gc-val green">RECLAIM 200</span><span class="gc-label">Price back above the long-term line</span></div>
        <div class="gc-row"><span class="gc-val muted">20MA &#8593;</span><span class="gc-label">Short-term trend curling up</span></div>
      </div>
    </div>
    <div class="guide-card">
      <div class="gc-title" style="color:#22d3ee">Accumulation &mdash; 30 pts</div>
      <div class="gc-body">The heart of the screen. Smart money buys bottoms quietly. OBV bullish divergence (HIDDEN ACC) is weighted heaviest, plus CMF crossing from negative to positive &mdash; money turning <em>before</em> price does.</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">HIDDEN ACC &#9733;</span><span class="gc-label">Price down, OBV up &mdash; institutions buying the dip</span></div>
        <div class="gc-row"><span class="gc-val green">CMF crossover</span><span class="gc-label">CMF was negative ~10 days ago, now positive</span></div>
        <div class="gc-row"><span class="gc-val muted">MFI 40&ndash;60</span><span class="gc-label">Money flow recovering from oversold</span></div>
      </div>
    </div>
    <div class="guide-card">
      <div class="gc-title" style="color:#fbbf24">Base Quality &mdash; 15 pts</div>
      <div class="gc-body">Is it building a base, or still crashing? Rewards volatility contraction (panic selling calming down), a higher low forming vs the prior swing low, and price holding above the 3-month low.</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">VOL CONTRACT</span><span class="gc-label">ATR shrinking &mdash; the panic is over</span></div>
        <div class="gc-row"><span class="gc-val green">HIGHER LOW</span><span class="gc-label">Recent low above the prior low &mdash; base building</span></div>
      </div>
    </div>
    <div class="guide-card">
      <div class="gc-title" style="color:#34d399">Momentum Turn &mdash; 10 pts</div>
      <div class="gc-body">Is the turn confirming? Rewards RSI curling up <em>from</em> oversold into the 40&ndash;60 recovery zone &mdash; and PENALIZES RSI &gt; 75, because if it is overbought the turn already happened and you are late.</div>
      <div class="gc-rows">
        <div class="gc-row"><span class="gc-val green">RSI 40&ndash;60 &amp; rising</span><span class="gc-label">Recovering with room to run</span></div>
        <div class="gc-row"><span class="gc-val red">RSI &gt; 75</span><span class="gc-label">Too late &mdash; the move already happened</span></div>
      </div>
    </div>
  </div>
</div>

</div>
'''

def build_bd_html(bd, bd_max, sig_c):
    h = ""
    for k, m in bd_max.items():
        v = bd.get(k, 0)
        p = min(100, v / m * 100) if m > 0 else 0
        h += (f'<div class="bdi"><div class="bdl">{k}</div>'
              f'<div class="bdo"><div class="bdf" style="width:{p:.0f}%;background:{sig_c}"></div></div>'
              f'<div class="bdv">{v}/{m}</div></div>')
    return h

def generate_html(ranked, bench, macro, regime, scan_time, charts):
    chart_json = safe_json(charts)
    bench_html = "".join(
        f'<span><span class="bk">{k}:</span><span class="bv {pc(v)}">{fmt_pct(v)}</span></span>'
        for k, v in bench.items()
    )
    vix = macro.get("VIX", {}).get("current")
    tnx = macro.get("TNX", {}).get("current")
    dxy = macro.get("DXY", {}).get("current")
    macro_html = f'''<div class="cd" style="border-color:{regime['color']}40">
<div class="r"><div><div class="sym" style="color:{regime['color']}">{regime['regime']}</div><div class="nm">{regime['desc']}</div></div>
<div style="text-align:right"><div class="sv" style="color:{regime['color']}">VIX: {fmt(vix,1)}</div></div></div>
<div class="mid">
<div class="st"><div class="sl">10Y Yield</div><div class="sv muted">{fmt(tnx,2)}%</div></div>
<div class="st"><div class="sl">USD Index</div><div class="sv muted">{fmt(dxy,1)}</div></div>
<div class="st"><div class="sl">SPY</div><div class="sv">${fmt(regime.get('spy_price'))}</div></div>
</div></div>'''

    rows = ""
    for i, s in enumerate(ranked):
        if s.get("error"):
            continue
        sym = s["symbol"]
        sl, sc, sb = get_turn_signal(s["score"])
        bd_html = build_bd_html(s.get("bd", {}), s.get("bd_max", {}), sc)
        tags = ""
        if s.get("obv_div") == "bullish":
            tags += '<span class="tag" style="background:rgba(34,197,94,0.15);color:#4ade80">HIDDEN ACC &#9733;</span>'
        if s.get("reclaim_50"):
            tags += '<span class="tag" style="background:rgba(167,139,250,0.15);color:#a78bfa">RECLAIM 50</span>'
        if s.get("reclaim_200"):
            tags += '<span class="tag" style="background:rgba(99,102,241,0.15);color:#818cf8">RECLAIM 200</span>'
        cmf, cmf0 = s.get("cmf"), s.get("cmf_10ago")
        if cmf is not None and cmf0 is not None and cmf0 < 0 and cmf > 0:
            tags += '<span class="tag" style="background:rgba(34,211,238,0.15);color:#22d3ee">CMF CROSSOVER</span>'
        rows += f'''<div class="cd ck" onclick="T('{sym}')">
<div class="r">
  <div class="ri2"><div class="bar" style="background:{sc}"></div>
    <div><div class="sym">{sym} <span class="rk">#{i+1}</span></div>
    <div class="nm">{s.get('name','')} &middot; {fmt(s.get('off_high'),1)}% off 52w high</div></div></div>
  <div style="text-align:right"><div class="sc" style="color:{sc}">{s['score']}</div>
    <span class="sg" style="background:{sb};color:{sc}">{sl}</span></div>
</div>
<div class="tags">{tags}</div>
<div class="grd">
  <div><div class="gl">Price</div><div class="gv">${fmt(s.get('price'))}</div></div>
  <div><div class="gl">CMF</div><div class="gv">{fmt(s.get('cmf'),3)}</div></div>
  <div><div class="gl">MFI</div><div class="gv">{fmt(s.get('mfi'),0)}</div></div>
  <div><div class="gl">RSI</div><div class="gv">{fmt(s.get('rsi'),0)}</div></div>
  <div><div class="gl">UD Vol</div><div class="gv">{fmt(s.get('updown_vol'),2)}</div></div>
  <div><div class="gl">OBV Div</div><div class="gv">{s.get('obv_div','?')}</div></div>
  <div><div class="gl">1M Ret</div><div class="gv {pc(s.get('ret1m'))}">{fmt_pct(s.get('ret1m'))}</div></div>
  <div><div class="gl">3M Ret</div><div class="gv {pc(s.get('ret3m'))}">{fmt_pct(s.get('ret3m'))}</div></div>
</div>
<div class="bd">{bd_html}</div>
<div class="hint">tap for charts</div>
</div>
<div class="cp" id="c-{sym}">
<canvas id="p-{sym}" height="70"></canvas>
<canvas id="r-{sym}" height="42"></canvas>
<canvas id="mf-{sym}" height="42"></canvas>
<canvas id="v-{sym}" height="42"></canvas>
</div>'''

    js_code = '''
function toggleGuide(){var b=document.getElementById('guide-body');var a=document.getElementById('guide-arrow');
var open=b.style.display==='block';b.style.display=open?'none':'block';
a.innerHTML=open?'\\u25BC tap to expand':'\\u25B2 tap to collapse';}
var D=''' + chart_json + ''';var R={};
function T(sym){var p=document.getElementById('c-'+sym);if(!p)return;
if(p.style.display==='none'||p.style.display===''){p.style.display='block';if(!R[sym]){draw(sym);R[sym]=true}}
else{p.style.display='none'}}
function draw(sym){var d=D[sym];if(!d)return;var lb=d.lb.map(function(l){return l.slice(5)});
var opts=function(t){return{responsive:true,plugins:{title:{display:true,text:t,color:'#94a3b8',font:{size:10,weight:600}},legend:{labels:{boxWidth:12,padding:8,font:{size:8}}}},scales:{x:{ticks:{maxTicksLimit:8,font:{size:7}}},y:{position:'right',ticks:{font:{size:8}}}}}};
new Chart(document.getElementById('p-'+sym),{type:'line',data:{labels:lb,datasets:[
{label:'Price',data:d.pr,borderColor:'#e2e8f0',borderWidth:1.5,pointRadius:0,tension:0.1},
{label:'20 SMA',data:d.s20,borderColor:'#6366f1',borderWidth:1,pointRadius:0,borderDash:[3,2]},
{label:'50 SMA',data:d.s50,borderColor:'#f97316',borderWidth:1,pointRadius:0,borderDash:[3,2]},
{label:'200 SMA',data:d.s200,borderColor:'#ef4444',borderWidth:1,pointRadius:0,borderDash:[5,3]}
]},options:opts(sym+' - Price + Moving Averages')});
var ro=opts('RSI (14)');ro.scales.y={min:0,max:100,position:'right',ticks:{stepSize:25,font:{size:8}}};ro.plugins.legend={display:false};
new Chart(document.getElementById('r-'+sym),{type:'line',data:{labels:lb,datasets:[{label:'RSI',data:d.rsi,borderColor:'#a78bfa',borderWidth:1.5,pointRadius:0}]},options:ro});
var cmfClrs=d.cmf.map(function(v){return v===null?'transparent':v>0?'rgba(34,197,94,0.7)':'rgba(239,68,68,0.7)'});
var mfo=opts('CMF - Chaikin Money Flow (20)');mfo.scales.y={position:'right',ticks:{font:{size:8}}};mfo.plugins.legend={display:false};
new Chart(document.getElementById('mf-'+sym),{type:'bar',data:{labels:lb,datasets:[{label:'CMF',data:d.cmf,backgroundColor:cmfClrs,borderWidth:0}]},options:mfo});
var vo=opts('Volume');vo.scales.y.ticks={font:{size:8},callback:function(v){if(v>=1e9)return(v/1e9).toFixed(1)+'B';if(v>=1e6)return(v/1e6).toFixed(0)+'M';if(v>=1e3)return(v/1e3).toFixed(0)+'K';return v}};
new Chart(document.getElementById('v-'+sym),{type:'bar',data:{labels:lb,datasets:[{label:'Volume',data:d.vol,backgroundColor:d.vc,borderWidth:0},{label:'50d Avg',data:d.va,type:'line',borderColor:'#f97316',borderWidth:1.5,pointRadius:0,borderDash:[3,2]}]},options:vo});}
'''

    return f'''<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Turnaround Screener - {scan_time}</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
<style>@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}body{{font-family:'JetBrains Mono',monospace;background:#080c14;color:#e2e8f0;padding:16px}}
.hdr{{border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:16px;margin-bottom:16px}}
.hdr h1{{font-size:15px;font-weight:700;letter-spacing:.08em;color:#f8fafc;text-transform:uppercase}}
.hdr .sub{{font-size:10px;color:#64748b;margin-top:4px}}
.cd{{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:6px;padding:12px;margin-bottom:2px;font-size:11px}}
.ck{{cursor:pointer;transition:background .15s}}.ck:hover{{background:rgba(34,197,94,0.05)}}
.bnch{{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:8px}}.bk{{font-size:9px;color:#64748b;margin-right:4px}}.bv{{font-size:12px;font-weight:600}}
.r{{display:flex;justify-content:space-between;align-items:flex-start}}.ri2{{display:flex;align-items:center;gap:8px}}
.bar{{width:3px;height:34px;border-radius:2px}}.sym{{font-weight:700;font-size:13px}}.nm{{font-size:10px;color:#64748b}}
.sc{{font-weight:700;font-size:20px}}.rk{{font-size:10px;color:#64748b;font-weight:400}}
.sg{{font-size:8px;font-weight:700;letter-spacing:.06em;padding:2px 6px;border-radius:3px;white-space:nowrap;display:inline-block;margin-top:4px}}
.mid{{display:flex;gap:12px;margin-top:10px;flex-wrap:wrap}}.st .sl{{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em}}.st .sv{{font-size:12px;font-weight:600;margin-top:2px}}
.tags{{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}}.tag{{font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px}}
.grd{{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}}.gl{{font-size:8px;color:#64748b;text-transform:uppercase;letter-spacing:.06em}}.gv{{font-size:11px;font-weight:600;margin-top:2px}}
.bd{{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}}.bdi{{flex:1;min-width:60px}}.bdl{{font-size:7px;color:#64748b;text-transform:uppercase;letter-spacing:.04em}}
.bdo{{width:100%;height:3px;border-radius:2px;background:rgba(255,255,255,0.06);margin-top:2px}}.bdf{{height:100%;border-radius:2px}}.bdv{{font-size:8px;font-weight:600;color:#94a3b8;margin-top:1px}}
.hint{{font-size:8px;color:#475569;text-align:center;margin-top:6px}}
.cp{{background:rgba(255,255,255,0.01);border:1px solid rgba(255,255,255,0.04);border-top:none;border-radius:0 0 6px 6px;padding:12px;margin-bottom:10px;display:none}}.cp canvas{{margin-bottom:12px}}
.tt{{font-size:13px;font-weight:700;letter-spacing:.06em;color:#f8fafc;text-transform:uppercase;margin:24px 0 12px}}
.ft{{margin-top:32px;padding:12px 0;border-top:1px solid rgba(255,255,255,0.04);font-size:9px;color:#334155}}
.green{{color:#4ade80}}.red{{color:#f87171}}.muted{{color:#94a3b8}}
.guide-section{{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:16px;margin-bottom:10px}}
.guide-title{{font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px}}
.recon-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}}
.recon-card{{border:1px solid;border-radius:6px;padding:12px;background:rgba(255,255,255,0.02)}}
.rc-h{{font-size:11px;font-weight:700;margin-bottom:6px}}.rc-q{{font-size:11px;color:#e2e8f0;font-style:italic;margin-bottom:8px}}
.rc-d{{font-size:9px;color:#94a3b8;line-height:1.5;margin-bottom:4px}}
.guide-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-top:8px}}
.guide-card{{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:12px}}
.gc-title{{font-size:11px;font-weight:700;margin-bottom:8px}}.gc-body{{font-size:9px;color:#94a3b8;margin-bottom:10px;line-height:1.5}}
.gc-rows{{display:flex;flex-direction:column;gap:5px}}.gc-row{{display:flex;gap:10px;align-items:baseline}}
.gc-val{{font-size:9px;font-weight:700;min-width:95px;flex-shrink:0}}.gc-label{{font-size:9px;color:#64748b}}
.guide-grid2{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin-top:8px}}
.guide-rule{{border-radius:6px;padding:12px}}
.green-rule{{background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2)}}
.red-rule{{background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2)}}
.yellow-rule{{background:rgba(251,191,36,0.05);border:1px solid rgba(251,191,36,0.2)}}
.gr-title{{font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:.06em;margin-bottom:8px}}
.gr-items{{display:flex;flex-direction:column;gap:5px;font-size:9px;color:#94a3b8}}
</style></head><body>
<div class="hdr"><h1>Turnaround Screener v1.0 &mdash; Reversal / Recovery Edition</h1>
<div class="sub">{scan_time} | Companion to the Momentum Screener | Not financial advice</div></div>
<div class="tt">Macro Regime</div>{macro_html}
<div class="cd bnch"><span style="font-size:9px;font-weight:700;color:#64748b;letter-spacing:.1em">SPY</span>{bench_html}</div>
{GUIDE_HTML}
<div class="tt">Turnaround Leaderboard &mdash; All {len(ranked)} Stocks Ranked</div>
{rows}
<div class="ft">Turnaround v1.0 | Signals: % off 52w high, MA reclaim, OBV divergence, CMF crossover, volatility contraction, RSI turn | Separate from screener.py | Not financial advice.</div>
<script>{js_code}</script></body></html>'''

# ============================================================
# MAIN
# ============================================================
def main():
    scan_dt  = datetime.now()
    ts       = scan_dt.strftime("%Y%m%d_%H%M")
    date_str = scan_dt.strftime("%Y-%m-%d")
    print(f"\n  TURNAROUND SCREENER v1.0 | {scan_dt.strftime('%B %d, %Y %I:%M %p')}\n")

    os.makedirs("reports", exist_ok=True)
    db = TurnaroundDB()

    print("  [1/4] Macro environment...")
    macro = fetch_macro()

    print("\n  [2/4] SPY benchmark...")
    spy = fetch_data(BENCHMARK)
    if not spy:
        print("  SPY FAILED"); sys.exit(1)
    bench  = {"1W": calc_return(spy["closes"], 5),
              "1M": calc_return(spy["closes"], 21),
              "3M": calc_return(spy["closes"], 63)}
    regime = classify_regime(macro, spy)
    print(f"    SPY: ${round(float(spy['closes'][-1]),2)} | Regime: {regime['regime']}")

    all_symbols = [tk for _s, _n, _c in SECTOR_ETFS for tk in SECTOR_STOCKS.get(_s, [])]
    sector_of = {}
    for sym, nm, _c in SECTOR_ETFS:
        for tk in SECTOR_STOCKS.get(sym, []):
            sector_of[tk] = nm

    print("\n  [3/4] FINRA short sale volume...")
    finra = fetch_finra_short_volume(all_symbols, lookback_days=5)

    print(f"\n  [4/4] Scoring {len(all_symbols)} stocks for turnaround setups...")
    charts = {}
    ranked = []
    for tk in all_symbols:
        print(f"    {tk}...", end=" ", flush=True)
        d = fetch_data(tk)
        if not d:
            ranked.append({"symbol": tk, "error": True})
            print("X"); continue
        r = score_turnaround(d["closes"], d["highs"], d["lows"], d["volumes"],
                             bench, finra_data=finra.get(tk))
        r["symbol"] = tk
        r["name"]   = sector_of.get(tk, "")
        ranked.append(r)
        charts[tk] = build_chart_data(d, spy)
        db.save(date_str, tk, r)
        sig, _, _ = get_turn_signal(r["score"])
        print(f"{r['score']:3d}  {sig}  off-high:{fmt(r.get('off_high'),1)}%  "
              f"CMF:{fmt(r.get('cmf'),3)}  OBV:{r.get('obv_div','?')}")
        time.sleep(0.1)

    ranked.sort(key=lambda x: x.get("score", 0), reverse=True)

    print("\n  Generating outputs...")
    scan_time = scan_dt.strftime("%B %d, %Y %I:%M %p")
    html = generate_html(ranked, bench, macro, regime, scan_time, charts)
    html_path = os.path.join("reports", f"turnaround_{ts}.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    with open("turnaround_report.html", "w", encoding="utf-8") as f:
        f.write(html)
    db.close()

    valid = [r for r in ranked if not r.get("error")]
    strong = [r for r in valid if r["score"] >= 75]
    emerging = [r for r in valid if 60 <= r["score"] < 75]

    print(f"\n  {'='*54}")
    print(f"  REGIME: {regime['regime']}")
    print(f"  TOP TURNAROUND CANDIDATES:")
    for i, r in enumerate(valid[:10]):
        sig, _, _ = get_turn_signal(r["score"])
        print(f"  {i+1:2d}. {r['symbol']:5s} {r['score']:3d}  {sig:18s}  "
              f"{fmt(r.get('off_high'),1)}% off high  CMF:{fmt(r.get('cmf'),3)}")
    print(f"\n  Strong turnarounds (75+): {len(strong)} | Emerging (60-74): {len(emerging)}")
    print(f"  {'='*54}")
    print(f"\n  Files:")
    print(f"    reports/turnaround_{ts}.html")
    print(f"    turnaround_report.html (latest)")
    print(f"    money_flow_history.db -> turnaround_scores table")
    print(f"\n  Run daily alongside screener.py. Not financial advice.\n")

if __name__ == "__main__":
    main()
