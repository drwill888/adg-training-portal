#!/usr/bin/env python3
"""
============================================================
POSITION TRACKER v1.0 — paper-trades top picks from screener.py
============================================================
Strategy (100 shares per pick):
  - Entry:   Score >= 75 at latest scan, not already held
  - Stop:    Entry - 2 × ATR(14) — full exit, all shares
  - T1:      Entry + 1.5 × ATR(14) — sell 50 shares, move stop to breakeven
  - T2:      Entry + 3 × ATR(14) — sell remaining 50 shares
  - Timeout: 30 days held — close at market

Outputs:
  - Updates 'positions' table in money_flow_history.db
  - Writes tracker_report.html (open/closed positions, P/L, win rate)
  - Console summary

Run AFTER screener.py each day.
============================================================
"""

import sys, os, sqlite3, time, webbrowser
from datetime import datetime, timedelta

try:
    import yfinance as yf
    import numpy as np
except ImportError:
    print("pip install yfinance numpy"); sys.exit(1)

DB_PATH = "money_flow_history.db"
DEFAULT_SHARES = 100
ENTRY_SCORE_THRESHOLD = 75
TIMEOUT_DAYS = 30

# ============================================================
# DB
# ============================================================
def init_positions_table(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS positions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            entry_date TEXT NOT NULL,
            entry_price REAL NOT NULL,
            shares INTEGER NOT NULL,
            score_at_entry INTEGER,
            cmf_at_entry REAL,
            mfi_at_entry REAL,
            initial_stop REAL,
            current_stop REAL,
            t1 REAL,
            t2 REAL,
            t1_hit INTEGER DEFAULT 0,
            shares_remaining INTEGER,
            last_price REAL,
            last_check_date TEXT,
            exit_date TEXT,
            exit_price REAL,
            exit_reason TEXT,
            realized_pnl REAL DEFAULT 0,
            unrealized_pnl REAL DEFAULT 0,
            total_pnl REAL DEFAULT 0,
            pnl_pct REAL DEFAULT 0,
            status TEXT DEFAULT 'OPEN'
        );
        CREATE INDEX IF NOT EXISTS idx_positions_status ON positions(status);
        CREATE INDEX IF NOT EXISTS idx_positions_symbol ON positions(symbol);
    """)
    conn.commit()

def get_active_positions(conn):
    cur = conn.execute("SELECT * FROM positions WHERE status='OPEN'")
    cols = [d[0] for d in cur.description]
    return [dict(zip(cols, r)) for r in cur.fetchall()]

def get_closed_positions(conn, limit=200):
    cur = conn.execute("SELECT * FROM positions WHERE status='CLOSED' ORDER BY exit_date DESC LIMIT ?", (limit,))
    cols = [d[0] for d in cur.description]
    return [dict(zip(cols, r)) for r in cur.fetchall()]

def get_latest_top_picks(conn, threshold=ENTRY_SCORE_THRESHOLD):
    rows = conn.execute("""
        SELECT s.symbol, s.score, s.cmf, s.mfi
        FROM scores s
        INNER JOIN (SELECT MAX(date) as md FROM scores) m ON s.date = m.md
        WHERE s.score >= ?
        ORDER BY s.score DESC
    """, (threshold,)).fetchall()
    return [{"symbol":r[0], "score":r[1], "cmf":r[2], "mfi":r[3]} for r in rows]

def get_latest_scan_date(conn):
    row = conn.execute("SELECT MAX(date) FROM scores").fetchone()
    return row[0] if row and row[0] else None

# ============================================================
# DATA + ATR
# ============================================================
def fetch_market_data(symbol):
    try:
        df = yf.Ticker(symbol).history(period="2mo", interval="1d", auto_adjust=True)
        if df.empty or len(df) < 15: return None
        return {
            "close": float(df["Close"].iloc[-1]),
            "high":  float(df["High"].iloc[-1]),
            "low":   float(df["Low"].iloc[-1]),
            "date":  df.index[-1].strftime("%Y-%m-%d"),
            "highs": df["High"].values.astype(float),
            "lows":  df["Low"].values.astype(float),
            "closes":df["Close"].values.astype(float),
        }
    except Exception as e:
        print(f"  fetch error {symbol}: {e}")
        return None

def calc_atr(highs, lows, closes, p=14):
    if len(closes) < p+1: return None
    trs = [max(highs[i]-lows[i], abs(highs[i]-closes[i-1]), abs(lows[i]-closes[i-1])) for i in range(1, len(closes))]
    return float(np.mean(trs[-p:]))

# ============================================================
# POSITION LOGIC
# ============================================================
def open_position(conn, symbol, pick, today, market):
    entry = market["close"]
    atr   = calc_atr(market["highs"], market["lows"], market["closes"])
    if not atr or atr <= 0:
        print(f"  SKIP  {symbol} — invalid ATR")
        return False
    stop = round(entry - 2*atr, 2)
    t1   = round(entry + 1.5*atr, 2)
    t2   = round(entry + 3*atr, 2)
    conn.execute("""
        INSERT INTO positions (symbol, entry_date, entry_price, shares,
            score_at_entry, cmf_at_entry, mfi_at_entry,
            initial_stop, current_stop, t1, t2, t1_hit,
            shares_remaining, last_price, last_check_date, status,
            realized_pnl, unrealized_pnl, total_pnl, pnl_pct)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 'OPEN', 0, 0, 0, 0)
    """, (symbol, today, entry, DEFAULT_SHARES,
          pick.get("score"), pick.get("cmf"), pick.get("mfi"),
          stop, stop, t1, t2, DEFAULT_SHARES, entry, today))
    conn.commit()
    print(f"  OPEN  {symbol:6s}  entry:${entry:7.2f}  stop:${stop:7.2f}  T1:${t1:7.2f}  T2:${t2:7.2f}  score:{pick.get('score')}")
    return True

def close_position(conn, pos, exit_price, exit_reason, today, market_close):
    """Full close of remaining shares."""
    entry  = pos["entry_price"]
    realized = pos["realized_pnl"] or 0
    rem    = pos["shares_remaining"]
    final  = (exit_price - entry) * rem
    total  = realized + final
    pnl_pct= (total / (entry * DEFAULT_SHARES)) * 100
    conn.execute("""
        UPDATE positions SET status='CLOSED', exit_date=?, exit_price=?,
            exit_reason=?, realized_pnl=?, unrealized_pnl=0,
            total_pnl=?, pnl_pct=?, shares_remaining=0,
            last_price=?, last_check_date=?
        WHERE id=?
    """, (today, exit_price, exit_reason, round(realized+final,2),
          round(total,2), round(pnl_pct,2), market_close, today, pos["id"]))
    conn.commit()
    print(f"  {exit_reason:5s} {pos['symbol']:6s}  exit:${exit_price:7.2f}  P/L:${total:+8.2f} ({pnl_pct:+6.2f}%)")

def partial_t1(conn, pos, today, market_close):
    """Sell half at T1, move stop to breakeven."""
    entry = pos["entry_price"]
    t1    = pos["t1"]
    half  = DEFAULT_SHARES // 2
    realized = (t1 - entry) * half
    new_remaining = DEFAULT_SHARES - half
    conn.execute("""
        UPDATE positions SET t1_hit=1, shares_remaining=?, current_stop=?,
            realized_pnl=?, last_price=?, last_check_date=?
        WHERE id=?
    """, (new_remaining, round(entry,2), round(realized,2),
          market_close, today, pos["id"]))
    conn.commit()
    print(f"  T1    {pos['symbol']:6s}  sold {half}@${t1:.2f}  realized:${realized:+.2f}  trail stop→${entry:.2f}")

def update_unrealized(conn, pos, market_close, today):
    """Mark-to-market open position."""
    entry = pos["entry_price"]
    rem   = pos["shares_remaining"]
    realized = pos["realized_pnl"] or 0
    unreal = (market_close - entry) * rem
    total  = realized + unreal
    pnl_pct= (total / (entry * DEFAULT_SHARES)) * 100
    conn.execute("""
        UPDATE positions SET last_price=?, last_check_date=?,
            unrealized_pnl=?, total_pnl=?, pnl_pct=?
        WHERE id=?
    """, (market_close, today, round(unreal,2), round(total,2),
          round(pnl_pct,2), pos["id"]))
    conn.commit()

def process_position(conn, pos, market, today):
    """Check exits in order: stop > T2 > T1 > timeout. Update P/L."""
    if pos["status"] != "OPEN": return
    if pos["entry_date"] == today:
        # Don't check exits on entry day
        return

    low   = market["low"]
    high  = market["high"]
    close = market["close"]
    cur_stop = pos["current_stop"]
    t1    = pos["t1"]
    t2    = pos["t2"]

    # Stop hit (any remaining shares exit at stop)
    if low <= cur_stop and pos["shares_remaining"] > 0:
        reason = "STOP" if not pos["t1_hit"] else "STOP-BE"
        close_position(conn, pos, cur_stop, reason, today, close)
        return

    # T2 hit
    if high >= t2 and pos["shares_remaining"] > 0:
        close_position(conn, pos, t2, "T2", today, close)
        return

    # T1 hit (first time only, partial close)
    if not pos["t1_hit"] and high >= t1 and pos["shares_remaining"] == DEFAULT_SHARES:
        partial_t1(conn, pos, today, close)
        # Refresh pos for further checks this run
        return

    # Timeout
    entry_dt = datetime.strptime(pos["entry_date"], "%Y-%m-%d")
    today_dt = datetime.strptime(today, "%Y-%m-%d")
    if (today_dt - entry_dt).days >= TIMEOUT_DAYS:
        close_position(conn, pos, close, "TIMEOUT", today, close)
        return

    # No exit — just mark-to-market
    update_unrealized(conn, pos, close, today)

# ============================================================
# HTML REPORT
# ============================================================
def _color_pnl(v):
    if v is None: return "#94a3b8"
    if v > 0: return "#4ade80"
    if v < 0: return "#f87171"
    return "#94a3b8"

def fmt(n, d=2):
    if n is None: return "-"
    return f"{n:.{d}f}"

def generate_tracker_html(conn, today):
    open_p   = get_active_positions(conn)
    closed_p = get_closed_positions(conn, 200)

    total_open_pnl   = sum((p["total_pnl"] or 0) for p in open_p)
    total_closed_pnl = sum((p["total_pnl"] or 0) for p in closed_p)
    total_pnl        = total_open_pnl + total_closed_pnl

    wins   = sum(1 for p in closed_p if (p["total_pnl"] or 0) > 0)
    losses = sum(1 for p in closed_p if (p["total_pnl"] or 0) <= 0)
    win_rate = (wins / len(closed_p) * 100) if closed_p else 0

    # Exit reason breakdown
    reasons = {}
    for p in closed_p:
        r = p.get("exit_reason") or "?"
        reasons[r] = reasons.get(r, 0) + 1

    # Open positions table
    open_rows = ""
    for p in sorted(open_p, key=lambda x: x.get("total_pnl") or 0, reverse=True):
        entry_dt = datetime.strptime(p["entry_date"], "%Y-%m-%d")
        days_held = (datetime.strptime(today,"%Y-%m-%d") - entry_dt).days
        pnl_c = _color_pnl(p.get("total_pnl"))
        t1_flag = "✓" if p.get("t1_hit") else ""
        open_rows += f'''<tr>
<td>{p["symbol"]}</td>
<td>{p["entry_date"]}</td>
<td>{days_held}d</td>
<td>${fmt(p["entry_price"])}</td>
<td>${fmt(p.get("last_price"))}</td>
<td>${fmt(p.get("current_stop"))}</td>
<td>${fmt(p["t1"])} {t1_flag}</td>
<td>${fmt(p["t2"])}</td>
<td>{p.get("shares_remaining")}</td>
<td>{p.get("score_at_entry")}</td>
<td style="color:{pnl_c}">${fmt(p.get("total_pnl"))}</td>
<td style="color:{pnl_c}">{fmt(p.get("pnl_pct"))}%</td>
</tr>'''

    # Closed positions table
    closed_rows = ""
    for p in closed_p:
        pnl_c = _color_pnl(p.get("total_pnl"))
        reason_c = "#4ade80" if p.get("exit_reason") in ("T1","T2") else "#f87171" if "STOP" in (p.get("exit_reason") or "") else "#fbbf24"
        closed_rows += f'''<tr>
<td>{p["symbol"]}</td>
<td>{p["entry_date"]}</td>
<td>{p.get("exit_date","-")}</td>
<td>${fmt(p["entry_price"])}</td>
<td>${fmt(p.get("exit_price"))}</td>
<td style="color:{reason_c}">{p.get("exit_reason","-")}</td>
<td>{p.get("score_at_entry")}</td>
<td style="color:{pnl_c}">${fmt(p.get("total_pnl"))}</td>
<td style="color:{pnl_c}">{fmt(p.get("pnl_pct"))}%</td>
</tr>'''

    reasons_html = " | ".join(f"{k}: {v}" for k,v in reasons.items()) if reasons else "—"

    return f'''<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Position Tracker - {today}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:'JetBrains Mono',monospace;background:#080c14;color:#e2e8f0;padding:16px}}
h1{{font-size:15px;font-weight:700;letter-spacing:.08em;color:#f8fafc;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.06);padding-bottom:12px;margin-bottom:16px}}
.sub{{font-size:10px;color:#64748b;margin-top:4px}}
.tt{{font-size:13px;font-weight:700;letter-spacing:.06em;color:#f8fafc;text-transform:uppercase;margin:24px 0 12px}}
.summary{{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:24px}}
.scard{{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:6px;padding:14px}}
.scard .sl{{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}}
.scard .sv{{font-size:18px;font-weight:700}}
.scard .sub2{{font-size:9px;color:#64748b;margin-top:4px}}
table{{width:100%;border-collapse:collapse;font-size:11px;background:rgba(255,255,255,.01);border:1px solid rgba(255,255,255,.05);border-radius:6px;overflow:hidden}}
th{{background:#1a1a2e;color:#fff;padding:10px 8px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:.06em;font-weight:700}}
td{{padding:8px;border-bottom:1px solid rgba(255,255,255,.04);font-size:11px}}
tr:hover{{background:rgba(99,102,241,.04)}}
.green{{color:#4ade80}}.red{{color:#f87171}}.muted{{color:#94a3b8}}
.empty{{color:#64748b;padding:20px;text-align:center;font-size:10px}}
</style></head><body>
<h1>Position Tracker — 100-Share Paper Simulation</h1>
<div class="sub">{today} | Strategy: 75+ score entry, half at T1, half at T2, full exit at stop or 30-day timeout</div>

<div class="summary">
<div class="scard"><div class="sl">Open Positions</div><div class="sv">{len(open_p)}</div><div class="sub2" style="color:{_color_pnl(total_open_pnl)}">Unrealized: ${fmt(total_open_pnl)}</div></div>
<div class="scard"><div class="sl">Closed Positions</div><div class="sv">{len(closed_p)}</div><div class="sub2" style="color:{_color_pnl(total_closed_pnl)}">Realized: ${fmt(total_closed_pnl)}</div></div>
<div class="scard"><div class="sl">Win Rate</div><div class="sv" style="color:{'#4ade80' if win_rate>=50 else '#f87171' if win_rate<40 else '#fbbf24'}">{fmt(win_rate,1)}%</div><div class="sub2">{wins}W / {losses}L</div></div>
<div class="scard"><div class="sl">Total P/L</div><div class="sv" style="color:{_color_pnl(total_pnl)}">${fmt(total_pnl)}</div><div class="sub2">Realized + unrealized</div></div>
<div class="scard"><div class="sl">Exit Reasons</div><div class="sv" style="font-size:11px">{reasons_html}</div></div>
</div>

<div class="tt">Open Positions ({len(open_p)})</div>
<table>
<thead><tr><th>Symbol</th><th>Entry Date</th><th>Days</th><th>Entry $</th><th>Current $</th><th>Stop</th><th>T1</th><th>T2</th><th>Shares</th><th>Score@Entry</th><th>P/L $</th><th>P/L %</th></tr></thead>
<tbody>{open_rows if open_p else '<tr><td colspan="12" class="empty">No open positions. Run screener.py to generate top picks, then run tracker.py to open positions.</td></tr>'}</tbody>
</table>

<div class="tt">Closed Positions ({len(closed_p)})</div>
<table>
<thead><tr><th>Symbol</th><th>Entry</th><th>Exit</th><th>Entry $</th><th>Exit $</th><th>Reason</th><th>Score@Entry</th><th>P/L $</th><th>P/L %</th></tr></thead>
<tbody>{closed_rows if closed_p else '<tr><td colspan="9" class="empty">No closed positions yet.</td></tr>'}</tbody>
</table>

<div style="margin-top:32px;padding:12px 0;border-top:1px solid rgba(255,255,255,.04);font-size:9px;color:#334155">Tracker v1.0 — paper simulation only. Not financial advice.</div>
</body></html>'''

# ============================================================
# MAIN
# ============================================================
def main():
    today = datetime.now().strftime("%Y-%m-%d")
    print(f"\n  POSITION TRACKER  |  {today}\n")

    if not os.path.exists(DB_PATH):
        print(f"  ERROR: {DB_PATH} not found. Run screener.py first.\n")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)
    init_positions_table(conn)

    latest_scan = get_latest_scan_date(conn)
    if not latest_scan:
        print("  ERROR: no scan data in db. Run screener.py first.\n")
        sys.exit(1)
    print(f"  Latest scan in db: {latest_scan}")

    # 1. Update existing open positions
    active = get_active_positions(conn)
    print(f"\n  [1/2] Checking {len(active)} open position(s)...")
    for pos in active:
        market = fetch_market_data(pos["symbol"])
        if market:
            process_position(conn, pos, market, today)
        else:
            print(f"  SKIP  {pos['symbol']} — no market data")
        time.sleep(0.15)

    # 2. Open new positions for fresh top picks
    held_symbols = {p["symbol"] for p in get_active_positions(conn)}
    top_picks = get_latest_top_picks(conn, ENTRY_SCORE_THRESHOLD)
    new_candidates = [p for p in top_picks if p["symbol"] not in held_symbols]
    print(f"\n  [2/2] Top picks (score>={ENTRY_SCORE_THRESHOLD}): {len(top_picks)}  |  new candidates: {len(new_candidates)}")
    new_opens = 0
    for pick in new_candidates:
        market = fetch_market_data(pick["symbol"])
        if market and open_position(conn, pick["symbol"], pick, today, market):
            new_opens += 1
        time.sleep(0.15)

    # 3. Summary
    open_p   = get_active_positions(conn)
    closed_p = get_closed_positions(conn, 1000)
    open_pnl   = sum((p.get("total_pnl") or 0) for p in open_p)
    closed_pnl = sum((p.get("total_pnl") or 0) for p in closed_p)
    wins   = sum(1 for p in closed_p if (p.get("total_pnl") or 0) > 0)
    losses = sum(1 for p in closed_p if (p.get("total_pnl") or 0) <= 0)
    win_rate = (wins / len(closed_p) * 100) if closed_p else 0

    print(f"\n  {'='*54}")
    print(f"  POSITIONS:    {len(open_p)} open  |  {len(closed_p)} closed")
    print(f"  NEW OPENS:    {new_opens}")
    print(f"  UNREALIZED:   ${open_pnl:+.2f}")
    print(f"  REALIZED:     ${closed_pnl:+.2f}")
    print(f"  TOTAL P/L:    ${(open_pnl+closed_pnl):+.2f}")
    if closed_p:
        print(f"  WIN RATE:     {win_rate:.1f}%  ({wins}W / {losses}L)")
    print(f"  {'='*54}\n")

    # 4. HTML report
    html = generate_tracker_html(conn, today)
    with open("tracker_report.html","w",encoding="utf-8") as f:
        f.write(html)
    print(f"  Report: tracker_report.html")

    conn.close()
    try:
        webbrowser.open("file://" + os.path.abspath("tracker_report.html"))
    except Exception:
        pass

if __name__ == "__main__":
    main()
