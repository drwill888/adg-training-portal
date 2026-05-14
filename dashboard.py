#!/usr/bin/env python3
"""
============================================================
ANALYTICS DASHBOARD v1.0 — trend analysis over time
============================================================
Reads money_flow_history.db and surfaces:
  - Score velocity (top score gainers/losers vs. 5 scans ago)
  - Acceleration list (rising score 3+ consecutive scans)
  - CMF bullish crossovers (CMF turned positive recently)
  - Hidden accumulation watchlist (current bullish OBV div)
  - Sector rotation (sector score change over time)
  - Per-symbol score history sparklines (top 30 by current score)

Run anytime after multiple screener runs. Needs >=2 scans for trends,
>=5 scans for acceleration/crossover detection to be meaningful.

  python dashboard.py
============================================================
"""

import sys, os, sqlite3, json, math, webbrowser
from datetime import datetime

try:
    import numpy as np
except ImportError:
    print("pip install numpy"); sys.exit(1)

DB_PATH = "money_flow_history.db"

# ============================================================
# DATA LOAD
# ============================================================
def get_scan_dates(conn, limit=60):
    rows = conn.execute(
        "SELECT DISTINCT date FROM scores ORDER BY date DESC LIMIT ?", (limit,)
    ).fetchall()
    return [r[0] for r in rows]

def load_scores(conn, dates):
    dset = set(dates)
    rows = conn.execute("""
        SELECT date, symbol, score, cmf, mfi, obv_slope, updown_vol, rs_pct, short_pct
        FROM scores ORDER BY date ASC, symbol ASC
    """).fetchall()
    return [
        {"date":r[0],"symbol":r[1],"score":r[2],"cmf":r[3],"mfi":r[4],
         "obv_slope":r[5],"updown_vol":r[6],"rs_pct":r[7],"short_pct":r[8]}
        for r in rows if r[0] in dset
    ]

def group_by_symbol(scores):
    by = {}
    for s in scores:
        by.setdefault(s["symbol"], []).append(s)
    for sym in by:
        by[sym].sort(key=lambda x: x["date"])
    return by

# ============================================================
# ANALYTICS
# ============================================================
SECTOR_SYMBOLS = {"XLK","XLF","XLE","XLV","XLI","XLC","XLY","XLP","XLU","XLRE","XLB","SPY"}

def is_stock(sym): return sym not in SECTOR_SYMBOLS

def velocity(by_sym, lookback=5):
    out = []
    for sym, hist in by_sym.items():
        if len(hist) < 2: continue
        cur = hist[-1]
        idx = max(0, len(hist)-1-lookback)
        old = hist[idx]
        if cur["score"] is None or old["score"] is None: continue
        delta = cur["score"] - old["score"]
        out.append({"symbol":sym,"current":cur["score"],"previous":old["score"],
                    "delta":delta,"scans_back":len(hist)-1-idx,
                    "cmf":cur.get("cmf"),"mfi":cur.get("mfi")})
    return sorted(out, key=lambda x: x["delta"], reverse=True)

def acceleration(by_sym, min_consecutive=3):
    """Symbols where score rose in N+ consecutive scans."""
    out = []
    for sym, hist in by_sym.items():
        if len(hist) < min_consecutive+1: continue
        scores = [h["score"] for h in hist[-(min_consecutive+1):] if h["score"] is not None]
        if len(scores) < min_consecutive+1: continue
        rising = all(scores[i+1] >= scores[i] for i in range(len(scores)-1))
        strictly_rising_count = sum(1 for i in range(len(scores)-1) if scores[i+1] > scores[i])
        if rising and strictly_rising_count >= min_consecutive:
            out.append({"symbol":sym,"scores":scores,
                        "delta":scores[-1]-scores[0],"streak":strictly_rising_count})
    return sorted(out, key=lambda x: x["delta"], reverse=True)

def cmf_crossover(by_sym, lookback=5):
    """CMF was negative in past N scans, now positive."""
    out = []
    for sym, hist in by_sym.items():
        if len(hist) < 3: continue
        recent = hist[-lookback:] if len(hist) >= lookback else hist
        cmfs = [h["cmf"] for h in recent if h["cmf"] is not None]
        if len(cmfs) < 3: continue
        if cmfs[-1] > 0.02 and any(c < -0.02 for c in cmfs[:-1]):
            out.append({"symbol":sym,"cmf_now":cmfs[-1],
                        "cmf_prev_min":min(cmfs[:-1]),
                        "score":hist[-1]["score"]})
    return sorted(out, key=lambda x: x["cmf_now"], reverse=True)

def sector_rotation(by_sym, lookback=5):
    """Sector score change over last N scans."""
    out = []
    for sym in SECTOR_SYMBOLS:
        if sym == "SPY": continue
        hist = by_sym.get(sym, [])
        if len(hist) < 2: continue
        cur = hist[-1]
        idx = max(0, len(hist)-1-lookback)
        old = hist[idx]
        if cur["score"] is None or old["score"] is None: continue
        out.append({"symbol":sym,"current":cur["score"],"previous":old["score"],
                    "delta":cur["score"]-old["score"]})
    return sorted(out, key=lambda x: x["delta"], reverse=True)

def top_current(by_sym, n=30):
    """Top N stocks by latest score (excluding sectors)."""
    latest = []
    for sym, hist in by_sym.items():
        if not is_stock(sym): continue
        if not hist: continue
        cur = hist[-1]
        if cur["score"] is None: continue
        latest.append({"symbol":sym, "score":cur["score"],
                       "history":[h["score"] for h in hist],
                       "dates":[h["date"] for h in hist],
                       "cmf":cur.get("cmf"),"mfi":cur.get("mfi"),
                       "rs_pct":cur.get("rs_pct")})
    return sorted(latest, key=lambda x: x["score"], reverse=True)[:n]

# ============================================================
# HTML
# ============================================================
def color_delta(d):
    if d is None: return "#94a3b8"
    if d > 5: return "#22c55e"
    if d > 0: return "#4ade80"
    if d < -5: return "#ef4444"
    if d < 0: return "#f87171"
    return "#94a3b8"

def color_cmf(v):
    if v is None: return "#94a3b8"
    if v > 0.1: return "#22c55e"
    if v > 0: return "#4ade80"
    if v < -0.1: return "#ef4444"
    if v < 0: return "#f87171"
    return "#94a3b8"

def fmt(n, d=2):
    if n is None: return "-"
    return f"{n:.{d}f}"

def generate_html(velocity_list, accel_list, crossover_list, sector_list, top_list, dates):
    n_scans = len(dates)
    date_range = f"{dates[-1]} → {dates[0]}" if dates else "—"

    # Velocity tables
    gainers = velocity_list[:15]
    losers = list(reversed(velocity_list))[:15]

    def vel_rows(items, sign):
        h = ""
        for v in items:
            if v["delta"] == 0: continue
            color = color_delta(v["delta"])
            arrow = "↑" if v["delta"] > 0 else "↓"
            h += f'''<tr><td><b>{v["symbol"]}</b></td>
<td>{v["previous"]}</td>
<td>{v["current"]}</td>
<td style="color:{color}">{arrow} {abs(v["delta"])}</td>
<td style="color:{color_cmf(v.get('cmf'))}">{fmt(v.get('cmf'),3)}</td>
<td>{fmt(v.get('mfi'),0)}</td></tr>'''
        return h or '<tr><td colspan="6" class="empty">No data</td></tr>'

    # Acceleration
    accel_rows = ""
    for a in accel_list[:20]:
        seq = " → ".join(str(s) for s in a["scores"])
        accel_rows += f'''<tr><td><b>{a["symbol"]}</b></td>
<td>{seq}</td>
<td style="color:#4ade80">+{a["delta"]}</td>
<td>{a["streak"]} consecutive</td></tr>'''
    if not accel_rows:
        accel_rows = '<tr><td colspan="4" class="empty">No acceleration signals (need 4+ scans of consecutive rising scores)</td></tr>'

    # CMF crossovers
    cross_rows = ""
    for c in crossover_list[:15]:
        cross_rows += f'''<tr><td><b>{c["symbol"]}</b></td>
<td style="color:#ef4444">{fmt(c["cmf_prev_min"],3)}</td>
<td style="color:#22c55e">{fmt(c["cmf_now"],3)}</td>
<td>{c.get("score","-")}</td></tr>'''
    if not cross_rows:
        cross_rows = '<tr><td colspan="4" class="empty">No CMF bullish crossovers in recent scans</td></tr>'

    # Sector rotation
    sec_rows = ""
    sec_max_delta = max((abs(s["delta"]) for s in sector_list), default=1) or 1
    for s in sector_list:
        color = color_delta(s["delta"])
        bar_width = abs(s["delta"]) / sec_max_delta * 100
        bar_side = "left" if s["delta"] >= 0 else "right"
        sec_rows += f'''<tr><td><b>{s["symbol"]}</b></td>
<td>{s["previous"]}</td>
<td>{s["current"]}</td>
<td style="color:{color}">{'+' if s['delta']>=0 else ''}{s['delta']}</td>
<td><div style="position:relative;height:8px;background:rgba(255,255,255,.05);border-radius:2px">
  <div style="position:absolute;{bar_side}:50%;height:100%;width:{bar_width/2:.0f}%;background:{color};border-radius:2px"></div>
  <div style="position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:rgba(255,255,255,.2)"></div>
</div></td></tr>'''

    # Top current with sparkline data
    top_rows = ""
    top_data = {}
    for t in top_list:
        top_data[t["symbol"]] = {
            "scores": t["history"], "dates": t["dates"]
        }
        top_rows += f'''<tr onclick="toggleChart('{t["symbol"]}')" style="cursor:pointer">
<td><b>{t["symbol"]}</b></td>
<td>{t["score"]}</td>
<td style="color:{color_cmf(t.get('cmf'))}">{fmt(t.get('cmf'),3)}</td>
<td>{fmt(t.get('mfi'),0)}</td>
<td>{fmt(t.get('rs_pct'),0)}</td>
<td><canvas id="spk-{t["symbol"]}" width="120" height="24"></canvas></td>
</tr>
<tr id="chart-{t["symbol"]}" style="display:none"><td colspan="6"><canvas id="big-{t["symbol"]}" height="80"></canvas></td></tr>'''

    top_data_json = json.dumps(top_data)

    return f'''<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Money Flow Analytics — {dates[0] if dates else "—"}</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
<style>@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:'JetBrains Mono',monospace;background:#080c14;color:#e2e8f0;padding:16px}}
h1{{font-size:15px;font-weight:700;letter-spacing:.08em;color:#f8fafc;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.06);padding-bottom:12px;margin-bottom:16px}}
.sub{{font-size:10px;color:#64748b;margin-top:4px}}
.tt{{font-size:13px;font-weight:700;letter-spacing:.06em;color:#f8fafc;text-transform:uppercase;margin:24px 0 12px}}
.tt-sub{{font-size:9px;color:#64748b;font-weight:400;margin-left:8px;text-transform:none;letter-spacing:0}}
.grid2{{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:16px}}
table{{width:100%;border-collapse:collapse;font-size:11px;background:rgba(255,255,255,.01);border:1px solid rgba(255,255,255,.05);border-radius:6px;overflow:hidden}}
th{{background:#1a1a2e;color:#fff;padding:8px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:.06em;font-weight:700}}
td{{padding:6px 8px;border-bottom:1px solid rgba(255,255,255,.04);font-size:10px}}
tr:hover td{{background:rgba(99,102,241,.04)}}
.empty{{color:#64748b;padding:20px;text-align:center}}
.summary{{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:20px}}
.scard{{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:6px;padding:14px}}
.scard .sl{{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}}
.scard .sv{{font-size:18px;font-weight:700}}
canvas{{display:block}}
.gloss-toggle{{cursor:pointer;font-size:13px;font-weight:700;letter-spacing:.06em;color:#f8fafc;text-transform:uppercase;margin:24px 0 12px}}
.gloss-arrow{{font-size:10px;color:#64748b;font-weight:400;text-transform:none;letter-spacing:0;margin-left:8px}}
.gloss-body{{display:none}}
.cube-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin:8px 0 16px}}
.cube-face{{border:1px solid;border-radius:6px;padding:10px;background:rgba(255,255,255,0.02);position:relative}}
.cf-tag{{position:absolute;top:8px;right:8px;font-size:8px;font-weight:700;padding:2px 6px;border-radius:3px}}
.cf-name{{font-size:11px;font-weight:700;color:#e2e8f0;margin-bottom:6px;padding-right:50px}}
.cf-q{{font-size:9px;color:#94a3b8;font-style:italic;line-height:1.4}}
.gloss-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}}
.gloss-card{{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:12px}}
.gc-t{{font-size:11px;font-weight:700;margin-bottom:6px}}
.gc-d{{font-size:9px;color:#94a3b8;line-height:1.5;margin-bottom:8px}}
.gc-f{{font-size:8px;color:#cbd5e1;font-family:monospace;background:rgba(0,0,0,0.25);padding:5px 8px;border-radius:3px;border-left:2px solid rgba(99,102,241,0.5);margin-bottom:8px}}
.gc-rg{{display:flex;gap:8px;flex-wrap:wrap}}
.gc-rg span{{font-size:8px;padding:2px 6px;border-radius:3px}}
</style></head><body>
<h1>Money Flow Analytics Dashboard</h1>
<div class="sub">{n_scans} scans in history | range: {date_range}</div>

<div class="gloss-toggle" onclick="var b=document.getElementById('gloss');var a=document.getElementById('garrow');b.style.display=b.style.display==='none'||b.style.display===''?'block':'none';a.textContent=b.style.display==='block'?'▲ tap to collapse':'▼ tap to expand'">Definitions &amp; Rubik's Cube Guide<span id="garrow" class="gloss-arrow">▼ tap to expand</span></div>
<div id="gloss" class="gloss-body">
<div style="font-size:10px;color:#cbd5e1;margin-bottom:8px;line-height:1.6">Every trade has 6 independent dimensions, like the faces of a Rubik's cube. The cube is "solved" only when every face turns green together. If one face is red — the cube isn't solved. Don't force a trade.</div>
<div class="cube-grid">
<div class="cube-face" style="border-color:#6366f1"><div class="cf-tag" style="background:#6366f1;color:#fff">RS 20</div><div class="cf-name">Relative Strength</div><div class="cf-q">Is this stock leading the market?</div></div>
<div class="cube-face" style="border-color:#22d3ee"><div class="cf-tag" style="background:#22d3ee;color:#000">FLOW 30</div><div class="cf-name">Money Flow ★</div><div class="cf-q">Where is institutional money going?</div></div>
<div class="cube-face" style="border-color:#a78bfa"><div class="cf-tag" style="background:#a78bfa;color:#000">MA 15</div><div class="cf-name">Moving Averages</div><div class="cf-q">Is the trend structure intact?</div></div>
<div class="cube-face" style="border-color:#fbbf24"><div class="cf-tag" style="background:#fbbf24;color:#000">PB 10</div><div class="cf-name">Pullback Quality</div><div class="cf-q">Is this a clean entry?</div></div>
<div class="cube-face" style="border-color:#34d399"><div class="cf-tag" style="background:#34d399;color:#000">MOM 15</div><div class="cf-name">Momentum</div><div class="cf-q">Is RSI in the sweet spot?</div></div>
<div class="cube-face" style="border-color:#f97316"><div class="cf-tag" style="background:#f97316;color:#fff">SHORT 10</div><div class="cf-name">Short Pressure</div><div class="cf-q">Are shorts trapped or right?</div></div>
</div>
<div class="gloss-grid">
<div class="gloss-card"><div class="gc-t" style="color:#22d3ee">CMF — Chaikin Money Flow (20)</div><div class="gc-d">Where close lands in the day's range × volume, summed 20 days. Captures HOW MUCH buying vs selling. Range -1 to +1.</div><div class="gc-f">CMF = Σ[((C-L)-(H-C))/(H-L) × V] / ΣV  over 20d</div><div class="gc-rg"><span style="background:rgba(34,197,94,.15);color:#4ade80">&gt;+.15 strong buy</span><span style="background:rgba(148,163,184,.15);color:#94a3b8">±.05 neutral</span><span style="background:rgba(239,68,68,.15);color:#f87171">&lt;-.15 distrib</span></div></div>
<div class="gloss-card"><div class="gc-t" style="color:#a78bfa">MFI — Money Flow Index (14)</div><div class="gc-d">RSI applied to (Typical Price × Volume). Catches overbought/oversold conditions that RSI misses. Range 0-100.</div><div class="gc-f">MFI = 100 - 100/(1 + posMF/negMF) over 14d  (using TP×V)</div><div class="gc-rg"><span style="background:rgba(34,197,94,.15);color:#4ade80">55-75 sweet</span><span style="background:rgba(239,68,68,.15);color:#f87171">&gt;80 overbought</span><span style="background:rgba(239,68,68,.15);color:#f87171">&lt;30 weak</span></div></div>
<div class="gloss-card"><div class="gc-t" style="color:#34d399">RSI — Relative Strength Index (14)</div><div class="gc-d">Pure price momentum, no volume. Use with MFI: RSI says "is price moving fast", MFI says "is volume backing it". Range 0-100.</div><div class="gc-f">RSI = 100 - 100/(1 + avg_gain/avg_loss)  over 14d</div><div class="gc-rg"><span style="background:rgba(34,197,94,.15);color:#4ade80">55-70 sweet</span><span style="background:rgba(239,68,68,.15);color:#f87171">&gt;75 overbought</span><span style="background:rgba(239,68,68,.15);color:#f87171">&lt;30 oversold</span></div></div>
<div class="gloss-card"><div class="gc-t" style="color:#fbbf24">OBV Divergence</div><div class="gc-d">On-Balance Volume tracks cumulative buy/sell pressure. When OBV and price disagree, OBV wins — it's where the money actually went.</div><div class="gc-f">OBV today = OBV yesterday ± today's volume (sign = up/down close)</div><div class="gc-rg"><span style="background:rgba(34,197,94,.15);color:#4ade80">HIDDEN ACC ★</span><span style="background:rgba(239,68,68,.15);color:#f87171">DISTRIB ⚠</span></div></div>
<div class="gloss-card"><div class="gc-t" style="color:#5eead4">Up/Down Volume Ratio (20)</div><div class="gc-d">Volume on up-close days ÷ volume on down-close days over 20 sessions. Pure pressure signal without price direction bias.</div><div class="gc-f">UD = Σ(vol up days) / Σ(vol down days)  over 20d</div><div class="gc-rg"><span style="background:rgba(34,197,94,.15);color:#4ade80">&gt;1.8 buying</span><span style="background:rgba(148,163,184,.15);color:#94a3b8">.8-1.3 balanced</span><span style="background:rgba(239,68,68,.15);color:#f87171">&lt;.5 selling</span></div></div>
<div class="gloss-card"><div class="gc-t" style="color:#f97316">FINRA Short % (Dark Pool)</div><div class="gc-d">Daily short sale volume as % of off-exchange trades. Baseline 40-60% (market maker activity). Deviations signal pressure.</div><div class="gc-f">Short% = (FINRA short vol / FINRA total vol) × 100, daily</div><div class="gc-rg"><span style="background:rgba(34,197,94,.15);color:#4ade80">&lt;35% longs ctrl</span><span style="background:rgba(239,68,68,.15);color:#f87171">&gt;55% elevated</span></div></div>
<div class="gloss-card"><div class="gc-t" style="color:#6366f1">RS Percentile Rank</div><div class="gc-d">Where this stock ranks vs all 110 stocks by 1-month return. True ranking signal, not raw return.</div><div class="gc-f">RS%ile = percentile rank of 1-month return across 110 stocks</div><div class="gc-rg"><span style="background:rgba(34,197,94,.15);color:#4ade80">&gt;75 top quart</span><span style="background:rgba(239,68,68,.15);color:#f87171">&lt;25 laggard</span></div></div>
<div class="gloss-card"><div class="gc-t" style="color:#e2e8f0">Velocity &amp; Acceleration</div><div class="gc-d">Velocity = score Δ vs 5 scans ago. Acceleration = 3+ consecutive rising scans. Cross-scan trend signals.</div><div class="gc-f">velocity = score_now − score_5_scans_ago</div><div class="gc-rg"><span style="background:rgba(34,197,94,.15);color:#4ade80">+10 strong gainer</span><span style="background:rgba(239,68,68,.15);color:#f87171">−10 strong loser</span></div></div>
</div>
</div>

<div class="summary" style="margin-top:20px">
<div class="scard"><div class="sl">Scans in history</div><div class="sv">{n_scans}</div></div>
<div class="scard"><div class="sl">Velocity gainers</div><div class="sv" style="color:#4ade80">{sum(1 for v in velocity_list if v['delta']>0)}</div></div>
<div class="scard"><div class="sl">Velocity losers</div><div class="sv" style="color:#f87171">{sum(1 for v in velocity_list if v['delta']<0)}</div></div>
<div class="scard"><div class="sl">Acceleration</div><div class="sv" style="color:#22c55e">{len(accel_list)}</div></div>
<div class="scard"><div class="sl">CMF crossovers</div><div class="sv" style="color:#22d3ee">{len(crossover_list)}</div></div>
</div>

<div class="tt">Sector Rotation <span class="tt-sub">score change over last 5 scans</span></div>
<table>
<thead><tr><th>Sector</th><th>5 scans ago</th><th>Latest</th><th>Δ</th><th>Direction</th></tr></thead>
<tbody>{sec_rows or '<tr><td colspan="5" class="empty">Need at least 2 scans</td></tr>'}</tbody>
</table>

<div class="grid2" style="margin-top:24px">
<div>
<div class="tt">Top Score Gainers <span class="tt-sub">vs 5 scans ago</span></div>
<table>
<thead><tr><th>Symbol</th><th>Prev</th><th>Now</th><th>Δ</th><th>CMF</th><th>MFI</th></tr></thead>
<tbody>{vel_rows(gainers,"+")}</tbody>
</table>
</div>
<div>
<div class="tt">Top Score Losers <span class="tt-sub">vs 5 scans ago</span></div>
<table>
<thead><tr><th>Symbol</th><th>Prev</th><th>Now</th><th>Δ</th><th>CMF</th><th>MFI</th></tr></thead>
<tbody>{vel_rows(losers,"-")}</tbody>
</table>
</div>
</div>

<div class="grid2">
<div>
<div class="tt">Acceleration List <span class="tt-sub">3+ consecutive rising scans</span></div>
<table>
<thead><tr><th>Symbol</th><th>Score Sequence</th><th>Δ</th><th>Streak</th></tr></thead>
<tbody>{accel_rows}</tbody>
</table>
</div>
<div>
<div class="tt">CMF Bullish Crossovers <span class="tt-sub">negative → positive</span></div>
<table>
<thead><tr><th>Symbol</th><th>Prev Min</th><th>Now</th><th>Score</th></tr></thead>
<tbody>{cross_rows}</tbody>
</table>
</div>
</div>

<div class="tt">Current Top 30 — Score History <span class="tt-sub">click row to expand chart</span></div>
<table>
<thead><tr><th>Symbol</th><th>Score</th><th>CMF</th><th>MFI</th><th>RS%ile</th><th>Trend</th></tr></thead>
<tbody>{top_rows or '<tr><td colspan="6" class="empty">No data</td></tr>'}</tbody>
</table>

<div style="margin-top:32px;padding:12px 0;border-top:1px solid rgba(255,255,255,.04);font-size:9px;color:#334155">Analytics Dashboard v1.0 — reads money_flow_history.db | Not financial advice.</div>

<script>
var TOP = {top_data_json};
Chart.defaults.color = '#64748b';
Chart.defaults.borderColor = 'rgba(255,255,255,0.04)';
Chart.defaults.font.family = "'JetBrains Mono',monospace";
Chart.defaults.font.size = 9;

function drawSparkline(sym, scores) {{
    var el = document.getElementById('spk-'+sym);
    if (!el) return;
    new Chart(el, {{
        type:'line',
        data:{{
            labels: scores.map(function(_,i){{return i}}),
            datasets:[{{data:scores,borderColor:'#22d3ee',borderWidth:1,pointRadius:0,tension:0.2,fill:false}}]
        }},
        options:{{
            responsive:false, plugins:{{legend:{{display:false}},tooltip:{{enabled:false}}}},
            scales:{{x:{{display:false}},y:{{display:false}}}}
        }}
    }});
}}

function toggleChart(sym) {{
    var row = document.getElementById('chart-'+sym);
    if (!row) return;
    if (row.style.display === 'none') {{
        row.style.display = 'table-row';
        var data = TOP[sym];
        if (!data) return;
        if (!row.dataset.drawn) {{
            new Chart(document.getElementById('big-'+sym), {{
                type:'line',
                data:{{
                    labels: data.dates,
                    datasets:[{{label:sym+' score',data:data.scores,borderColor:'#22d3ee',borderWidth:1.5,pointRadius:2,tension:0.1,fill:{{target:'origin',above:'rgba(34,211,238,0.08)'}}}}]
                }},
                options:{{
                    responsive:true,
                    plugins:{{title:{{display:true,text:sym+' — score history',color:'#94a3b8',font:{{size:10,weight:600}}}},legend:{{display:false}}}},
                    scales:{{
                        x:{{ticks:{{maxTicksLimit:8,font:{{size:7}}}}}},
                        y:{{min:0,max:100,position:'right',ticks:{{stepSize:25,font:{{size:8}}}}}}
                    }}
                }}
            }});
            row.dataset.drawn = 'true';
        }}
    }} else {{
        row.style.display = 'none';
    }}
}}

// Draw all sparklines
Object.keys(TOP).forEach(function(sym){{ drawSparkline(sym, TOP[sym].scores); }});
</script>
</body></html>'''

# ============================================================
# MAIN
# ============================================================
def main():
    if not os.path.exists(DB_PATH):
        print(f"  ERROR: {DB_PATH} not found. Run screener.py at least once first.\n")
        sys.exit(1)

    conn = sqlite3.connect(DB_PATH)
    dates = get_scan_dates(conn, 60)
    if not dates:
        print("  ERROR: no scan data in db.\n"); sys.exit(1)
    if len(dates) < 2:
        print(f"  Only {len(dates)} scan in db. Run screener.py daily — trends emerge after 5+ runs.\n")

    print(f"\n  ANALYTICS DASHBOARD  |  {len(dates)} scans in history")
    print(f"  Latest scan: {dates[0]}")
    print(f"  Oldest scan: {dates[-1]}\n")

    scores = load_scores(conn, dates)
    by_sym = group_by_symbol(scores)

    vel  = velocity(by_sym, lookback=5)
    accel= acceleration(by_sym, min_consecutive=3)
    cross= cmf_crossover(by_sym, lookback=5)
    sec  = sector_rotation(by_sym, lookback=5)
    top  = top_current(by_sym, n=30)

    print(f"  Velocity gainers:    {sum(1 for v in vel if v['delta']>0):3d}")
    print(f"  Velocity losers:     {sum(1 for v in vel if v['delta']<0):3d}")
    print(f"  Acceleration list:   {len(accel):3d}")
    print(f"  CMF crossovers:      {len(cross):3d}")
    print(f"  Sector rotations:    {len(sec):3d}")

    if vel and len(vel) > 0 and vel[0]["delta"] > 0:
        v = vel[0]
        print(f"\n  HOTTEST MOVER: {v['symbol']}  {v['previous']} → {v['current']}  (+{v['delta']})")

    html = generate_html(vel, accel, cross, sec, top, dates)
    with open("analytics_dashboard.html","w",encoding="utf-8") as f:
        f.write(html)
    print(f"\n  Dashboard: analytics_dashboard.html\n")

    conn.close()
    try:
        webbrowser.open("file://" + os.path.abspath("analytics_dashboard.html"))
    except Exception:
        pass

if __name__ == "__main__":
    main()
