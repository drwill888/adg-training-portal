#!/usr/bin/env python3
"""
============================================================
STOCK PICKS ENGINE v1.0 — Signal Confluence & Position Manager
============================================================
Runs AFTER screener.py and turnaround.py. Reads both score
sets from SQLite, applies multi-factor conviction ranking,
manages paper positions with ATR-based stops, and generates
a picks report.

PICKS LOGIC:
  CONFLUENCE  (mom ≥ 58 AND turn ≥ 58) — highest conviction
              composite = 55% × mom + 45% × turn
  MOMENTUM    (mom ≥ 70)
              composite = 85% × mom + 15% × turn
  TURNAROUND  (turn ≥ 62)
              composite = 15% × mom + 85% × turn

POSITION MANAGEMENT:
  Entry  : last close price when signal fires
  Stop   : entry − 1.5 × ATR(14)          — technical stop
  Target : entry + 2.5 × risk  (mom/conf) — 2.5 : 1 reward/risk
           entry + 2.0 × risk  (turn only) — 2.0 : 1
  Time   : close after 25 sessions if P&L < 3%
  Signal : close momentum pick if score drops 12+ pts from entry

FILTERS:
  Volume ≥ 400K avg (20d)
  CMF ≥ −0.10 (don't fight strong distribution)
  Max 2 picks per sector (open + new combined)
  Hard cap: 20 open positions total

Outputs:
  picks_report.html              (latest, always overwritten)
  reports/picks_{ts}.html
  money_flow_history.db  →  picks  +  pick_daily  tables
============================================================
Not financial advice.
"""
import sys, os, json, math, sqlite3, time
from datetime import datetime

try:
    import numpy as np
except ImportError:
    print("\n  pip install yfinance numpy\n"); sys.exit(1)

from screener import (
    SECTOR_ETFS, SECTOR_STOCKS, BENCHMARK, DB_PATH,
    fetch_data, fetch_macro, classify_regime, fetch_fundamentals,
    calc_atr, calc_return, calc_cmf, calc_mfi,
    calc_obv_divergence, calc_updown_vol, calc_rsi, calc_sma,
    sf, fmt, fmt_pct, pc, safe_json,
)

# ============================================================
# CONFIG
# ============================================================
MOMENTUM_THRESH    = 70    # min screener score → momentum pick
TURNAROUND_THRESH  = 62    # min turnaround score → turnaround pick
CONFLUENCE_MOM_TH  = 58    # both scores must exceed these for confluence
CONFLUENCE_TURN_TH = 58
HOLD_DROP          = 12    # close momentum pick if score drops this many pts
ATR_STOP_MULT      = 1.5   # stop = entry − N × ATR(14)
REWARD_RISK_MOM    = 2.5   # target R:R for momentum / confluence
REWARD_RISK_TURN   = 2.0   # target R:R for turnaround-only
TIME_STOP_SESSIONS = 25    # max sessions before time stop
TIME_STOP_MIN_PNL  = 3.0   # only time-stop when P&L below this %
MAX_OPEN_PICKS     = 20    # hard cap on concurrent open positions
MAX_PER_SECTOR     = 2     # max picks per sector (open + new combined)
MIN_AVG_VOLUME     = 400_000   # skip illiquid stocks

# ============================================================
# DB LAYER
# ============================================================
class PicksDB:
    def __init__(self, path=DB_PATH):
        self.conn = sqlite3.connect(path)
        self._init()

    def _init(self):
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS picks (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                date_opened      TEXT    NOT NULL,
                symbol           TEXT    NOT NULL,
                sector           TEXT,
                sector_name      TEXT,
                pick_type        TEXT,
                conviction       TEXT,
                entry_price      REAL,
                stop_price       REAL,
                target_price     REAL,
                atr_at_entry     REAL,
                composite_score  REAL,
                momentum_score   REAL,
                turnaround_score REAL,
                cmf              REAL,
                mfi              REAL,
                obv_div          TEXT,
                rsi              REAL,
                ret1m            REAL,
                status           TEXT DEFAULT 'OPEN',
                date_closed      TEXT,
                close_price      REAL,
                pnl_pct          REAL,
                sessions_held    INTEGER DEFAULT 0,
                notes            TEXT
            );
            CREATE TABLE IF NOT EXISTS pick_daily (
                date             TEXT    NOT NULL,
                pick_id          INTEGER NOT NULL,
                symbol           TEXT    NOT NULL,
                price            REAL,
                pnl_pct          REAL,
                momentum_score   REAL,
                turnaround_score REAL,
                status           TEXT DEFAULT 'OPEN',
                PRIMARY KEY (date, pick_id)
            );
        """)
        self.conn.commit()

    def get_open(self):
        cur = self.conn.cursor()
        cur.execute("SELECT * FROM picks WHERE status='OPEN' ORDER BY date_opened")
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in cur.fetchall()]

    def save_pick(self, d):
        cols = list(d.keys())
        vals = list(d.values())
        ph   = ",".join(["?"] * len(cols))
        cur  = self.conn.cursor()
        cur.execute(f"INSERT INTO picks ({','.join(cols)}) VALUES ({ph})", vals)
        self.conn.commit()
        return cur.lastrowid

    def update(self, pick_id, updates):
        stmt = ",".join([f"{k}=?" for k in updates])
        self.conn.execute(
            f"UPDATE picks SET {stmt} WHERE id=?",
            list(updates.values()) + [pick_id]
        )
        self.conn.commit()

    def log_daily(self, date_str, pick_id, symbol, price, pnl_pct,
                  mom_sc, turn_sc, status):
        self.conn.execute("""
            INSERT OR REPLACE INTO pick_daily
            (date,pick_id,symbol,price,pnl_pct,momentum_score,turnaround_score,status)
            VALUES (?,?,?,?,?,?,?,?)
        """, (date_str, pick_id, symbol, price, pnl_pct, mom_sc, turn_sc, status))
        self.conn.commit()

    def get_closed(self, limit=50):
        cur = self.conn.cursor()
        cur.execute(
            "SELECT * FROM picks WHERE status!='OPEN' ORDER BY date_closed DESC LIMIT ?",
            (limit,)
        )
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in cur.fetchall()]

    def is_open(self, symbol):
        r = self.conn.execute(
            "SELECT id FROM picks WHERE symbol=? AND status='OPEN'", (symbol,)
        ).fetchone()
        return r is not None

    def open_by_sector(self):
        rows = self.conn.execute(
            "SELECT sector, COUNT(*) FROM picks WHERE status='OPEN' GROUP BY sector"
        ).fetchall()
        return dict(rows)

    def stats(self):
        total = self.conn.execute(
            "SELECT COUNT(*) FROM picks WHERE status!='OPEN'"
        ).fetchone()[0]
        wins  = self.conn.execute(
            "SELECT COUNT(*) FROM picks WHERE pnl_pct>0 AND status!='OPEN'"
        ).fetchone()[0]
        avg   = self.conn.execute(
            "SELECT AVG(pnl_pct) FROM picks WHERE status!='OPEN'"
        ).fetchone()[0]
        best  = self.conn.execute(
            "SELECT MAX(pnl_pct) FROM picks WHERE status!='OPEN'"
        ).fetchone()[0]
        worst = self.conn.execute(
            "SELECT MIN(pnl_pct) FROM picks WHERE status!='OPEN'"
        ).fetchone()[0]
        open_n = self.conn.execute(
            "SELECT COUNT(*) FROM picks WHERE status='OPEN'"
        ).fetchone()[0]
        win_r = round(wins / total * 100, 1) if total else None
        return {
            "total": total, "wins": wins, "win_rate": win_r,
            "avg_pnl": round(avg, 2) if avg else None,
            "best":    round(best, 2) if best else None,
            "worst":   round(worst, 2) if worst else None,
            "open":    open_n,
        }

    def close(self):
        try:
            self.conn.close()
        except Exception:
            pass


# ============================================================
# SIGNAL HELPERS
# ============================================================
def compute_composite(mom_sc, turn_sc, pick_type):
    if pick_type == "CONFLUENCE":
        return round(mom_sc * 0.55 + turn_sc * 0.45, 1)
    if pick_type == "MOMENTUM":
        return round(mom_sc * 0.85 + (turn_sc or 0) * 0.15, 1)
    return round((mom_sc or 0) * 0.15 + turn_sc * 0.85, 1)


def get_conviction(composite, pick_type):
    if pick_type == "CONFLUENCE":
        return "HIGH" if composite >= 72 else "MEDIUM"
    if pick_type == "MOMENTUM":
        if composite >= 79: return "HIGH"
        if composite >= 70: return "MEDIUM"
        return "SPECULATIVE"
    # TURNAROUND
    if composite >= 70: return "HIGH"
    if composite >= 63: return "MEDIUM"
    return "SPECULATIVE"


def conviction_color(c):
    return {"HIGH": "#22c55e", "MEDIUM": "#fbbf24",
            "SPECULATIVE": "#94a3b8"}.get(c, "#64748b")


def type_color(t):
    return {"CONFLUENCE": "#a78bfa", "MOMENTUM": "#22d3ee",
            "TURNAROUND": "#fb923c"}.get(t, "#64748b")


def close_reason_color(r):
    return {
        "TARGET_HIT":     "#22c55e",
        "STOPPED":        "#ef4444",
        "SIGNAL_EXPIRED": "#f97316",
        "TIME_STOP":      "#94a3b8",
    }.get(r, "#64748b")


def _star(conv):
    return {"HIGH": "★★★", "MEDIUM": "★★", "SPECULATIVE": "★"}.get(conv, "")


def _pnl_color(pnl):
    if pnl is None:  return "#94a3b8"
    if pnl >= 5:     return "#22c55e"
    if pnl >= 0:     return "#4ade80"
    if pnl >= -3:    return "#fbbf24"
    return "#ef4444"


# ============================================================
# LOAD TODAY'S SCORES FROM DB
# ============================================================
def load_today_scores(date_str):
    """
    Returns:
      mom_map:  {symbol → {mom_score, cmf, mfi, obv_slope, updown_vol, rs_pct, short_pct}}
      turn_map: {symbol → {turn_score, off_high, cmf, mfi, rsi, updown_vol, recovery, …}}
    Filters out sector ETF tickers — only returns stock-level entries.
    """
    stock_syms = {tk for tks in SECTOR_STOCKS.values() for tk in tks}
    conn = sqlite3.connect(DB_PATH)
    try:
        rows = conn.execute(
            "SELECT symbol,score,cmf,mfi,obv_slope,updown_vol,rs_pct,short_pct "
            "FROM scores WHERE date=?", (date_str,)
        ).fetchall()
        mom_map = {}
        for r in rows:
            sym = r[0]
            if sym not in stock_syms:
                continue
            mom_map[sym] = {
                "mom_score": r[1], "cmf": r[2], "mfi": r[3],
                "obv_slope": r[4], "updown_vol": r[5],
                "rs_pct": r[6], "short_pct": r[7],
            }
        rows2 = conn.execute(
            "SELECT symbol,score,off_high,cmf,mfi,rsi,updown_vol,"
            "recovery,stabilize,accumulate,base,momturn "
            "FROM turnaround_scores WHERE date=?", (date_str,)
        ).fetchall()
        turn_map = {}
        for r in rows2:
            turn_map[r[0]] = {
                "turn_score":  r[1],  "off_high":    r[2],
                "cmf":         r[3],  "mfi":         r[4],
                "rsi":         r[5],  "updown_vol":  r[6],
                "recovery":    r[7],  "stabilize":   r[8],
                "accumulate":  r[9],  "base":        r[10],
                "momturn":     r[11],
            }
    finally:
        conn.close()
    return mom_map, turn_map


# ============================================================
# CANDIDATE ASSESSMENT  (fresh price fetch for ATR stops)
# ============================================================
def assess_candidate(sym, mom, turn, sector, sector_name):
    """
    Fetch fresh price data, compute ATR stop/target, validate liquidity.
    Returns enriched candidate dict or None if disqualified.
    """
    d = fetch_data(sym)
    if not d:
        return None

    closes  = d["closes"]
    highs   = d["highs"]
    lows    = d["lows"]
    volumes = d["volumes"]
    price   = float(closes[-1])

    # Liquidity gate
    avg_vol = float(np.mean(volumes[-20:])) if len(volumes) >= 20 else 0
    if avg_vol < MIN_AVG_VOLUME:
        return None

    atr = calc_atr(highs, lows, closes)
    if not atr or atr <= 0:
        return None

    # Fresh flow signals (more current than DB snapshot)
    cmf     = calc_cmf(closes, highs, lows, volumes, 20)
    mfi     = calc_mfi(closes, highs, lows, volumes, 14)
    obv_div = calc_obv_divergence(closes, volumes, 20)
    rsi     = calc_rsi(closes)
    ret1m   = calc_return(closes, 21)

    # Flow distribution filter — don't fight strong selling pressure
    if cmf is not None and cmf < -0.10:
        return None

    # Earnings filter — never open a position right before an earnings event.
    # A gap through the stop overnight is unmanageable.
    fu = fetch_fundamentals(sym)
    if fu.get("earnings_soon"):
        print(f"EARNINGS SKIP", end=" ")
        return None

    mom_sc  = mom.get("mom_score",  0) or 0
    turn_sc = turn.get("turn_score", 0) or 0

    is_confluence = (mom_sc >= CONFLUENCE_MOM_TH and turn_sc >= CONFLUENCE_TURN_TH)
    is_mom        = mom_sc  >= MOMENTUM_THRESH
    is_turn       = turn_sc >= TURNAROUND_THRESH

    if not (is_confluence or is_mom or is_turn):
        return None

    pick_type  = ("CONFLUENCE" if is_confluence
                  else "MOMENTUM" if is_mom else "TURNAROUND")
    composite  = compute_composite(mom_sc, turn_sc, pick_type)
    conviction = get_conviction(composite, pick_type)

    stop  = round(price - ATR_STOP_MULT * atr, 2)
    risk  = price - stop
    if risk <= 0:
        return None
    rr     = REWARD_RISK_MOM if pick_type in ("MOMENTUM", "CONFLUENCE") else REWARD_RISK_TURN
    target = round(price + rr * risk, 2)

    sma20  = calc_sma(closes, 20)
    sma50  = calc_sma(closes, 50)
    sma200 = calc_sma(closes, 200)

    return {
        "symbol":           sym,
        "sector":           sector,
        "sector_name":      sector_name,
        "pick_type":        pick_type,
        "conviction":       conviction,
        "composite":        composite,
        "momentum_score":   mom_sc,
        "turnaround_score": turn_sc,
        "price":            price,
        "stop":             stop,
        "target":           target,
        "atr":              sf(atr),
        "risk_pct":         round(risk / price * 100, 2),
        "reward_pct":       round((target - price) / price * 100, 2),
        "cmf":              cmf,
        "mfi":              mfi,
        "obv_div":          obv_div,
        "rsi":              rsi,
        "ret1m":            ret1m,
        "avg_vol":          int(avg_vol),
        "above_20":         bool(sma20  and price > sma20),
        "above_50":         bool(sma50  and price > sma50),
        "above_200":        bool(sma200 and price > sma200),
    }


# ============================================================
# POSITION UPDATER
# ============================================================
def update_open_positions(db, date_str, mom_map, turn_map):
    """
    Checks stops, targets, time/signal expiry for every open pick.
    Returns (still_open_list, closed_today_list).
    Each element is the original DB row dict enriched with
    current_price, pnl_pct, and (for closed) close_reason.
    """
    open_picks   = db.get_open()
    closed_today = []
    still_open   = []

    for p in open_picks:
        sym   = p["symbol"]
        d     = fetch_data(sym)
        if not d:
            still_open.append(p)
            continue

        price    = float(d["closes"][-1])
        entry    = p["entry_price"]
        stop     = p["stop_price"]
        target   = p["target_price"]
        pnl_pct  = round((price - entry) / entry * 100, 2) if entry else 0
        sessions = (p["sessions_held"] or 0) + 1
        mom_sc   = mom_map.get(sym, {}).get("mom_score")
        turn_sc  = turn_map.get(sym, {}).get("turn_score")

        reason = None
        if   stop   is not None and price <= stop:
            reason = "STOPPED"
        elif target is not None and price >= target:
            reason = "TARGET_HIT"
        elif sessions >= TIME_STOP_SESSIONS and pnl_pct < TIME_STOP_MIN_PNL:
            reason = "TIME_STOP"
        elif p["pick_type"] in ("MOMENTUM", "CONFLUENCE") and mom_sc is not None:
            entry_ms = p.get("momentum_score") or 0
            if mom_sc < entry_ms - HOLD_DROP:
                reason = "SIGNAL_EXPIRED"

        if reason:
            db.update(p["id"], {
                "status":        reason,
                "date_closed":   date_str,
                "close_price":   price,
                "pnl_pct":       pnl_pct,
                "sessions_held": sessions,
            })
            closed_today.append({**p, "current_price": price,
                                  "pnl_pct": pnl_pct, "close_reason": reason})
        else:
            db.update(p["id"], {"sessions_held": sessions})
            db.log_daily(date_str, p["id"], sym, price, pnl_pct,
                         mom_sc, turn_sc, "OPEN")
            still_open.append({**p, "current_price": price, "pnl_pct": pnl_pct})

        time.sleep(0.08)

    return still_open, closed_today


# ============================================================
# PICKS GENERATION
# ============================================================
def generate_picks(db, date_str, mom_map, turn_map, regime):
    """
    Scans all stocks with scores above threshold, assesses them
    for ATR stops, applies diversification filters, returns list
    of new picks to open.
    """
    sector_name_map = {s[0]: s[1] for s in SECTOR_ETFS}
    sector_of = {}
    for etf, tickers in SECTOR_STOCKS.items():
        for tk in tickers:
            sector_of[tk] = etf

    open_syms    = {p["symbol"] for p in db.get_open()}
    open_by_sec  = db.open_by_sector()
    open_count   = len(open_syms)

    all_syms   = set(list(mom_map.keys()) + list(turn_map.keys()))
    candidates = []

    print(f"\n  Scanning {len(all_syms)} symbols for picks...")
    for sym in sorted(all_syms):
        if sym in open_syms:
            continue
        mom  = mom_map.get(sym, {})
        turn = turn_map.get(sym, {})
        m_sc = mom.get("mom_score",  0) or 0
        t_sc = turn.get("turn_score", 0) or 0

        # Quick pre-filter before expensive fetch
        passes_mom  = m_sc >= MOMENTUM_THRESH
        passes_turn = t_sc >= TURNAROUND_THRESH
        passes_conf = (m_sc >= CONFLUENCE_MOM_TH and t_sc >= CONFLUENCE_TURN_TH)
        if not (passes_mom or passes_turn or passes_conf):
            continue

        print(f"    {sym:6s} M:{m_sc:3.0f} T:{t_sc:3.0f}...", end=" ", flush=True)
        sec = sector_of.get(sym, "UNK")
        sn  = sector_name_map.get(sec, sec)
        c   = assess_candidate(sym, mom, turn, sec, sn)
        if c:
            candidates.append(c)
            print(f"OK  {c['pick_type']:11s} composite={c['composite']}")
        else:
            print("filtered")
        time.sleep(0.08)

    # Sort: conviction first, then type (CONFLUENCE > MOMENTUM > TURNAROUND), then composite
    type_rank = {"CONFLUENCE": 2, "MOMENTUM": 1, "TURNAROUND": 0}
    conv_rank = {"HIGH": 2, "MEDIUM": 1, "SPECULATIVE": 0}
    candidates.sort(key=lambda x: (
        conv_rank.get(x["conviction"], 0),
        type_rank.get(x["pick_type"],  0),
        x["composite"]
    ), reverse=True)

    new_picks  = []
    new_by_sec = {}
    for c in candidates:
        if open_count + len(new_picks) >= MAX_OPEN_PICKS:
            break
        sec = c["sector"]
        already = open_by_sec.get(sec, 0) + new_by_sec.get(sec, 0)
        if already >= MAX_PER_SECTOR:
            continue
        new_by_sec[sec] = new_by_sec.get(sec, 0) + 1
        new_picks.append(c)

    return new_picks, candidates


# ============================================================
# HTML REPORT
# ============================================================
def _pick_card(p, is_new=False):
    """Render one pick card for HTML. Works for new, open, and closed picks."""
    ptype  = p.get("pick_type", "?")
    conv   = p.get("conviction", "?")
    tc     = type_color(ptype)
    cc     = conviction_color(conv)

    # Normalise field names — new candidates use 'price'/'stop'/'target';
    # DB rows use 'entry_price'/'stop_price'/'target_price'
    entry   = p.get("entry_price")  or p.get("price")
    stop    = p.get("stop_price")   or p.get("stop")
    target  = p.get("target_price") or p.get("target")
    cur_p   = p.get("current_price") or entry
    pnl     = p.get("pnl_pct")
    pnl_c   = _pnl_color(pnl)
    sessions = p.get("sessions_held")

    risk_pct   = p.get("risk_pct")
    reward_pct = p.get("reward_pct")
    if risk_pct is None and entry and stop:
        risk_pct = round((entry - stop) / entry * 100, 2)
    if reward_pct is None and entry and target:
        reward_pct = round((target - entry) / entry * 100, 2)

    # Progress bar (stop → entry → target)
    progress_html = ""
    if not p.get("status", "OPEN") in ("STOPPED","TARGET_HIT","SIGNAL_EXPIRED","TIME_STOP"):
        if entry and stop and target and cur_p:
            total_r = target - stop
            cur_pos = cur_p   - stop
            bar_pct = max(0, min(100, cur_pos / total_r * 100)) if total_r > 0 else 0
            entry_pct = max(0, min(100, (entry - stop) / total_r * 100)) if total_r > 0 else 0
            progress_html = f'''
<div style="margin-top:10px">
  <div style="font-size:7px;color:#64748b;margin-bottom:3px;letter-spacing:.06em">STOP ──── ENTRY ──── TARGET</div>
  <div style="height:5px;background:rgba(255,255,255,0.06);border-radius:3px;position:relative">
    <div style="height:100%;width:{bar_pct:.0f}%;background:{pnl_c};border-radius:3px;transition:width .3s"></div>
    <div style="position:absolute;top:-3px;left:calc({entry_pct:.0f}% - 1px);width:2px;height:11px;background:#94a3b8;border-radius:1px"></div>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:7px;color:#475569;margin-top:3px">
    <span>${fmt(stop)}</span><span>${fmt(entry)}</span><span>${fmt(target)}</span>
  </div>
</div>'''

    obv_lbl, obv_c = {
        "bullish":        ("HIDDEN ACC ★", "#4ade80"),
        "confirmed_bull": ("CONF BULL",    "#22c55e"),
        "bearish":        ("DISTRIB",      "#ef4444"),
        "confirmed_bear": ("CONF BEAR",    "#f97316"),
        "neutral":        ("NEUTRAL",      "#64748b"),
    }.get(p.get("obv_div", "neutral"), ("?", "#64748b"))

    status = p.get("status", "OPEN")
    close_badge = ""
    if status not in ("OPEN", ""):
        close_badge = (
            f'<span style="font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px;'
            f'background:{close_reason_color(status)}20;color:{close_reason_color(status)}">'
            f'{status.replace("_"," ")}</span>'
        )

    new_badge = ""
    if is_new:
        new_badge = '<span style="font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px;background:rgba(99,102,241,0.2);color:#a5b4fc;margin-left:6px">NEW TODAY</span>'

    right_val = fmt_pct(pnl) if pnl is not None else f"${fmt(cur_p)}"
    right_sub = f"Held {sessions}d" if sessions else f"Entry ${fmt(entry)}"

    return f'''<div class="cd">
<div class="r">
  <div class="ri2">
    <div class="bar" style="background:{tc}"></div>
    <div>
      <div class="sym">{p["symbol"]}
        <span style="font-size:9px;font-weight:600;color:{tc};margin-left:4px">{ptype}</span>
        <span style="font-size:11px;color:{cc};margin-left:2px">{_star(conv)}</span>
        {new_badge}
      </div>
      <div class="nm">{p.get("sector_name","")}</div>
    </div>
  </div>
  <div style="text-align:right">
    <div class="sc" style="color:{pnl_c}">{right_val}</div>
    <div style="font-size:9px;color:#64748b">{right_sub}</div>
    {close_badge}
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:8px">
  <div><div class="gl">Composite</div><div class="gv" style="color:{tc}">{fmt(p.get("composite"),1)}</div></div>
  <div><div class="gl">Mom Score</div><div class="gv">{fmt(p.get("momentum_score"),0)}</div></div>
  <div><div class="gl">Turn Score</div><div class="gv">{fmt(p.get("turnaround_score"),0)}</div></div>
  <div><div class="gl">CMF</div><div class="gv">{fmt(p.get("cmf"),3)}</div></div>
  <div><div class="gl">RSI</div><div class="gv">{fmt(p.get("rsi"),0)}</div></div>
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:4px">
  <div><div class="gl">Entry</div><div class="gv">${fmt(entry)}</div></div>
  <div><div class="gl">Stop ({fmt(risk_pct,1)}%)</div><div class="gv red">${fmt(stop)}</div></div>
  <div><div class="gl">Target (+{fmt(reward_pct,1)}%)</div><div class="gv green">${fmt(target)}</div></div>
  <div><div class="gl">OBV</div><div class="gv" style="color:{obv_c};font-size:9px">{obv_lbl}</div></div>
</div>
{progress_html}
</div>'''


def generate_html(new_picks, open_picks, closed_picks, candidates,
                  stats, bench, macro, regime, scan_time):

    # ── stats banner ──
    wr_c     = "#22c55e" if (stats["win_rate"] or 0) >= 55 else "#fbbf24"
    wr_str   = f"{stats['win_rate']:.1f}%" if stats["win_rate"] is not None else "–"
    stats_html = f'''
<div class="stat-row">
  <div class="stat-card"><div class="sl">Win Rate</div>
    <div class="sv" style="color:{wr_c if stats['win_rate'] else '#64748b'}">{wr_str}</div></div>
  <div class="stat-card"><div class="sl">Closed Picks</div>
    <div class="sv">{stats["total"]}</div></div>
  <div class="stat-card"><div class="sl">Open</div>
    <div class="sv" style="color:#22d3ee">{stats["open"]}</div></div>
  <div class="stat-card"><div class="sl">Avg P&amp;L</div>
    <div class="sv {pc(stats['avg_pnl'])}">{fmt_pct(stats["avg_pnl"])}</div></div>
  <div class="stat-card"><div class="sl">Best</div>
    <div class="sv green">{fmt_pct(stats["best"])}</div></div>
  <div class="stat-card"><div class="sl">Worst</div>
    <div class="sv red">{fmt_pct(stats["worst"])}</div></div>
</div>'''

    # ── macro ──
    vix = macro.get("VIX", {}).get("current")
    tnx = macro.get("TNX", {}).get("current")
    dxy = macro.get("DXY", {}).get("current")
    macro_html = f'''<div class="cd" style="border-color:{regime['color']}40">
<div class="r"><div>
  <div class="sym" style="color:{regime['color']}">{regime['regime']}</div>
  <div class="nm">{regime['posture']}</div>
</div><div style="text-align:right">
  <div class="sv" style="color:{regime['color']};font-size:14px">VIX {fmt(vix,1)}</div>
  <div class="nm">10Y {fmt(tnx,2)}%  &nbsp; USD {fmt(dxy,1)}</div>
</div></div></div>'''

    bench_html = "".join(
        f'<span><span class="bk">{k}:</span>'
        f'<span class="bv {pc(v)}">{fmt_pct(v)}</span></span>'
        for k, v in bench.items()
    )

    # ── new picks ──
    if new_picks:
        new_html = "".join(_pick_card(p, is_new=True) for p in new_picks)
    else:
        new_html = ('<div style="font-size:11px;color:#64748b;padding:16px 0">'
                    'No new picks today — threshold not met or positions at cap.</div>')

    # ── open positions (sorted best P&L first) ──
    sorted_open = sorted(open_picks, key=lambda x: x.get("pnl_pct") or 0, reverse=True)
    if sorted_open:
        open_html = "".join(_pick_card(p) for p in sorted_open)
    else:
        open_html = ('<div style="font-size:11px;color:#64748b;padding:16px 0">'
                     'No open positions.</div>')

    # ── closed picks table ──
    closed_rows = ""
    for p in closed_picks[:40]:
        pnl = p.get("pnl_pct")
        cr  = p.get("status", "")
        closed_rows += f'''<tr>
  <td>{(p.get("date_opened") or "")[:10]}</td>
  <td style="font-weight:700">{p["symbol"]}</td>
  <td style="color:{type_color(p.get('pick_type',''))}">{(p.get("pick_type",""))[:4]}</td>
  <td style="color:{conviction_color(p.get('conviction',''))}">{(p.get("conviction",""))[:1]}</td>
  <td>${fmt(p.get("entry_price"))}</td>
  <td>${fmt(p.get("close_price"))}</td>
  <td style="color:{_pnl_color(pnl)};font-weight:700">{fmt_pct(pnl)}</td>
  <td>{p.get("sessions_held","")}</td>
  <td style="color:{close_reason_color(cr)};font-size:9px">{cr.replace("_"," ")}</td>
  <td>{(p.get("date_closed") or "")[:10]}</td>
</tr>'''

    if not closed_rows:
        closed_rows = ("<tr><td colspan='10' style='color:#64748b;text-align:center;"
                       "padding:14px'>No closed picks yet — keep running daily.</td></tr>")

    closed_html = f'''<div style="overflow-x:auto">
<table class="jtbl">
<thead><tr>
  <th>Opened</th><th>Symbol</th><th>Type</th><th>Conv</th>
  <th>Entry</th><th>Exit</th><th>P&amp;L</th>
  <th>Days</th><th>Reason</th><th>Closed</th>
</tr></thead>
<tbody>{closed_rows}</tbody>
</table></div>'''

    # ── candidates overflow (ranked but not yet opened) ──
    overflow = [c for c in candidates if c not in new_picks]
    overflow_rows = ""
    for c in overflow[:20]:
        overflow_rows += (
            f'<tr><td style="font-weight:700">{c["symbol"]}</td>'
            f'<td style="color:{type_color(c["pick_type"])}">{c["pick_type"][:4]}</td>'
            f'<td>{fmt(c["composite"],1)}</td>'
            f'<td style="color:{conviction_color(c["conviction"])}">{c["conviction"][:1]}</td>'
            f'<td>{fmt(c.get("momentum_score"),0)}</td>'
            f'<td>{fmt(c.get("turnaround_score"),0)}</td>'
            f'<td>{fmt(c.get("cmf"),3)}</td>'
            f'<td style="color:{_pnl_color(c.get("ret1m"))}">{fmt_pct(c.get("ret1m"))}</td>'
            f'<td style="color:#64748b">{c.get("sector_name","")}</td></tr>'
        )
    overflow_html = ""
    if overflow_rows:
        overflow_html = f'''
<div class="tt">Watch List &mdash; Qualified But Sector/Cap Limit Reached</div>
<div style="font-size:9px;color:#64748b;margin-bottom:10px">
  These passed all signal filters. Opens when a sector slot frees up.
</div>
<div style="overflow-x:auto">
<table class="jtbl">
<thead><tr><th>Symbol</th><th>Type</th><th>Score</th><th>Conv</th>
  <th>Mom</th><th>Turn</th><th>CMF</th><th>1M Ret</th><th>Sector</th></tr></thead>
<tbody>{overflow_rows}</tbody>
</table></div>'''

    css = '''
* { margin:0; padding:0; box-sizing:border-box }
body { font-family:'JetBrains Mono',monospace; background:#080c14; color:#e2e8f0; padding:16px }
.hdr { border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:16px; margin-bottom:16px }
.hdr h1 { font-size:15px; font-weight:700; letter-spacing:.08em; color:#f8fafc; text-transform:uppercase }
.hdr .sub { font-size:10px; color:#64748b; margin-top:4px }
.cd { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);
      border-radius:6px; padding:12px; margin-bottom:8px; font-size:11px }
.bnch { display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:8px }
.bk { font-size:9px; color:#64748b; margin-right:4px }
.bv { font-size:12px; font-weight:600 }
.r { display:flex; justify-content:space-between; align-items:flex-start }
.ri2 { display:flex; align-items:center; gap:8px }
.bar { width:3px; height:34px; border-radius:2px; flex-shrink:0 }
.sym { font-weight:700; font-size:13px }
.nm { font-size:10px; color:#64748b }
.sc { font-weight:700; font-size:20px }
.sv { font-size:18px; font-weight:700 }
.sl { font-size:8px; color:#64748b; text-transform:uppercase; letter-spacing:.06em }
.gl { font-size:8px; color:#64748b; text-transform:uppercase; letter-spacing:.06em }
.gv { font-size:11px; font-weight:600; margin-top:2px }
.tt { font-size:13px; font-weight:700; letter-spacing:.06em; color:#f8fafc;
      text-transform:uppercase; margin:24px 0 12px }
.ft { margin-top:32px; padding:12px 0; border-top:1px solid rgba(255,255,255,0.04);
      font-size:9px; color:#334155 }
.green { color:#4ade80 }
.red   { color:#f87171 }
.muted { color:#94a3b8 }
.stat-row { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; margin-bottom:16px }
.stat-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
             border-radius:6px; padding:10px }
.jtbl { width:100%; border-collapse:collapse; font-size:10px }
.jtbl th { text-align:left; padding:6px 8px; font-size:8px; color:#64748b;
           text-transform:uppercase; letter-spacing:.06em;
           border-bottom:1px solid rgba(255,255,255,0.06) }
.jtbl td { padding:6px 8px; border-bottom:1px solid rgba(255,255,255,0.04) }
.jtbl tbody tr:hover { background:rgba(255,255,255,0.02) }
@media (max-width:600px) {
  .stat-row { grid-template-columns:repeat(3,1fr) }
}
'''

    return f'''<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Picks Engine &mdash; {scan_time}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>{css}</style></head><body>
<div class="hdr">
  <h1>Stock Picks Engine v1.0 &mdash; Signal Confluence &amp; Position Manager</h1>
  <div class="sub">{scan_time} &nbsp;|&nbsp; {len(SECTOR_STOCKS)*20 if all(len(v)==20 for v in SECTOR_STOCKS.values()) else sum(len(v) for v in SECTOR_STOCKS.values())}-Stock Universe ({len(SECTOR_STOCKS)} Sectors) &nbsp;|&nbsp; Not financial advice</div>
</div>

{stats_html}

<div class="tt">Macro Regime</div>
{macro_html}
<div class="cd bnch">
  <span style="font-size:9px;font-weight:700;color:#64748b;letter-spacing:.1em">SPY</span>
  {bench_html}
</div>

<div class="tt">New Picks Today &mdash; {len(new_picks)} Signal{"s" if len(new_picks) != 1 else ""}</div>
{new_html}

<div class="tt">Open Positions &mdash; {len(open_picks)} Active</div>
{open_html}

{overflow_html}

<div class="tt">Closed Picks &mdash; Full History</div>
{closed_html}

<div class="ft">
  Picks Engine v1.0 &nbsp;|&nbsp;
  Confluence: mom×0.55 + turn×0.45 &nbsp;|&nbsp;
  Stop: {ATR_STOP_MULT}× ATR(14) &nbsp;|&nbsp;
  Target: {REWARD_RISK_MOM}:1 (mom/conf) / {REWARD_RISK_TURN}:1 (turn) &nbsp;|&nbsp;
  Max {MAX_OPEN_PICKS} open, {MAX_PER_SECTOR} per sector &nbsp;|&nbsp;
  Time stop: {TIME_STOP_SESSIONS} sessions &nbsp;|&nbsp;
  Not financial advice.
</div>
</body></html>'''


# ============================================================
# MAIN
# ============================================================
def main():
    scan_dt  = datetime.now()
    ts       = scan_dt.strftime("%Y%m%d_%H%M")
    date_str = scan_dt.strftime("%Y-%m-%d")
    print(f"\n  PICKS ENGINE v1.0 | {scan_dt.strftime('%B %d, %Y %I:%M %p')}\n")

    os.makedirs("reports", exist_ok=True)
    db = PicksDB()

    # ── [1] Macro + regime (context for sizing guidance) ──
    print("  [1/5] Macro + SPY regime...")
    macro  = fetch_macro()
    spy    = fetch_data(BENCHMARK)
    if not spy:
        print("  SPY FAILED — aborting picks run"); sys.exit(1)
    bench  = {
        "1W": calc_return(spy["closes"],  5),
        "1M": calc_return(spy["closes"], 21),
        "3M": calc_return(spy["closes"], 63),
    }
    regime = classify_regime(macro, spy)
    print(f"    Regime: {regime['regime']}  |  Posture: {regime['posture']}")

    # ── [2] Load today's scores from DB ──
    print("\n  [2/5] Loading today's scores from DB...")
    mom_map, turn_map = load_today_scores(date_str)
    print(f"    Momentum scores: {len(mom_map)} | Turnaround scores: {len(turn_map)}")

    if not mom_map and not turn_map:
        print("\n  WARNING: No scores found for today.")
        print("  Run screener.py and turnaround.py before picks.py.")
        print("  Will still update open positions and generate report.\n")

    # ── [3] Update open positions ──
    print("\n  [3/5] Updating open positions...")
    still_open, closed_today = update_open_positions(db, date_str, mom_map, turn_map)
    print(f"    Still open: {len(still_open)} | Closed today: {len(closed_today)}")
    for c in closed_today:
        print(f"    CLOSED  {c['symbol']:6s}  {c.get('close_reason',''):16s}  "
              f"P&L: {fmt_pct(c.get('pnl_pct'))}")

    # ── [4] Generate new picks ──
    print("\n  [4/5] Scanning for new picks...")
    new_picks, candidates = generate_picks(db, date_str, mom_map, turn_map, regime)

    # Persist new picks to DB
    for p in new_picks:
        pick_id = db.save_pick({
            "date_opened":       date_str,
            "symbol":            p["symbol"],
            "sector":            p["sector"],
            "sector_name":       p["sector_name"],
            "pick_type":         p["pick_type"],
            "conviction":        p["conviction"],
            "entry_price":       p["price"],
            "stop_price":        p["stop"],
            "target_price":      p["target"],
            "atr_at_entry":      p["atr"],
            "composite_score":   p["composite"],
            "momentum_score":    p["momentum_score"],
            "turnaround_score":  p["turnaround_score"],
            "cmf":               p["cmf"],
            "mfi":               p["mfi"],
            "obv_div":           p["obv_div"],
            "rsi":               p["rsi"],
            "ret1m":             p["ret1m"],
        })
        db.log_daily(date_str, pick_id, p["symbol"], p["price"], 0.0,
                     p["momentum_score"], p["turnaround_score"], "OPEN")
        print(f"  NEW  {p['pick_type']:11s} {p['symbol']:6s} {p['conviction']:11s} "
              f"score={p['composite']}  "
              f"entry=${p['price']}  stop=${p['stop']}  target=${p['target']}")

    # ── [5] Build HTML ──
    print("\n  [5/5] Generating picks report...")

    # Merge current prices into open picks for HTML
    all_open = db.get_open()
    price_lkp = {p["symbol"]: p.get("current_price") for p in still_open
                 if p.get("current_price")}
    for p in all_open:
        cp = price_lkp.get(p["symbol"])
        if cp:
            p["current_price"] = cp
            if p["entry_price"]:
                p["pnl_pct"] = round((cp - p["entry_price"]) / p["entry_price"] * 100, 2)
        else:
            p["current_price"] = p["entry_price"]  # newly opened today
            p["pnl_pct"] = 0.0

    stats        = db.stats()
    closed_picks = db.get_closed(50)
    db.close()

    scan_time = scan_dt.strftime("%B %d, %Y %I:%M %p")
    html      = generate_html(new_picks, all_open, closed_picks, candidates,
                               stats, bench, macro, regime, scan_time)

    html_path = os.path.join("reports", f"picks_{ts}.html")
    with open(html_path,       "w", encoding="utf-8") as f:
        f.write(html)
    with open("picks_report.html", "w", encoding="utf-8") as f:
        f.write(html)

    print(f"  Report: {html_path}")
    print(f"  picks_report.html (latest)")

    print(f"\n  {'='*56}")
    print(f"  REGIME : {regime['regime']}")
    print(f"  NEW    : {len(new_picks)} picks")
    for p in new_picks:
        print(f"           {p['pick_type']:11s} {p['symbol']:6s} {p['conviction']}"
              f"  composite={p['composite']}")
    print(f"  OPEN   : {stats['open']}  |  Win rate: {stats['win_rate'] or '–'}%  |  "
          f"Avg P&L: {fmt_pct(stats['avg_pnl'])}")
    print(f"  {'='*56}\n")


if __name__ == "__main__":
    main()
