import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ─── THEME & GLOBALS ──────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:      #080808;
    --charcoal:   #111111;
    --card:       #181818;
    --card2:      #1f1f1f;
    --border:     #2a2a2a;
    --gold:       #D4AF37;
    --gold-light: #F0C93A;
    --gold-pale:  #F5E17A;
    --gold-dim:   #8B6914;
    --gold-glow:  rgba(212,175,55,0.15);
    --gold-glow2: rgba(212,175,55,0.08);
    --white:      #FFFFFF;
    --off-white:  #F2ECD8;
    --gray:       #666666;
    --gray-light: #999999;
    --danger:     #E74C3C;
    --medium:     #E67E22;
    --success:    #27AE60;
    --font-head:  'Playfair Display', Georgia, serif;
    --font-body:  'DM Sans', system-ui, sans-serif;
    --radius:     12px;
    --radius-sm:  8px;
    --transition: 0.25s cubic-bezier(0.4,0,0.2,1);
  }

  html, body, #root { height: 100%; background: var(--black); color: var(--off-white); font-family: var(--font-body); }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--charcoal); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 3px; }

  /* ── LAYOUT ── */
  .app-shell { display: flex; height: 100vh; overflow: hidden; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 240px; min-width: 240px; background: var(--charcoal);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 0; position: relative; z-index: 10;
    box-shadow: 4px 0 24px rgba(0,0,0,0.5);
  }
  .sidebar-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-logo .crown { font-size: 24px; display: block; margin-bottom: 4px; }
  .sidebar-logo h1 { font-family: var(--font-head); font-size: 20px; color: var(--gold); letter-spacing: 0.02em; line-height: 1; }
  .sidebar-logo p { font-size: 10px; color: var(--gray); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px; }

  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .nav-section { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gray); padding: 12px 12px 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 14px;
    border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);
    font-size: 13.5px; font-weight: 500; color: var(--gray-light);
    position: relative; overflow: hidden;
  }
  .nav-item:hover { background: var(--gold-glow2); color: var(--off-white); }
  .nav-item.active { background: var(--gold-glow); color: var(--gold); }
  .nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: var(--gold); border-radius: 0 2px 2px 0;
  }
  .nav-item .icon { font-size: 16px; width: 20px; text-align: center; }
  .nav-badge {
    margin-left: auto; background: var(--danger); color: #fff;
    font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px;
  }

  .sidebar-footer {
    padding: 16px 20px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%; background: var(--gold-dim);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head); font-size: 14px; color: var(--gold-light); font-weight: 700;
    border: 1px solid var(--gold-dim); flex-shrink: 0;
  }
  .sidebar-user-info { flex: 1; min-width: 0; }
  .sidebar-user-info .name { font-size: 12.5px; font-weight: 600; color: var(--off-white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar-user-info .role { font-size: 10.5px; color: var(--gold-dim); text-transform: capitalize; }
  .logout-btn { background: none; border: none; cursor: pointer; color: var(--gray); padding: 4px; font-size: 16px; transition: var(--transition); border-radius: 6px; }
  .logout-btn:hover { color: var(--danger); background: rgba(231,76,60,0.1); }

  /* ── MAIN CONTENT ── */
  .main-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .topbar {
    padding: 20px 32px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border); background: var(--charcoal);
    position: sticky; top: 0; z-index: 5; backdrop-filter: blur(10px);
  }
  .topbar-title { font-family: var(--font-head); font-size: 22px; color: var(--gold); font-weight: 700; }
  .topbar-sub { font-size: 12px; color: var(--gray); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .topbar-badge {
    background: var(--gold-glow); border: 1px solid var(--gold-dim);
    color: var(--gold-pale); font-size: 11px; padding: 5px 12px; border-radius: 20px;
    font-family: var(--font-body);
  }

  .page-body { padding: 28px 32px; flex: 1; }

  /* ── STAT CARDS ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px 22px; position: relative; overflow: hidden; transition: var(--transition);
  }
  .stat-card:hover { border-color: var(--gold-dim); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--gold), transparent); }
  .stat-card .stat-icon { font-size: 22px; margin-bottom: 12px; }
  .stat-card .stat-val { font-family: var(--font-head); font-size: 32px; font-weight: 700; color: var(--gold); line-height: 1; }
  .stat-card .stat-label { font-size: 11.5px; color: var(--gray-light); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; }
  .stat-card .stat-sub { font-size: 11px; color: var(--gray); margin-top: 6px; }
  .stat-danger  .stat-val { color: var(--danger); }
  .stat-danger::before { background: linear-gradient(90deg, var(--danger), transparent); }
  .stat-medium  .stat-val { color: var(--medium); }
  .stat-medium::before  { background: linear-gradient(90deg, var(--medium), transparent); }
  .stat-success .stat-val { color: var(--success); }
  .stat-success::before { background: linear-gradient(90deg, var(--success), transparent); }

  /* ── CARDS ── */
  .card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 22px; margin-bottom: 20px;
  }
  .card-title {
    font-family: var(--font-head); font-size: 16px; color: var(--gold);
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .card-title .ct-icon { font-size: 18px; }

  /* ── CHARTS ── */
  .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .chart-wrap { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; }
  .chart-title { font-family: var(--font-head); font-size: 14px; color: var(--gold); margin-bottom: 16px; }

  /* Bar chart */
  .bar-chart { display: flex; flex-direction: column; gap: 10px; }
  .bar-row { display: flex; align-items: center; gap: 10px; }
  .bar-label { font-size: 11px; color: var(--gray-light); width: 70px; text-align: right; flex-shrink: 0; }
  .bar-track { flex: 1; background: var(--card2); border-radius: 4px; height: 20px; overflow: hidden; }
  .bar-fill {
    height: 100%; border-radius: 4px; position: relative;
    display: flex; align-items: center; justify-content: flex-end;
    padding-right: 6px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
    font-size: 10px; font-weight: 600; color: var(--charcoal);
  }
  .bar-val { font-size: 11px; color: var(--gray-light); width: 28px; flex-shrink: 0; }

  /* Donut chart */
  .donut-wrap { display: flex; align-items: center; gap: 20px; }
  .donut-svg { flex-shrink: 0; }
  .donut-legend { display: flex; flex-direction: column; gap: 8px; }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--gray-light); }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  /* ── TABLE ── */
  .table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead th {
    background: var(--card2); padding: 12px 14px; text-align: left;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold-dim); border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  tbody tr { border-bottom: 1px solid var(--border); transition: var(--transition); }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--gold-glow2); }
  tbody td { padding: 11px 14px; color: var(--off-white); }

  /* ── RISK BADGES ── */
  .risk-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .risk-HIGH   { background: rgba(231,76,60,0.15);  color: var(--danger); border: 1px solid rgba(231,76,60,0.3); }
  .risk-MEDIUM { background: rgba(230,126,34,0.15); color: var(--medium); border: 1px solid rgba(230,126,34,0.3); }
  .risk-LOW    { background: rgba(212,175,55,0.12); color: var(--gold);   border: 1px solid rgba(212,175,55,0.3); }

  /* ── PROGRESS BAR ── */
  .progress-bar { background: var(--card2); border-radius: 4px; height: 6px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: var(--radius-sm); font-family: var(--font-body);
    font-size: 13px; font-weight: 600; cursor: pointer; transition: var(--transition);
    border: none; text-decoration: none;
  }
  .btn-gold {
    background: var(--gold); color: var(--black);
  }
  .btn-gold:hover { background: var(--gold-light); box-shadow: 0 4px 20px rgba(212,175,55,0.35); }
  .btn-outline {
    background: transparent; color: var(--gold); border: 1px solid var(--gold-dim);
  }
  .btn-outline:hover { background: var(--gold-glow); border-color: var(--gold); }
  .btn-danger { background: rgba(231,76,60,0.15); color: var(--danger); border: 1px solid rgba(231,76,60,0.3); }
  .btn-danger:hover { background: rgba(231,76,60,0.25); }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .btn-icon { padding: 7px; }

  /* ── FORMS ── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-group.full { grid-column: 1 / -1; }
  label { font-size: 11.5px; font-weight: 600; color: var(--gray-light); letter-spacing: 0.06em; text-transform: uppercase; }
  input, select, textarea {
    background: var(--card2); border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 10px 14px; font-family: var(--font-body); font-size: 13.5px; color: var(--off-white);
    transition: var(--transition); outline: none; width: 100%;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--gold-dim); box-shadow: 0 0 0 3px var(--gold-glow); }
  input::placeholder { color: var(--gray); }
  select option { background: var(--card2); }

  /* ── RANGE SLIDER ── */
  input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: var(--card2); border: none; padding: 0; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--gold); cursor: pointer; box-shadow: 0 0 8px rgba(212,175,55,0.4); }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0,0,0,0.8); animation: modalIn 0.2s ease;
  }
  @keyframes modalIn { from { opacity:0; transform: scale(0.96) translateY(8px); } to { opacity:1; transform:none; } }
  .modal-header {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .modal-title { font-family: var(--font-head); font-size: 18px; color: var(--gold); }
  .modal-body { padding: 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }

  /* ── SEARCH / FILTER BAR ── */
  .search-bar {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .search-input-wrap { position: relative; flex: 1; min-width: 200px; }
  .search-input-wrap input { padding-left: 36px; }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray); font-size: 14px; pointer-events: none; }
  .filter-select { width: auto; min-width: 140px; }

  /* ── LOGIN PAGE ── */
  .login-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--black); padding: 20px; position: relative; overflow: hidden;
  }
  .login-bg-ring {
    position: absolute; border-radius: 50%; border: 1px solid var(--border);
    pointer-events: none;
  }
  .login-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 20px;
    padding: 44px 40px; width: 100%; max-width: 420px; position: relative; z-index: 1;
    box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.1);
  }
  .login-logo { text-align: center; margin-bottom: 32px; }
  .login-logo .crown-big { font-size: 40px; display: block; margin-bottom: 8px; }
  .login-logo h1 { font-family: var(--font-head); font-size: 30px; color: var(--gold); }
  .login-logo p { font-size: 12px; color: var(--gray); margin-top: 4px; letter-spacing: 0.1em; text-transform: uppercase; }
  .login-divider { text-align: center; color: var(--gold); font-size: 14px; margin: 8px 0 24px; opacity: 0.4; }
  .login-form { display: flex; flex-direction: column; gap: 16px; }
  .login-form .btn-gold { width: 100%; justify-content: center; padding: 12px; font-size: 14px; margin-top: 4px; }
  .login-hint { margin-top: 20px; padding: 14px; background: var(--card2); border-radius: var(--radius-sm); border: 1px solid var(--border); }
  .login-hint p { font-size: 11px; color: var(--gray); line-height: 1.6; }
  .login-hint strong { color: var(--gold-pale); }
  .login-error { background: rgba(231,76,60,0.1); border: 1px solid rgba(231,76,60,0.3); color: var(--danger); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; }

  /* ── PREDICTION PAGE ── */
  .pred-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .pred-meter {
    display: flex; flex-direction: column; align-items: center; padding: 28px;
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
  }
  .risk-meter-label { font-size: 11px; color: var(--gray-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .risk-score-big { font-family: var(--font-head); font-size: 72px; font-weight: 900; line-height: 1; }
  .risk-level-big { font-size: 14px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 8px; padding: 5px 18px; border-radius: 20px; }
  .risk-rec { font-size: 12.5px; color: var(--gray-light); text-align: center; margin-top: 12px; line-height: 1.5; max-width: 260px; }

  .factors-list { display: flex; flex-direction: column; gap: 12px; }
  .factor-row { display: flex; flex-direction: column; gap: 4px; }
  .factor-header { display: flex; justify-content: space-between; align-items: center; }
  .factor-name { font-size: 12.5px; color: var(--off-white); font-weight: 500; }
  .factor-val  { font-size: 12px; color: var(--gold-pale); font-weight: 600; }

  /* ── UPLOAD PAGE ── */
  .upload-zone {
    border: 2px dashed var(--gold-dim); border-radius: var(--radius);
    padding: 40px; text-align: center; cursor: pointer; transition: var(--transition);
    background: var(--card2); margin-bottom: 20px;
  }
  .upload-zone:hover { border-color: var(--gold); background: var(--gold-glow2); }
  .upload-zone .upload-icon { font-size: 40px; display: block; margin-bottom: 12px; color: var(--gold-dim); }
  .upload-zone p { color: var(--gray-light); font-size: 14px; }
  .upload-zone strong { color: var(--gold); }
  .csv-preview { background: var(--card2); border-radius: var(--radius-sm); border: 1px solid var(--border); padding: 14px; font-family: monospace; font-size: 11px; color: var(--gray-light); white-space: pre-wrap; max-height: 180px; overflow-y: auto; margin-bottom: 16px; }

  /* ── TOASTS ── */
  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; }
  .toast {
    background: var(--card2); border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 12px 16px; font-size: 13px; color: var(--off-white);
    box-shadow: 0 8px 24px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 10px;
    animation: toastIn 0.3s ease;
    min-width: 240px;
  }
  .toast.success { border-left: 3px solid var(--success); }
  .toast.error   { border-left: 3px solid var(--danger); }
  .toast.info    { border-left: 3px solid var(--gold); }
  @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity:1; transform:none; } }

  /* ── MISC ── */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
  .section-title { font-family: var(--font-head); font-size: 18px; color: var(--gold); }
  .empty-state { text-align: center; padding: 48px; color: var(--gray); }
  .empty-state .es-icon { font-size: 40px; display: block; margin-bottom: 10px; }
  .spinner { animation: spin 1s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .gold-text { color: var(--gold); }
  .text-gray { color: var(--gray-light); font-size: 12px; }
  .mt-1 { margin-top: 8px; }
  .mt-2 { margin-top: 16px; }
  .mt-3 { margin-top: 24px; }
  .flex { display: flex; }
  .gap-2 { gap: 8px; }
  .items-center { align-items: center; }
  .w-full { width: 100%; }
  .text-center { text-align: center; }
  .justify-between { justify-content: space-between; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .charts-grid { grid-template-columns: 1fr; }
    .pred-grid { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    .page-body { padding: 16px; }
    .topbar { padding: 14px 16px; }
  }
`;

// ─── API CLIENT ───────────────────────────────────────────────────────────────
const API = 'http://localhost:5000/api';

async function api(path, opts = {}) {
  const token = localStorage.getItem('eg_token');
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...opts,
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
function useAuth() { return useContext(AuthCtx); }

// ─── TOAST CONTEXT ────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);
function useToast() { return useContext(ToastCtx); }

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const riskColor = (lvl) => ({ HIGH: '#E74C3C', MEDIUM: '#E67E22', LOW: '#D4AF37' }[lvl] || '#D4AF37');
const riskBg    = (lvl) => ({ HIGH: 'rgba(231,76,60,0.1)', MEDIUM: 'rgba(230,126,34,0.1)', LOW: 'rgba(212,175,55,0.08)' }[lvl] || '');
const initials  = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

function BarChart({ data, colorFn }) {
  const max = Math.max(...data.map(d => d.value ?? d.count ?? 0), 1);
  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const val = d.value ?? d.count ?? 0;
        const pct = Math.round(val / max * 100);
        const color = colorFn ? colorFn(d, i) : '#D4AF37';
        return (
          <div className="bar-row" key={i}>
            <span className="bar-label">{d.label ?? d.band}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct}%`, background: color }}>{val > 0 && pct > 18 ? val : ''}</div>
            </div>
            <span className="bar-val">{val}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ data, size = 130 }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  let cumulative = 0;
  const cx = size / 2, cy = size / 2, r = size * 0.38, stroke = size * 0.12;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} className="donut-svg">
        {data.map((d, i) => {
          const pct = d.value / total;
          const offset = circumference * (1 - pct);
          const rotation = cumulative * 360 - 90;
          cumulative += pct;
          return (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={d.color} strokeWidth={stroke}
              strokeDasharray={`${circumference * pct} ${circumference * (1 - pct)}`}
              strokeDashoffset={0}
              transform={`rotate(${rotation} ${cx} ${cy})`}
              strokeLinecap="round"
            />
          );
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#F2ECD8" fontSize={size * 0.14} fontWeight="700">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#666" fontSize={size * 0.08}>students</text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div className="legend-item" key={i}>
            <div className="legend-dot" style={{ background: d.color }} />
            <span>{d.label}: <strong style={{ color: '#F2ECD8' }}>{d.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskMeter({ score, level }) {
  const color = riskColor(level);
  return (
    <div className="pred-meter">
      <span className="risk-meter-label">Risk Score</span>
      <span className="risk-score-big" style={{ color }}>{score}</span>
      <span className="risk-level-big" style={{ color, background: riskBg(level), border: `1px solid ${color}40` }}>{level} RISK</span>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@muj.edu');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('eg_token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="login-page">
      {/* Decorative rings */}
      {[320, 480, 640, 800].map((s, i) => (
        <div key={i} className="login-bg-ring" style={{ width: s, height: s, top: `calc(50% - ${s/2}px)`, right: `-${s/3}px`, opacity: 0.15 - i*0.03 }} />
      ))}
      <div className="login-card">
        <div className="login-logo">
          <span className="crown-big">👑</span>
          <h1>EduGuard AI</h1>
          <p>Academic Intelligence Platform</p>
        </div>
        <div className="login-divider">— — —</div>
        {error && <div className="login-error">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button className="btn btn-gold" type="submit" disabled={loading}>
            {loading ? <span className="spinner">⟳</span> : '👑'} {loading ? 'Authenticating…' : 'Enter Dashboard'}
          </button>
        </form>
        <div className="login-hint mt-2">
          <p><strong>Admin:</strong> admin@muj.edu / admin123<br /><strong>Teacher:</strong> teacher@muj.edu / teacher123</p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api('/analytics/summary'), api('/students')])
      .then(([s, sts]) => { setSummary(s); setStudents(sts); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><div className="empty-state"><span className="spinner" style={{fontSize:32}}>⟳</span></div></div>;

  const atRisk = students.filter(s => s.riskLevel === 'HIGH').slice(0, 5);

  return (
    <div className="page-body">
      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-val">{summary.totalStudents}</div>
          <div className="stat-label">Total Students</div>
          <div className="stat-sub">CCE Semester 6</div>
        </div>
        <div className="stat-card stat-danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-val">{summary.highRisk}</div>
          <div className="stat-label">High Risk</div>
          <div className="stat-sub">Immediate attention</div>
        </div>
        <div className="stat-card stat-medium">
          <div className="stat-icon">📊</div>
          <div className="stat-val">{summary.avgAttendance}%</div>
          <div className="stat-label">Avg Attendance</div>
          <div className="stat-sub">Class average</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">⭐</div>
          <div className="stat-val">{summary.avgGPA}</div>
          <div className="stat-label">Avg GPA</div>
          <div className="stat-sub">Out of 10.0</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="charts-grid">
        <div className="chart-wrap">
          <div className="chart-title">📈 Risk Distribution</div>
          <DonutChart data={summary.riskDistribution} size={140} />
        </div>
        <div className="chart-wrap">
          <div className="chart-title">🎯 Attendance Bands</div>
          <BarChart data={summary.attendanceBands} colorFn={(d, i) => ['#E74C3C','#E67E22','#8B6914','#D4AF37'][i]} />
        </div>
        <div className="chart-wrap">
          <div className="chart-title">🏆 GPA Distribution</div>
          <BarChart data={summary.gpaDistribution} colorFn={(d, i) => ['#E74C3C','#E67E22','#8B6914','#D4AF37'][i]} />
        </div>
        <div className="chart-wrap">
          <div className="chart-title">🔴 At-Risk Students</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {atRisk.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{width:30,height:30,fontSize:11}}>{initials(s.name)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--off-white)'}}>{s.name}</div>
                  <div className="progress-bar mt-1" style={{width:'100%'}}>
                    <div className="progress-fill" style={{width:`${s.riskScore}%`,background:'var(--danger)'}} />
                  </div>
                </div>
                <span style={{fontSize:11,color:'var(--danger)',fontWeight:700}}>{s.riskScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENTS PAGE ────────────────────────────────────────────────────────────
function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name:'', rollNo:'', attendance:75, assignments:75, internalExam:70, studyHours:5, prevGPA:7.0, branch:'CCE', semester:6 });
  const toast = useToast();

  const load = useCallback(() => {
    api('/students').then(setStudents).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.includes(search);
    const matchFilter = filter === 'ALL' || s.riskLevel === filter;
    return matchSearch && matchFilter;
  });

  function openAdd() {
    setForm({ name:'', rollNo:'', attendance:75, assignments:75, internalExam:70, studyHours:5, prevGPA:7.0, branch:'CCE', semester:6 });
    setModal('add');
  }
  function openEdit(s) { setSelected(s); setForm({ ...s }); setModal('edit'); }

  async function handleSave() {
    try {
      if (modal === 'add') { await api('/students', { method:'POST', body: JSON.stringify(form) }); toast.show('Student added!', 'success'); }
      else { await api(`/students/${selected.id}`, { method:'PUT', body: JSON.stringify(form) }); toast.show('Student updated!', 'success'); }
      setModal(null); load();
    } catch(e) { toast.show(e.message, 'error'); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this student?')) return;
    try { await api(`/students/${id}`, { method:'DELETE' }); toast.show('Student removed', 'info'); load(); }
    catch(e) { toast.show(e.message, 'error'); }
  }

  if (loading) return <div className="page-body"><div className="empty-state"><span className="spinner" style={{fontSize:32}}>⟳</span></div></div>;

  return (
    <div className="page-body">
      <div className="section-header">
        <div className="section-title">All Students <span style={{color:'var(--gray)',fontSize:14,fontWeight:400}}>({filtered.length})</span></div>
        <button className="btn btn-gold" onClick={openAdd}>＋ Add Student</button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input placeholder="Search by name or roll number…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="ALL">All Risk Levels</option>
          <option value="HIGH">🔴 High Risk</option>
          <option value="MEDIUM">🟠 Medium Risk</option>
          <option value="LOW">🟡 Low Risk</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student</th><th>Roll No.</th><th>Attendance</th><th>Assignments</th><th>Exam</th><th>GPA</th><th>Risk</th><th>Pred. Grade</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:9}}><div className="avatar" style={{width:30,height:30,fontSize:11}}>{initials(s.name)}</div><span style={{fontWeight:500}}>{s.name}</span></div></td>
                <td><span style={{fontFamily:'monospace',fontSize:12,color:'var(--gray-light)'}}>{s.rollNo}</span></td>
                <td>
                  <div>{s.attendance}%</div>
                  <div className="progress-bar mt-1" style={{width:70}}>
                    <div className="progress-fill" style={{width:`${s.attendance}%`,background: s.attendance<50?'var(--danger)':s.attendance<75?'var(--medium)':'var(--gold)'}} />
                  </div>
                </td>
                <td>{s.assignments}%</td>
                <td>{s.internalExam}%</td>
                <td><span style={{color:'var(--gold-pale)',fontWeight:600}}>{s.prevGPA}</span></td>
                <td><span className={`risk-badge risk-${s.riskLevel}`}>{s.riskLevel}</span></td>
                <td><span style={{color:'var(--off-white)',fontWeight:600}}>{s.predictedGrade}</span></td>
                <td>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><span className="es-icon">🔍</span>No students found</div>}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{modal === 'add' ? '➕ Add Student' : '✏️ Edit Student'}</span>
              <button className="btn btn-icon" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                {[{k:'name',l:'Full Name',full:true},{k:'rollNo',l:'Roll Number'}].map(({k,l,full}) => (
                  <div className={`form-group${full?' full':''}`} key={k}>
                    <label>{l}</label>
                    <input value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} placeholder={l} />
                  </div>
                ))}
                {[
                  {k:'attendance',l:'Attendance %',min:0,max:100},
                  {k:'assignments',l:'Assignments %',min:0,max:100},
                  {k:'internalExam',l:'Internal Exam %',min:0,max:100},
                  {k:'studyHours',l:'Daily Study Hours',min:0,max:12,step:0.5},
                  {k:'prevGPA',l:'Previous GPA',min:0,max:10,step:0.1},
                ].map(({k,l,min,max,step=1}) => (
                  <div className="form-group" key={k}>
                    <label style={{display:'flex',justifyContent:'space-between'}}><span>{l}</span><span style={{color:'var(--gold)'}}>{form[k]}</span></label>
                    <input type="range" min={min} max={max} step={step} value={form[k]} onChange={e => setForm({...form,[k]:parseFloat(e.target.value)})} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Branch</label>
                  <select value={form.branch} onChange={e => setForm({...form,branch:e.target.value})}>
                    {['CCE','CSE','ECE','ME','CE'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <select value={form.semester} onChange={e => setForm({...form,semester:parseInt(e.target.value)})}>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleSave}>💾 Save Student</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PREDICTION PAGE ──────────────────────────────────────────────────────────
function PredictionPage() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manual, setManual] = useState({ attendance: 70, assignments: 70, internalExam: 65, studyHours: 4, prevGPA: 7.0 });

  useEffect(() => { api('/students').then(setStudents); }, []);

  async function predict() {
    if (!selected) return;
    setLoading(true);
    const data = await api(`/analytics/predict/${selected}`).finally(() => setLoading(false));
    setPrediction(data);
  }

  function predictManual() {
    const score = computeRiskScore(manual);
    const level = score >= 60 ? 'HIGH' : score >= 35 ? 'MEDIUM' : 'LOW';
    setPrediction({ ...manual, riskScore: score, riskLevel: level,
      predictedGrade: score >= 60 ? 'F/D' : score >= 35 ? 'C/B' : 'A/B+',
      recommendation: score >= 60 ? 'Immediate intervention required. Schedule counselling.' : score >= 35 ? 'Monitor closely. Encourage study group participation.' : 'On track. Continue current performance.',
      name: 'Manual Input'
    });
  }

  function computeRiskScore({ attendance, assignments, internalExam, studyHours, prevGPA }) {
    const r = (100-attendance)*0.30 + (100-assignments)*0.20 + (100-internalExam)*0.25 + Math.max(0,(8-studyHours)/8*100)*0.15 + Math.max(0,(10-prevGPA)/10*100)*0.10;
    return Math.round(Math.min(100,Math.max(0,r)));
  }

  const factors = prediction ? [
    { name: 'Attendance',    val: `${prediction.attendance}%`,  score: prediction.attendance,    invert: true },
    { name: 'Assignments',   val: `${prediction.assignments}%`, score: prediction.assignments,   invert: true },
    { name: 'Internal Exam', val: `${prediction.internalExam}%`,score: prediction.internalExam,  invert: true },
    { name: 'Study Hours',   val: `${prediction.studyHours}h`,  score: prediction.studyHours/12*100, invert: true },
    { name: 'Previous GPA',  val: prediction.prevGPA,           score: prediction.prevGPA/10*100, invert: true },
  ] : [];

  return (
    <div className="page-body">
      <div className="section-header">
        <div className="section-title">🤖 Risk Prediction Engine</div>
        <div style={{display:'flex',gap:8}}>
          <button className={`btn ${!manualMode?'btn-gold':'btn-outline'}`} onClick={() => setManualMode(false)}>By Student</button>
          <button className={`btn ${manualMode?'btn-gold':'btn-outline'}`} onClick={() => setManualMode(true)}>Manual Input</button>
        </div>
      </div>

      <div className="pred-grid">
        {/* Left — inputs */}
        <div className="card">
          <div className="card-title"><span className="ct-icon">⚙️</span>Input Parameters</div>
          {!manualMode ? (
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <div className="form-group">
                <label>Select Student</label>
                <select value={selected} onChange={e => setSelected(e.target.value)}>
                  <option value="">— Choose a student —</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
                </select>
              </div>
              <button className="btn btn-gold w-full" style={{justifyContent:'center'}} onClick={predict} disabled={!selected || loading}>
                {loading ? <span className="spinner">⟳</span> : '🔮'} {loading ? 'Analysing…' : 'Run Prediction'}
              </button>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {[
                {k:'attendance',l:'Attendance %',min:0,max:100},
                {k:'assignments',l:'Assignments %',min:0,max:100},
                {k:'internalExam',l:'Internal Exam %',min:0,max:100},
                {k:'studyHours',l:'Daily Study Hours',min:0,max:12,step:0.5},
                {k:'prevGPA',l:'Previous GPA',min:0,max:10,step:0.1},
              ].map(({k,l,min,max,step=1}) => (
                <div className="form-group" key={k}>
                  <label style={{display:'flex',justifyContent:'space-between'}}><span>{l}</span><span style={{color:'var(--gold)'}}>{manual[k]}</span></label>
                  <input type="range" min={min} max={max} step={step} value={manual[k]} onChange={e => setManual({...manual,[k]:parseFloat(e.target.value)})} />
                </div>
              ))}
              <button className="btn btn-gold" style={{justifyContent:'center'}} onClick={predictManual}>🔮 Predict Risk</button>
            </div>
          )}
        </div>

        {/* Right — result */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {prediction ? (
            <>
              <RiskMeter score={prediction.riskScore} level={prediction.riskLevel} />
              <div className="card" style={{margin:0}}>
                <div className="card-title"><span className="ct-icon">📋</span>Factor Analysis</div>
                <div className="factors-list">
                  {factors.map((f, i) => (
                    <div className="factor-row" key={i}>
                      <div className="factor-header">
                        <span className="factor-name">{f.name}</span>
                        <span className="factor-val">{f.val}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width:`${f.score}%`,background: f.score<50?'var(--danger)':f.score<75?'var(--medium)':'var(--gold)'}} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2" style={{padding:'12px 14px',background:'var(--card2)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)'}}>
                  <div style={{fontSize:11,color:'var(--gold-dim)',fontWeight:700,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.1em'}}>Recommendation</div>
                  <div style={{fontSize:13,color:'var(--off-white)',lineHeight:1.5}}>{prediction.recommendation}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{margin:0,height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div className="empty-state">
                <span className="es-icon">🔮</span>
                <p>Select a student or enter values manually to run the prediction engine.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── UPLOAD PAGE ──────────────────────────────────────────────────────────────
function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState('');
  const [rows, setRows] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const CSV_SAMPLE = `name,rollNo,attendance,assignments,internalExam,studyHours,prevGPA,branch,semester
Aditya Kumar,23FE10CCE00030,72,68,65,4.5,7.1,CCE,6
Ritika Shah,23FE10CCE00031,45,50,40,2.0,5.2,CCE,6
Manav Joshi,23FE10CCE00032,90,88,85,7.0,8.8,CCE,6`;

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const vals = line.split(',');
      const obj = {};
      headers.forEach((h, i) => {
        const v = vals[i]?.trim();
        obj[h] = isNaN(v) ? v : parseFloat(v);
      });
      return obj;
    });
  }

  function handleFile(file) {
    if (!file?.name.endsWith('.csv')) { toast.show('Please upload a CSV file', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      setPreview(text.slice(0, 500) + (text.length > 500 ? '…' : ''));
      setRows(parseCSV(text));
    };
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function loadSample() {
    setPreview(CSV_SAMPLE);
    setRows(parseCSV(CSV_SAMPLE));
    toast.show('Sample data loaded!', 'info');
  }

  async function handleUpload() {
    if (!rows.length) { toast.show('No data to upload', 'error'); return; }
    setLoading(true);
    try {
      const data = await api('/upload', { method:'POST', body: JSON.stringify({ rows }) });
      setResult(data);
      toast.show(`✅ ${data.added} students uploaded!`, 'success');
      setRows([]); setPreview('');
    } catch(e) { toast.show(e.message, 'error'); }
    finally { setLoading(false); }
  }

  return (
    <div className="page-body">
      <div className="section-header">
        <div className="section-title">📤 Data Upload & Management</div>
        <button className="btn btn-outline" onClick={loadSample}>📋 Load Sample CSV</button>
      </div>

      <div className="card">
        <div className="card-title"><span className="ct-icon">📁</span>Upload Student Data</div>
        <div
          className="upload-zone"
          style={dragging ? {borderColor:'var(--gold)',background:'var(--gold-glow)'} : {}}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('csv-input').click()}
        >
          <span className="upload-icon">📂</span>
          <p><strong>Drag & drop</strong> your CSV file here, or <strong>click to browse</strong></p>
          <p style={{fontSize:12,marginTop:6,color:'var(--gray)'}}>Required columns: name, rollNo, attendance, assignments, internalExam, studyHours, prevGPA</p>
          <input id="csv-input" type="file" accept=".csv" style={{display:'none'}} onChange={e => handleFile(e.target.files[0])} />
        </div>

        {preview && (
          <>
            <div style={{marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:12,color:'var(--gold)'}}>📋 Preview ({rows.length} rows)</span>
              <button className="btn btn-danger btn-sm" onClick={() => {setPreview('');setRows([]);setResult(null);}}>✕ Clear</button>
            </div>
            <div className="csv-preview">{preview}</div>
            <button className="btn btn-gold" onClick={handleUpload} disabled={loading}>
              {loading ? <span className="spinner">⟳</span> : '🚀'} {loading ? 'Uploading…' : `Upload ${rows.length} Students`}
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="card">
          <div className="card-title"><span className="ct-icon">✅</span>Upload Results — {result.added} students added</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Roll No.</th><th>Attendance</th><th>Risk Level</th><th>Pred. Grade</th></tr></thead>
              <tbody>
                {result.students.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td><span style={{fontFamily:'monospace',fontSize:12}}>{s.rollNo}</span></td>
                    <td>{s.attendance}%</td>
                    <td><span className={`risk-badge risk-${s.riskLevel}`}>{s.riskLevel}</span></td>
                    <td>{s.predictedGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Format guide */}
      <div className="card">
        <div className="card-title"><span className="ct-icon">📖</span>CSV Format Guide</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12}}>
          {[
            {field:'name',type:'String','desc':'Full student name'},
            {field:'rollNo',type:'String',desc:'e.g. 23FE10CCE00017'},
            {field:'attendance',type:'Number 0-100',desc:'Attendance percentage'},
            {field:'assignments',type:'Number 0-100',desc:'Assignment score %'},
            {field:'internalExam',type:'Number 0-100',desc:'Internal exam score %'},
            {field:'studyHours',type:'Number 0-12',desc:'Daily study hours'},
            {field:'prevGPA',type:'Number 0-10',desc:'Previous semester GPA'},
          ].map(({field,type,desc}) => (
            <div key={field} style={{background:'var(--card2)',borderRadius:'var(--radius-sm)',padding:'10px 12px',border:'1px solid var(--border)'}}>
              <div style={{fontFamily:'monospace',fontSize:12,color:'var(--gold-pale)',fontWeight:600}}>{field}</div>
              <div style={{fontSize:11,color:'var(--gold-dim)',marginTop:2}}>{type}</div>
              <div style={{fontSize:11,color:'var(--gray)',marginTop:4}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',  icon: '📊', label: 'Dashboard',       section: 'OVERVIEW' },
  { id: 'students',   icon: '🎓', label: 'Students',         section: null },
  { id: 'prediction', icon: '🔮', label: 'Risk Prediction',  section: null },
  { id: 'upload',     icon: '📤', label: 'Upload Data',      section: 'DATA' },
];

const PAGE_TITLES = { dashboard: 'Academic Dashboard', students: 'Student Management', prediction: 'ML Prediction Engine', upload: 'Data Upload' };
const PAGE_SUBS   = { dashboard: 'Real-time academic intelligence overview', students: 'View, edit and manage student records', prediction: 'AI-powered risk analysis & early warning', upload: 'Bulk import student performance data' };

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('eg_token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) { localStorage.removeItem('eg_token'); return null; }
      return payload;
    } catch { return null; }
  });
  const [page, setPage] = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = 'info') {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }

  function logout() {
    localStorage.removeItem('eg_token');
    setUser(null);
  }

  const highRiskCount = 0; // would fetch from state in real app

  if (!user) return (
    <>
      <style>{STYLE}</style>
      <AuthCtx.Provider value={{ user, logout }}>
        <ToastCtx.Provider value={{ show: showToast }}>
          <LoginPage onLogin={setUser} />
          <div className="toast-container">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>)}</div>
        </ToastCtx.Provider>
      </AuthCtx.Provider>
    </>
  );

  const PageComp = { dashboard: DashboardPage, students: StudentsPage, prediction: PredictionPage, upload: UploadPage }[page];

  return (
    <>
      <style>{STYLE}</style>
      <AuthCtx.Provider value={{ user, logout }}>
        <ToastCtx.Provider value={{ show: showToast }}>
          <div className="app-shell">
            {/* Sidebar */}
            <aside className="sidebar">
              <div className="sidebar-logo">
                <span className="crown">👑</span>
                <h1>EduGuard AI</h1>
                <p>Academic Intelligence</p>
              </div>
              <nav className="sidebar-nav">
                {NAV.map(item => (
                  <div key={item.id}>
                    {item.section && <div className="nav-section">{item.section}</div>}
                    <div className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
                      <span className="icon">{item.icon}</span>
                      {item.label}
                      {item.id === 'students' && highRiskCount > 0 && <span className="nav-badge">{highRiskCount}</span>}
                    </div>
                  </div>
                ))}
              </nav>
              <div className="sidebar-footer">
                <div className="avatar">{initials(user.name)}</div>
                <div className="sidebar-user-info">
                  <div className="name">{user.name}</div>
                  <div className="role">{user.role}</div>
                </div>
                <button className="logout-btn" onClick={logout} title="Logout">⏻</button>
              </div>
            </aside>

            {/* Main */}
            <main className="main-content">
              <div className="topbar">
                <div>
                  <div className="topbar-title">{PAGE_TITLES[page]}</div>
                  <div className="topbar-sub">{PAGE_SUBS[page]}</div>
                </div>
                <div className="topbar-right">
                  <span className="topbar-badge">👑 MUJ · CCE3270</span>
                </div>
              </div>
              <PageComp />
            </main>
          </div>
          <div className="toast-container">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>)}</div>
        </ToastCtx.Provider>
      </AuthCtx.Provider>
    </>
  );
}
