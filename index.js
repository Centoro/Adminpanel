/* =====================================================
   CENTORO ADMIN — DATA LAYER v8.4
   PLATFORM COMMUNICATION HUB + ADAPTIVE THEMING
   + AI, EMAIL, PHONE, SMS, DEVICE MONITORING & FRAUD DETECTION
===================================================== */
const DB_KEY = 'centoro_admin_db_v7';
const ALL_PERMS = ['dashboard','projects','jobcards','invoices','accounting','vouchers','clients','staff','payroll','chats','email','phone','assets','website','data','settings','bin'];
const PERM_LABELS = { dashboard:'Dashboard', projects:'Projects', jobcards:'Job Cards', invoices:'Invoices', accounting:'Accounting', vouchers:'Vouchers', clients:'Clients', staff:'Staff', payroll:'Payroll', chats:'Client Chats', email:'Email Center', phone:'Phone & SMS', assets:'Assets', website:'Website', data:'Data & Reports', settings:'Settings', bin:'Bin' };
window.MEDIA = {};

function getDefaultDB() { return {}; }
function loadDB() { return {}; }
function saveDB() {
  if (window.ApiService && typeof ApiService.persistAdminData === 'function') {
    ApiService.persistAdminData(DB).catch(error => console.error('Unable to persist admin data:', error));
  }
}
let DB = loadDB();

/* ===== COLLECTION GUARANTEE ===== */
function ensureCollections() {
  if (!DB.clients) DB.clients = [];
  if (!DB.staff) DB.staff = [];
  if (!DB.teams) DB.teams = [];
  if (!DB.services) DB.services = [];
  if (!DB.projects) DB.projects = [];
  if (!DB.projectMessages) DB.projectMessages = [];
  if (!DB.jobCards) DB.jobCards = [];
  if (!DB.invoices) DB.invoices = [];
  if (!DB.payments) DB.payments = [];
  if (!DB.expenses) DB.expenses = [];
  if (!DB.taxPeriods) DB.taxPeriods = [];
  if (!DB.payrollRecords) DB.payrollRecords = [];
  if (!DB.bookings) DB.bookings = [];
  if (!DB.assets) DB.assets = [];
  if (!DB.chats) DB.chats = [];
  if (!DB.vouchers) DB.vouchers = [];
  if (!DB.portalAccounts) DB.portalAccounts = [];
  if (!DB.connectedAccounts) DB.connectedAccounts = [];
  if (!DB.socialPosts) DB.socialPosts = [];
  if (!DB.documents) DB.documents = [];
  if (!DB.integrations) DB.integrations = [];
  if (!DB.currencies) DB.currencies = [];
  if (!DB.budgets) DB.budgets = [];
  if (!DB.analytics) DB.analytics = { countries: [], interactions: [], devices: {} };
  if (!DB.trash) DB.trash = [];
  if (!DB.activity) DB.activity = [];
  if (!DB.website) DB.website = { slides: [], news: [], priceList: [] };
  if (!DB.website.priceList) DB.website.priceList = [];
  if (!DB.website.news) DB.website.news = [];
  if (!DB.website.slides) DB.website.slides = [];
  if (!DB.settings) DB.settings = { companyName: 'Centoro Enterprise', vatRate: 15, currency: 'ZAR' };
  if (!DB.settings.currency) DB.settings.currency = 'ZAR';
  if (!DB.settings.theme) DB.settings.theme = { primary:'#f59e0b', primaryDark:'#d97706', primaryLight:'#fbbf24', accent:'#3b82f6', bgBase:'#0f172a', bgSurface:'#1e293b' };
  if (!DB.masterPrices) DB.masterPrices = [];
  if (!DB.paymentProviders) DB.paymentProviders = [];
  if (!DB.contracts) DB.contracts = [];
  if (!DB.trackingRules) DB.trackingRules = [];
  if (!DB.barcodeIntegrations) DB.barcodeIntegrations = [];
  if (!DB.infrastructure) DB.infrastructure = [];
  if (!DB.pendingApprovals) DB.pendingApprovals = [];
  if (!DB.socialPlatforms) DB.socialPlatforms = [];
  if (!DB.linkedAccounts) DB.linkedAccounts = [];
  if (!DB.companyEmails) DB.companyEmails = [];
  if (!DB.companyContacts) DB.companyContacts = [];
  if (!DB.portRules) DB.portRules = [];
  if (!DB.iamRoles) DB.iamRoles = [];
  if (!DB.staffRoles) DB.staffRoles = {};
  if (!DB.platformKeys) DB.platformKeys = [];
  if (!DB.managedSites) DB.managedSites = [];
  if (!DB.securitySettings) DB.securitySettings = { minPass: 12, sessionTimeout: 30, twoFA: 'required', maxAttempts: 3, stealth: true, ddos: true, ids: true, encrypt: true, honeypot: true, autoban: true };
  if (!DB.securityLog) DB.securityLog = [];
  if (!DB.staffBonuses) DB.staffBonuses = [];
  if (!DB.staffChats) DB.staffChats = [];
  if (!DB.staffGroups) DB.staffGroups = [];
  if (!DB.staffNotifications) DB.staffNotifications = [];
  if (!DB.calendarNotes) DB.calendarNotes = [];
  if (!DB.staffFiles) DB.staffFiles = [];
  if (!DB.staffWarnings) DB.staffWarnings = [];
  if (!DB.google) DB.google = { connected: false, email: '', driveFolders: [] };
  if (!DB.reminders) DB.reminders = [];
  if (!DB.discounts) DB.discounts = [];
  if (!DB.quotes) DB.quotes = [];
  if (!DB.payables) DB.payables = [];
  if (!DB.bankTransactions) DB.bankTransactions = [];
  if (!DB.inventory) DB.inventory = [];
  if (!DB.stockMovements) DB.stockMovements = [];
  if (!DB.journalEntries) DB.journalEntries = [];
  if (!DB.chartAccounts) DB.chartAccounts = [];
  if (!DB.auditTrail) DB.auditTrail = [];
  if (!DB.music) DB.music = { genres: [], tracks: [], packs: [], samples: [] };
  /* AI + Email */
  if (!DB.aiProviders) DB.aiProviders = [];
  if (!DB.aiAutomations) DB.aiAutomations = [];
  if (!DB.emailProviders) DB.emailProviders = [];
  if (!DB.emailTemplates) DB.emailTemplates = [];
  if (!DB.emailCampaigns) DB.emailCampaigns = [];
  /* Email Center */
  if (!DB.emailAccounts) DB.emailAccounts = [];
  if (!DB.emailBranding) DB.emailBranding = { letterhead: null, banner: null, footerContacts: '', footerNote: '', showSocials: {} };
  /* Phone & SMS */
  if (!DB.phoneLines) DB.phoneLines = [];
  if (!DB.smsProviders) DB.smsProviders = [];
  if (!DB.smsCampaigns) DB.smsCampaigns = [];
  if (!DB.phoneBook) DB.phoneBook = [];
  if (!DB.ispPorts) DB.ispPorts = [];
  /* Device Monitoring */
  if (!DB.connectedDevices) DB.connectedDevices = [];
  if (!DB.deviceMonitorSettings) DB.deviceMonitorSettings = { enabled: true, maxSessions: 10, alertOnNewDevice: true };
  /* Network & WiFi */
  if (!DB.networkInterfaces) DB.networkInterfaces = [];
  if (!DB.networkSettings) DB.networkSettings = { preferredNetwork: '', autoConnect: true };
  /* Fraud Detection */
  if (!DB.fraudAlerts) DB.fraudAlerts = [];
  if (!DB.fraudSettings) DB.fraudSettings = { enabled: true, sidelineDetection: true, unauthorizedDeals: true, unusualPatterns: true, sensitivityLevel: 'medium' };
}

/* ===== ADAPTIVE THEMING ===== */
function setThemeVar(root, name, val) { if (val) root.style.setProperty(name, val); else root.style.removeProperty(name); }
function isLightColor(hex) {
  try {
    let c = String(hex).replace('#', '').trim();
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
    if ([r, g, b].some(isNaN)) return false;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
  } catch (e) { return false; }
}
function applyThemeFromSettings() {
  const t = (DB.settings && DB.settings.theme) || {};
  const root = document.documentElement;
  setThemeVar(root, '--primary', t.primary);
  setThemeVar(root, '--primary-dark', t.primaryDark);
  setThemeVar(root, '--primary-light', t.primaryLight);
  setThemeVar(root, '--accent', t.accent);
  setThemeVar(root, '--bg-base', t.bgBase);
  setThemeVar(root, '--bg-surface', t.bgSurface);
  if (t.bgBase && isLightColor(t.bgBase)) {
    root.style.setProperty('--bg-elevated', t.bgElevated || '#f8fafc');
    root.style.setProperty('--bg-input', t.bgInput || '#f8fafc');
    root.style.setProperty('--border', t.border || '#e2e8f0');
    root.style.setProperty('--text-primary', t.textPrimary || '#0f172a');
    root.style.setProperty('--text-secondary', t.textSecondary || '#475569');
    root.style.setProperty('--text-muted', t.textMuted || '#94a3b8');
  } else {
    ['--bg-elevated', '--bg-input', '--border', '--text-primary', '--text-secondary', '--text-muted'].forEach(v => root.style.removeProperty(v));
  }
}

/* ===== ACTIVE CURRENCY ===== */
function getActiveCurrency() {
  const code = (DB.settings && DB.settings.currency) || 'ZAR';
  return (DB.currencies || []).find(c => c.code === code) || { code: 'ZAR', symbol: 'R', ratePerZAR: 1, name: 'South African Rand', base: true };
}

/* ===== IAM PERMISSIONS ===== */
function getUserActionPermissions() {
  const full = { read: true, write: true, delete: true, admin: true, billing: true, security: true, api: true };
  if (!DB.iamRoles || !DB.iamRoles.length) return full;
  if (!DB.staffRoles) return full;
  const user = getCurrentUser();
  const roleName = user && user.staffId ? DB.staffRoles[user.staffId] : null;
  if (!roleName) return full;
  const role = DB.iamRoles.find(r => r.name === roleName);
  if (!role) return full;
  const perms = { read: false, write: false, delete: false, admin: false, billing: false, security: false, api: false };
  (role.permissions || []).forEach(p => { perms[p] = true; });
  return perms;
}
function canRead()   { return !!getUserActionPermissions().read; }
function canWrite()  { return !!getUserActionPermissions().write; }
function canDelete() { return !!getUserActionPermissions().delete; }
function canAdmin()  { return !!getUserActionPermissions().admin; }

/* ===== PRICE SYNC ===== */
function syncPricesFromWebsite() {
  if (!DB.website || !Array.isArray(DB.website.priceList) || !DB.website.priceList.length) return false;
  let changed = false;
  const cur = (DB.settings && DB.settings.currency) || 'ZAR';
  DB.website.priceList.forEach(p => {
    if (!p || !p.service) return;
    const price = Number(p.price) || 0;
    const type = p.type || 'project';
    const category = p.category || 'General';
    if (!DB.masterPrices.some(m => m.name === p.service)) {
      DB.masterPrices.push({ id: nextId('MPR', 'masterPrices'), name: p.service, industry: category, price, currency: cur, type });
      changed = true;
    } else {
      const m = DB.masterPrices.find(x => x.name === p.service);
      if (m.price !== price || m.type !== type) { m.price = price; m.type = type; changed = true; }
    }
    if (!DB.services.some(s => s.name === p.service)) {
      DB.services.push({ id: nextId('SRV', 'services'), name: p.service, price, type, category });
      changed = true;
    } else {
      const s = DB.services.find(x => x.name === p.service);
      if (s.price !== price) { s.price = price; changed = true; }
    }
  });
  return changed;
}

/* ===== JOB CARD NORMALIZATION ===== */
function normalizeJobCards() {
  if (!Array.isArray(DB.jobCards)) return false;
  let changed = false;
  DB.jobCards.forEach(j => {
    if (!j.id) { j.id = nextId('JC', 'jobCards'); changed = true; }
    if (!j.status) { j.status = 'pending'; changed = true; }
    if (!j.priority) { j.priority = 'medium'; changed = true; }
    if (j.hours === undefined || j.hours === null) { j.hours = 1; changed = true; }
    if (!j.loggedBy) { j.loggedBy = 'System'; changed = true; }
    if (j.type === undefined) { j.type = ''; changed = true; }
    if (j.service === undefined) { j.service = ''; changed = true; }
    if (j.description === undefined) { j.description = ''; changed = true; }
    if (j.people === undefined) { j.people = 1; changed = true; }
    if (j.projectId === undefined) { j.projectId = null; changed = true; }
    if (j.clientId === undefined) { j.clientId = null; changed = true; }
    if (j.assigneeId === undefined) { j.assigneeId = null; changed = true; }
  });
  return changed;
}

/* ===== SOCIAL ACCOUNT SYNC ===== */
function syncSocialAccounts() {
  let changed = false;
  (DB.linkedAccounts || []).forEach(a => { if (a.visible === undefined) { a.visible = true; changed = true; } });
  (DB.linkedAccounts || []).forEach(a => {
    const existing = DB.connectedAccounts.find(c => c.sourceLinkedId === a.id);
    if (a.visible) {
      if (!existing) {
        DB.connectedAccounts.push({ id: nextId('CAC', 'connectedAccounts'), sourceLinkedId: a.id, name: a.platform, category: 'Social', handle: a.username || '', status: 'connected', token: '' });
        changed = true;
      } else if (existing.handle !== a.username || existing.status !== 'connected') {
        existing.handle = a.username || ''; existing.status = 'connected'; changed = true;
      }
    } else if (existing && existing.status !== 'not_connected') {
      existing.status = 'not_connected'; changed = true;
    }
  });
  return changed;
}
function toggleSocialAccountVisibility(id) {
  const a = (DB.linkedAccounts || []).find(x => x.id === id);
  if (!a) return;
  a.visible = !a.visible;
  syncSocialAccounts();
  saveDB();
}

/* ===== MEDIA ===== */
function fileToDataUrl(file, cb) { const r = new FileReader(); r.onload = () => cb(r.result); r.readAsDataURL(file); }
function storeMedia(rec, file) { if (!file) return; if (file.size <= 2000000) { fileToDataUrl(file, d => { rec.dataUrl = d; rec.mediaNote = ''; saveDB(); }); } else { window.MEDIA[rec.id] = URL.createObjectURL(file); rec.dataUrl = null; rec.mediaNote = 'session (large file — cloud sync via API)'; saveDB(); } }
function mediaSrc(rec) { return rec && (rec.dataUrl || window.MEDIA[rec.id]) || null; }
let _audio = null, _playingId = null;
function playMedia(id) { const pools = [DB.music.tracks, DB.music.samples, DB.music.packs, DB.fridayDrops]; for (const p of pools) { const r = (p || []).find(x => x.id === id); if (r) { const src = mediaSrc(r); if (src) { if (_playingId === id && _audio) { _audio.pause(); _audio = null; _playingId = null; return; } if (_audio) _audio.pause(); _audio = new Audio(src); _playingId = id; _audio.play(); } return; } } }

/* ===== UTILS ===== */
const fmtZAR = (n) => {
  const cur = getActiveCurrency();
  const base = Number(n) || 0;
  const val = (cur.code === 'ZAR' || cur.base) ? base : base * (Number(cur.ratePerZAR) || 1);
  return (cur.symbol || cur.code || 'R') + ' ' + val.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-ZA') : '—';
const fmtDateDMY = (d) => { if (!d) return '—'; const p = String(d).split('-'); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d; };
function nextId(prefix, collection) { const items = DB[collection] || []; const nums = items.map(i => parseInt(String(i.id).split('-')[1] || 0)).filter(n => !isNaN(n)); const next = nums.length ? Math.max(...nums) + 1 : 1; return `${prefix}-${String(next).padStart(4, '0')}`; }
function getClient(id) { return DB.clients.find(c => c.id === id); }
function getStaff(id) { return DB.staff.find(s => s.id === id); }
function getProject(id) { return DB.projects.find(p => p.id === id); }
function getService(id) { return DB.services.find(s => s.id === id); }
function logActivity(action, icon = 'info', color = 'info') { DB.activity.unshift({ id: nextId('ACT', 'activity'), user: getCurrentUser().name || 'Admin', action, time: 'just now', icon, color }); if (DB.activity.length > 30) DB.activity.pop(); saveDB(); }

/* ===== BIN (IAM-enforced) ===== */
function softDelete(collection, id) {
  if (!canDelete()) { alert('⛔ Your IAM role does not have Delete permission. This action is restricted.'); return false; }
  const arr = DB[collection]; if (!arr) return false; const idx = arr.findIndex(x => x.id === id); if (idx < 0) return false; const [rec] = arr.splice(idx, 1); DB.trash.push({ id: nextId('TRSH', 'trash'), originalId: id, collection, snapshot: rec, deletedAt: new Date().toISOString(), deletedBy: getCurrentUser().name || 'Admin' }); saveDB(); return true;
}
function restoreFromBin(t) { const x = DB.trash.find(y => y.id === t); if (!x) return; (DB[x.collection] = DB[x.collection] || []).push(x.snapshot); DB.trash = DB.trash.filter(y => y.id !== t); saveDB(); }
function permanentDelete(t) {
  if (!canDelete()) { alert('⛔ Your IAM role does not have Delete permission. This action is restricted.'); return; }
  DB.trash = DB.trash.filter(x => x.id !== t); saveDB();
}

/* ===== AUTH ===== */
function initAuth() {
  const token = window.ApiService && typeof window.ApiService.getToken === 'function'
    ? window.ApiService.getToken()
    : localStorage.getItem('centoro_token');
  if (!token && !window.location.pathname.includes('login')) {
    if (window.ApiService && typeof window.ApiService.clearToken === 'function') window.ApiService.clearToken();
    window.location.href = 'login.html';
    return false;
  }
  return true;
}
function login(identifier, password) {
  identifier = (identifier || '').trim().toLowerCase(); password = (password || '').trim();
  if (!identifier || !password) return false;
  const staff = DB.staff.find(s => (s.email && s.email.toLowerCase() === identifier) || (s.username && s.username.toLowerCase() === identifier));
  if (staff) { if (staff.passwordHash !== password) return false; localStorage.setItem('centoro_admin_logged', JSON.stringify({ email: staff.email || staff.username, name: staff.name, role: staff.role, staffId: staff.id, canResetPasswords: !!staff.canResetPasswords, permissions: staff.permissions || Object.fromEntries(ALL_PERMS.map(p => [p, true])) })); return true; }
  if (identifier.includes('@')) { localStorage.setItem('centoro_admin_logged', JSON.stringify({ email: identifier, name: identifier.split('@')[0], role: 'Admin', staffId: null, canResetPasswords: true, permissions: Object.fromEntries(ALL_PERMS.map(p => [p, true])) })); return true; }
  return false;
}
function logout() {
  if (window.ApiService && typeof window.ApiService.clearToken === 'function') window.ApiService.clearToken();
  window.location.href = 'login.html';
}
function getCurrentUser() {
  try {
    const apiUser = window.ApiService && typeof window.ApiService.getUser === 'function' ? window.ApiService.getUser() : null;
    return apiUser || JSON.parse(localStorage.getItem('centoro_admin_logged') || '{}');
  } catch (e) { return {}; }
}

/* ===== VOUCHERS ===== */
function voucherStatus(v) { const t = new Date().toISOString().slice(0, 10); if (v.status === 'expired' || v.expiryDate < t || v.usedCount >= v.maxUses) return 'expired'; return 'active'; }
function validateVoucher(code) { const v = DB.vouchers.find(x => x.code === String(code).toUpperCase()); if (!v) return { ok: false, msg: 'Voucher not found.' }; if (voucherStatus(v) !== 'active') return { ok: false, msg: `Voucher ${v.code} has EXPIRED and can no longer be used.` }; return { ok: true, voucher: v }; }
function markVoucherUsed(id) { const v = DB.vouchers.find(x => x.id === id); if (!v) return; v.usedCount++; if (v.usedCount >= v.maxUses) v.status = 'expired'; saveDB(); }
function blockAccount(id) { const a = DB.portalAccounts.find(x => x.id === id); if (a) { a.status = 'blocked'; saveDB(); } }
function unblockAccount(id) { const a = DB.portalAccounts.find(x => x.id === id); if (a) { a.status = 'active'; saveDB(); } }

/* ===== CASHBOOK ===== */
function getCashBook() { const rows = []; DB.payments.forEach(p => { const inv = DB.invoices.find(i => i.id === p.invoiceId); const c = inv ? getClient(inv.clientId) : null; rows.push({ date: p.date, details: p.reference && p.reference.startsWith('PAYROLL') ? `Payroll: ${p.reference}` : `Receipt: #${inv ? inv.trackingNumber : '—'} (${c ? c.name : 'Cash sale'})`, ref: p.reference || p.method, inAmt: p.amount, outAmt: 0, kind: 'receipt', linkId: p.invoiceId }); }); DB.expenses.filter(e => e.status === 'approved').forEach(e => rows.push({ date: e.date, details: `Payment: ${e.vendor} — ${e.description}`, ref: e.category, inAmt: 0, outAmt: e.amount, kind: 'expense', linkId: e.id })); rows.sort((a, b) => a.date.localeCompare(b.date)); let bal = 0; return rows.map(r => { bal += r.inAmt - r.outAmt; return { ...r, balance: bal }; }); }
function convertCurrency(a, code) { const c = DB.currencies.find(x => x.code === code); return c ? a * c.ratePerZAR : a; }
function fmtCurrency(a, code) { const c = DB.currencies.find(x => x.code === code) || DB.currencies[0]; return (c.symbol || c.code || 'R') + ' ' + convertCurrency(a, code).toLocaleString('en-ZA', { minimumFractionDigits: 2 }); }
function refreshCurrencyRates() { alert('Currency API will auto-refresh with your Spring Boot backend.'); }
function calcDepreciation(cost, salvage, lifeYears, purchaseDate) { cost = Number(cost) || 0; salvage = Number(salvage) || 0; lifeYears = Number(lifeYears) || 1; const annual = (cost - salvage) / lifeYears; const months = Math.max(0, (Date.now() - new Date(purchaseDate).getTime()) / 2629746000); const accumulated = Math.min(cost - salvage, annual * (months / 12)); const book = Math.max(salvage, cost - accumulated); return { annual, monthly: annual / 12, accumulated, book, pct: cost > 0 ? Math.round(((cost - book) / cost) * 100) : 0 }; }
function getDueAlerts() { const today = new Date(); const out = []; DB.invoices.forEach(i => { if (i.status === 'paid') return; const days = Math.floor((new Date(i.dueDate) - today) / 86400000); if (days < 0) out.push({ invoice: i, days, level: 'overdue' }); else if (days <= 7) out.push({ invoice: i, days, level: 'due-soon' }); }); return out.sort((a, b) => a.days - b.days); }
function getBadPayers() { return DB.clients.map(c => { const invs = DB.invoices.filter(i => i.clientId === c.id); const overdue = invs.filter(i => i.status === 'overdue' || (i.status !== 'paid' && new Date(i.dueDate) < new Date())); const partial = invs.filter(i => i.status === 'partial'); const score = overdue.length * 2 + partial.length; return { client: c, overdueCount: overdue.length, partialCount: partial.length, owed: overdue.reduce((s, i) => s + (i.total - i.paid), 0), score, risk: score >= 3 ? 'high' : score >= 1 ? 'medium' : 'low' }; }).filter(x => x.score > 0).sort((a, b) => b.score - a.score); }

/* ===== EXPORTS ===== */
function downloadFile(name, content, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); }
function monthlyRevenue() { const m = {}; DB.payments.forEach(p => { const k = p.date.slice(0, 7); m[k] = (m[k] || 0) + p.amount; }); return m; }
function exportStatsCSV() { let csv = 'CENTORO ENTERPRISE — BUSINESS REPORT\nGenerated,' + new Date().toLocaleString('en-ZA') + '\n\nVisitors,' + DB.website.stats.visitors + '\nDownloads,' + DB.website.stats.downloads + '\nRevenue (R),' + DB.payments.reduce((s, p) => s + p.amount, 0) + '\n'; downloadFile('centoro-report.csv', csv, 'text/csv'); }
function exportBackupJSON() { downloadFile('centoro-backup.json', JSON.stringify(DB, null, 2), 'application/json'); }

/* ===== SIDEBAR ===== */
function renderSidebar(activePage) {
  const nav = document.getElementById('sidebar-nav'); if (!nav) return;
  const user = getCurrentUser(); const perms = user.permissions || Object.fromEntries(ALL_PERMS.map(p => [p, true]));
  const items = [
    { group: 'Main', items: [{ id: 'index.html', icon: 'layout', label: 'Dashboard', perm: 'dashboard' }] },
    { group: 'Operations', items: [ { id: 'projects.html', icon: 'briefcase', label: 'Projects', perm: 'projects' }, { id: 'jobcards.html', icon: 'clipboard', label: 'Job Cards', perm: 'jobcards' }, { id: 'invoices.html', icon: 'file-text', label: 'Invoices', perm: 'invoices' }, { id: 'accounting.html', icon: 'trending-up', label: 'Accounting', perm: 'accounting' }, { id: 'vouchers.html', icon: 'gift', label: 'Vouchers', perm: 'vouchers' } ] },
    { group: 'CRM & People', items: [ { id: 'clients.html', icon: 'users', label: 'Clients', perm: 'clients' }, { id: 'staff.html', icon: 'user-check', label: 'Staff', perm: 'staff' }, { id: 'payroll.html', icon: 'dollar-sign', label: 'Payroll', perm: 'payroll' }, { id: 'chats.html', icon: 'message-square', label: 'Client Chats', perm: 'chats' }, { id: 'staff-chat.html', icon: 'message-circle', label: 'Staff Chat', perm: 'staffchat' }, { id: 'email.html', icon: 'mail', label: 'Email Center', perm: 'email' }, { id: 'phone.html', icon: 'phone', label: 'Phone & SMS', perm: 'phone' } ] },
    { group: 'Assets & Content', items: [ { id: 'assets.html', icon: 'package', label: 'Assets', perm: 'assets' }, { id: 'website.html', icon: 'globe', label: 'Website', perm: 'website' }, { id: 'website-builder.html', icon: 'code', label: 'Website Builder', perm: 'website' } ] },
    { group: 'System', items: [ { id: 'data.html', icon: 'bar-chart-2', label: 'Data & Reports', perm: 'data' }, { id: 'settings.html', icon: 'settings', label: 'Settings', perm: 'settings' }, { id: 'bin.html', icon: 'trash-2', label: 'Bin', perm: 'bin' } ] },
  ];
  nav.innerHTML = items.map(g => { const vis = g.items.filter(it => !user.staffId || perms[it.perm]); if (!vis.length) return ''; return `<div class="nav-group"><div class="nav-group-title">${g.group}</div>${vis.map(it => `<a href="${it.id}" class="nav-item ${activePage === it.id ? 'active' : ''}"><i data-feather="${it.icon}"></i><span class="label">${it.label}</span></a>`).join('')}</div>`; }).join('');
  const u = document.getElementById('sidebar-user');
  if (u && user.name) { const ini = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); u.innerHTML = `<div class="user-avatar">${ini}</div><div class="user-info"><div class="name">${user.name}</div><div class="role">${user.role || 'Admin'}</div></div>`; }
  if (window.feather) feather.replace();
}
function renderTopbar(t) { const e = document.getElementById('topbar-title'); if (e) e.textContent = t; const u = getCurrentUser(); const a = document.getElementById('topbar-avatar'); if (a) a.textContent = (u.name || 'AD').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); }
function initApp(pageName, pageTitle) {
  const layout = document.querySelector('.app-layout');
  if (!initAuth()) return;
  applyThemeFromSettings();
  renderSidebar(pageName);
  renderTopbar(pageTitle);
  const c = document.getElementById('collapse-btn'); const l = document.querySelector('.app-layout'); if (c && l) c.addEventListener('click', () => l.classList.toggle('collapsed'));
  const o = document.getElementById('logout-btn'); if (o) o.addEventListener('click', logout);
  if (layout) layout.classList.add('app-ready');
  if (window.ApiService && typeof ApiService.syncAdminData === 'function') {
    ApiService.syncAdminData(pageName, DB).then(() => {
      applyThemeFromSettings();
      ['renderAll', 'renderProjects', 'renderClients', 'renderStaff', 'renderAssets', 'renderInvoices', 'renderJobCards', 'renderChats', 'renderVouchers', 'renderWebsite', 'renderPages', 'renderSettings', 'renderData', 'renderEmail', 'renderPhone', 'renderStaffChats', 'renderBin'].forEach(name => {
        if (typeof window[name] === 'function') window[name]();
      });
      document.dispatchEvent(new CustomEvent('centoro:data-ready', { detail: { pageName } }));
    }).catch(error => {
      console.error('Unable to load page data from API:', error);
      if (layout) layout.classList.add('app-ready');
      const main = document.querySelector('main');
      if (main && !main.querySelector('.api-connection-error')) {
        const notice = document.createElement('div');
        notice.className = 'api-connection-error';
        notice.textContent = 'The API is unavailable. Start the API and refresh this page.';
        notice.style.cssText = 'margin:16px;padding:12px;border:1px solid #ef4444;color:#ef4444;border-radius:6px;';
        main.prepend(notice);
      }
    });
  }
}

function calcPAYE(m) { const a = m * 12; let t = 0; if (a <= 237100) t = a * 0.18; else if (a <= 370500) t = 42678 + (a - 237100) * 0.26; else if (a <= 512800) t = 77362 + (a - 370500) * 0.31; else if (a <= 673000) t = 121475 + (a - 512800) * 0.36; else if (a <= 857900) t = 179147 + (a - 673000) * 0.39; else if (a <= 1817000) t = 251258 + (a - 857900) * 0.41; else t = 645489 + (a - 1817000) * 0.45; return Math.max(0, (t - 17235) / 12); }
function calcUIF(g) { return Math.min(g * 0.01, 177.12); }
function renderQR(text) { if (typeof qrcode === 'undefined') return ''; const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createImgTag(3, 8); }
function generateTrackingNumber(clientId, issueDate) { const c = getClient(clientId); if (!c) return 'XX00-' + fmtDateDMY(issueDate); return `${(c.code || 'XX').toUpperCase()}${String(DB.invoices.filter(i => i.clientId === c.id).length + 1).padStart(2, '0')}-${fmtDateDMY(issueDate)}`; }
function generateClientCode(n) { const p = n.trim().split(/\s+/); if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase(); return p[0].slice(0, 2).toUpperCase(); }

/* ===== BOOTSTRAP ===== */
function bootstrapPlatform() {
  ensureCollections();
  applyThemeFromSettings();
  const changedPrices = syncPricesFromWebsite();
  const changedJobs = normalizeJobCards();
  const changedSocial = syncSocialAccounts();
  if (changedPrices || changedJobs || changedSocial) saveDB();
}
bootstrapPlatform();

window.Centoro = {
  DB, saveDB, nextId, fmtZAR, fmtDate, fmtDateDMY, getClient, getStaff, getProject, getService, logActivity,
  initApp, login, logout, getCurrentUser, calcPAYE, calcUIF, renderQR, generateTrackingNumber, generateClientCode,
  softDelete, restoreFromBin, permanentDelete, voucherStatus, validateVoucher, markVoucherUsed, blockAccount, unblockAccount,
  getCashBook, convertCurrency, fmtCurrency, refreshCurrencyRates, calcDepreciation, getDueAlerts, getBadPayers,
  fileToDataUrl, storeMedia, mediaSrc, playMedia, downloadFile, exportStatsCSV, exportBackupJSON, monthlyRevenue,
  ALL_PERMS, PERM_LABELS,
  getActiveCurrency, applyThemeFromSettings, ensureCollections, isLightColor,
  getUserActionPermissions, canRead, canWrite, canDelete, canAdmin,
  syncPricesFromWebsite, normalizeJobCards, syncSocialAccounts, toggleSocialAccountVisibility,
  bootstrapPlatform
};
