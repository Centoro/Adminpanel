/**
 * CENTORO ENTERPRISE - API CLIENT v2.0
 * Complete version with all API methods + Defensive Error Handling
 */
const API_BASE_URL = 'https://api-28ym.onrender.com/api';

class CentoroApiService {
    constructor() {
        this.token = localStorage.getItem('centoro_token');
        this.user = null;
        this.snapshots = new WeakMap();
        this.persistQueue = Promise.resolve();
        const savedUser = localStorage.getItem('centoro_user');
        if (savedUser) {
            try { this.user = JSON.parse(savedUser); } catch (e) { this.user = null; }
        }
    }

    setToken(token) {
        this.token = token;
        if (token) localStorage.setItem('centoro_token', token);
        else localStorage.removeItem('centoro_token');
    }

    getToken() {
        if (!this.token) this.token = localStorage.getItem('centoro_token');
        return this.token;
    }

    setUser(user) {
        this.user = user;
        if (user) localStorage.setItem('centoro_user', JSON.stringify(user));
        else localStorage.removeItem('centoro_user');
    }

    getUser() {
        if (!this.user) {
            const saved = localStorage.getItem('centoro_user');
            if (saved) { try { this.user = JSON.parse(saved); } catch (e) { this.user = null; } }
        }
        return this.user;
    }

    clearToken() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('centoro_token');
        localStorage.removeItem('centoro_user');
        localStorage.removeItem('centoro_admin_logged');
    }

    isAuthenticated() { return !!this.getToken(); }

    async request(method, endpoint, data = null, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getToken();
        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json', ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const controller = new AbortController();
        const timeoutMs = 300000; // 5 minutes for Render wake-up
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        
        const config = { method, headers, ...options, signal: controller.signal };
        delete config.timeout;
        if (data) {
            if (data instanceof FormData) { delete headers['Content-Type']; config.body = data; }
            else { config.body = JSON.stringify(data); }
        }
        try {
            const response = await fetch(url, config);
            if (response.status === 401 && endpoint !== '/auth/login') {
                this.clearToken();
                if (!window.location.pathname.includes('login.html')) window.location.replace('login.html');
                throw new Error('Session expired. Please login again.');
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const json = await response.json();
                if (!response.ok) throw new Error(json.message || `HTTP Error ${response.status}`);
                return json;
            }
            if (!response.ok) throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            return response;
        } catch (error) {
            if (error.name === 'AbortError') throw new Error(`API request timed out: ${endpoint}`);
            console.error('API Request Failed:', error.message);
            throw error;
        } finally { clearTimeout(timeout); }
    }

    unwrap(response) {
        return response && Object.prototype.hasOwnProperty.call(response, 'data') ? response.data : response;
    }

    async syncAdminData(pageName, target) {
        const common = {
            clients: () => this.getClients(), staff: () => this.getStaff(), projects: () => this.getProjects(),
            jobCards: () => this.getJobCards(), invoices: () => this.getInvoices(), assets: () => this.getAssets(),
            chats: () => this.getChats(), vouchers: () => this.getVouchers(), settings: () => this.getCompanySettings(),
            websiteStats: () => this.getWebsiteStats(), websiteNews: () => this.getWebsiteNews(), slides: () => this.getSlides(),
            pages: () => this.getWebsitePages(), prices: () => this.getPrices(), tracks: () => this.getTracks(),
            packs: () => this.getPacks(), samples: () => this.getSamples(), fridayDrops: () => this.getFridayDrops(),
            monthlyOffers: () => this.getMonthlyOffers(), portfolio: () => this.getPortfolio(), expenses: () => this.getExpenses(),
            payments: () => this.getPayments(), payroll: () => this.getPayroll(new Date().toISOString().slice(0, 7)),
            bankTransactions: () => this.getBankTransactions(), journalEntries: () => this.getJournalEntries(),
            chartAccounts: () => this.getChartAccounts(), inventory: () => this.getInventory(),
            emailAccounts: () => this.getEmailAccounts(), phoneLines: () => this.getPhoneLines(),
            phoneContacts: () => this.getPhoneContacts(), emailCampaigns: () => this.getEmailCampaigns(),
            smsProviders: () => this.getSmsProviders(), smsCampaigns: () => this.getSmsCampaigns(),
            staffChats: () => this.getStaffChats(), bin: () => this.getBinItems(), analytics: () => this.getAnalytics(),
            currencyRates: () => this.getCurrencyRates(), timezones: () => this.getTimezones(), calendarNotes: () => this.getCalendarNotes()
        };

        const pageCollections = {
            'index.html': ['clients', 'staff', 'projects', 'jobCards', 'invoices', 'chats', 'vouchers', 'currencyRates', 'timezones', 'calendarNotes'],
            'projects.html': ['clients', 'projects', 'staff', 'jobCards'],
            'clients.html': ['clients', 'projects', 'invoices'],
            'staff.html': ['staff', 'projects'],
            'assets.html': ['assets', 'staff'],
            'invoices.html': ['invoices', 'clients', 'projects', 'payments'],
            'jobcards.html': ['jobCards', 'clients', 'projects', 'staff'],
            'chats.html': ['chats', 'clients'],
            'vouchers.html': ['vouchers'],
            'accounting.html': ['expenses', 'payments', 'invoices', 'bankTransactions', 'journalEntries', 'chartAccounts'],
            'payroll.html': ['payroll', 'staff'],
            'website.html': ['websiteStats', 'websiteNews', 'slides', 'prices', 'tracks', 'packs', 'samples', 'fridayDrops', 'monthlyOffers', 'portfolio'],
            'website-builder.html': ['pages', 'slides', 'websiteNews', 'prices'],
            'settings.html': ['settings'],
            'data.html': ['analytics', 'invoices', 'projects', 'clients'],
            'email.html': ['emailAccounts', 'emailCampaigns'],
            'phone.html': ['phoneLines', 'phoneContacts', 'smsProviders', 'smsCampaigns'],
            'staff-chat.html': ['staffChats', 'staff'],
            'bin.html': ['bin']
        };

        const collections = pageCollections[pageName] || [];
        
        const results = await Promise.allSettled(collections.map(name => {
            const fn = common[name];
            if (typeof fn !== 'function') {
                console.warn(`[syncAdminData] Missing API getter for "${name}" — skipping.`);
                return Promise.resolve({ success: true, data: [] });
            }
            try { return Promise.resolve(fn()); } 
            catch (e) { return Promise.reject(e); }
        }));

        const failures = results.map((result, index) => ({ result, name: collections[index] })).filter(entry => entry.result.status === 'rejected');
        if (failures.length) {
            const details = failures.map(entry => `${entry.name}: ${entry.result.reason.message}`).join('; ');
            throw new Error(`Unable to load required API data for ${pageName}. ${details}`);
        }

        results.forEach((result, index) => {
            const name = collections[index];
            const value = this.unwrap(result.value);
            if (name === 'settings') target.settings = { ...(target.settings || {}), ...(value || {}) };
            else if (name === 'websiteStats') target.website = { ...(target.website || {}), stats: value };
            else if (name === 'websiteNews') target.website = { ...(target.website || {}), news: (value || []).map(item => ({ ...item, id: String(item.id), dataUrl: item.imageUrl })) };
            else if (name === 'slides') target.website = { ...(target.website || {}), slides: (value || []).map(item => ({ ...item, id: String(item.id), desktop: item.desktopUrl, tablet: item.tabletUrl, phone: item.phoneUrl })) };
            else if (name === 'pages') target.websitePages = value || [];
            else if (name === 'prices') target.website = { ...(target.website || {}), priceList: value || [] };
            else if (name === 'tracks') target.music = { ...(target.music || {}), tracks: (value || []).map(item => ({ ...item, id: String(item.id), lease: item.leasePrice, royaltyFree: item.royaltyFreePrice, exclusive: item.exclusivePrice, cover: item.coverUrl, dataUrl: item.audioUrl })) };
            else if (name === 'packs') target.music = { ...(target.music || {}), packs: (value || []).map(item => ({ ...item, id: String(item.id), lease: item.leasePrice, exclusive: item.exclusivePrice, cover: item.coverUrl, dataUrl: item.audioUrl, sampleList: typeof item.sampleList === 'string' ? JSON.parse(item.sampleList || '[]') : (item.sampleList || []) })) };
            else if (name === 'samples') target.music = { ...(target.music || {}), samples: (value || []).map(item => ({ ...item, id: String(item.id), cover: item.coverUrl, dataUrl: item.audioUrl })) };
            else if (name === 'fridayDrops') target.fridayDrops = (value || []).map(item => ({ ...item, id: String(item.id), cover: item.coverUrl, dataUrl: item.audioUrl }));
            else if (name === 'monthlyOffers') target.monthlyOffers = (value || []).map(item => ({ ...item, id: String(item.id), cover: item.coverUrl, dataUrl: item.audioUrl }));
            else if (name === 'portfolio') target.works = (value || []).map(item => ({ ...item, id: String(item.id), sub: item.subcategory, dataUrl: item.imageUrl }));
            else if (name === 'staffChats') target.staffChats = value || [];
            else if (name === 'phoneContacts') target.phoneBook = value || [];
            else if (name === 'currencyRates') target.currencies = this.formatCurrencyRates(result.value.value || result.value);
            else if (name === 'timezones') target.timezones = value;
            else if (name === 'calendarNotes') target.calendarNotes = (value || []).map(note => ({ ...note, id: String(note.id), date: String(note.date).slice(0, 10) }));
            else target[name] = value || [];
        });
        this.snapshots.set(target, JSON.parse(JSON.stringify(target)));
        return { failures: 0, loaded: collections.length };
    }

    formatCurrencyRates(response) {
        if (!response || !response.data || !response.data.rates) return [];
        const rates = response.data.rates;
        return Object.keys(rates).map(code => ({ code, name: code, symbol: code, ratePerZAR: Number(rates[code]) || 0, base: code === response.data.base }));
    }

    // ==========================================
    // CORE GETTERS
    // ==========================================
    async getClients() { return this.request('GET', '/clients'); }
    async getStaff() { return this.request('GET', '/staff'); }
    async getProjects() { return this.request('GET', '/projects'); }
    async getJobCards() { return this.request('GET', '/job-cards'); }
    async getInvoices() { return this.request('GET', '/invoices'); }
    async getChats() { return this.request('GET', '/chats'); }
    async getVouchers() { return this.request('GET', '/vouchers'); }
    async getAssets() { return this.request('GET', '/assets'); }
    
    async getCurrencyRates() { return this.request('GET', '/accounting/currency-rates'); }
    async getTimezones() { return this.request('GET', '/timezones'); }
    async getCalendarNotes() { return this.request('GET', '/calendar-notes'); }
    async getCompanySettings() { return this.request('GET', '/settings'); }
    async getAnalytics() { return this.request('GET', '/analytics'); }
    
    async getWebsiteStats() { return this.request('GET', '/website/stats'); }
    async getWebsiteNews() { return this.request('GET', '/website/news'); }
    async getSlides() { return this.request('GET', '/website/slides'); }
    async getWebsitePages() { return this.request('GET', '/website/pages'); }
    async getPrices() { return this.request('GET', '/website/prices'); }
    async getPortfolio() { return this.request('GET', '/content/portfolio'); }
    
    async getExpenses() { return this.request('GET', '/accounting/expenses'); }
    async getPayments() { return this.request('GET', '/accounting/payments'); }
    async getPayroll(month) { return this.request('GET', `/payroll?month=${month}`); }
    async getBankTransactions() { return this.request('GET', '/accounting/bank-transactions'); }
    async getJournalEntries() { return this.request('GET', '/accounting/journal-entries'); }
    async getChartAccounts() { return this.request('GET', '/accounting/chart-accounts'); }
    
    async getInventory() { return this.request('GET', '/inventory'); }
    async getEmailAccounts() { return this.request('GET', '/email/accounts'); }
    async getPhoneLines() { return this.request('GET', '/phone/lines'); }
    async getPhoneContacts() { return this.request('GET', '/phone/contacts'); }
    async getEmailCampaigns() { return this.request('GET', '/email/campaigns'); }
    async getSmsProviders() { return this.request('GET', '/sms/providers'); }
    async getSmsCampaigns() { return this.request('GET', '/sms/campaigns'); }
    async getStaffChats() { return this.request('GET', '/staff-chats'); }
    async getBinItems() { return this.request('GET', '/bin'); }

    // ==========================================
    // MUSIC & CONTENT
    // ==========================================
    async getTracks() { return this.request('GET', '/music/tracks'); }
    async getPacks() { return this.request('GET', '/music/packs'); }
    async getSamples() { return this.request('GET', '/music/samples'); }
    async getFridayDrops() { return this.request('GET', '/friday-drops'); }
    async getMonthlyOffers() { return this.request('GET', '/monthly-offers'); }

    // ==========================================
    // CRUD OPERATIONS
    // ==========================================
    async createClient(data) { return this.request('POST', '/clients', data); }
    async updateClient(id, data) { return this.request('PUT', `/clients/${id}`, data); }
    async deleteClient(id) { return this.request('DELETE', `/clients/${id}`); }

    async createProject(data) { return this.request('POST', '/projects', data); }
    async updateProject(id, data) { return this.request('PUT', `/projects/${id}`, data); }
    async deleteProject(id) { return this.request('DELETE', `/projects/${id}`); }

    async createJobCard(data) { return this.request('POST', '/job-cards', data); }
    async updateJobCard(id, data) { return this.request('PUT', `/job-cards/${id}`, data); }
    async deleteJobCard(id) { return this.request('DELETE', `/job-cards/${id}`); }

    async createCalendarNote(data) { return this.request('POST', '/calendar-notes', data); }
    async updateCalendarNote(id, data) { return this.request('PUT', `/calendar-notes/${id}`, data); }
    async deleteCalendarNote(id) { return this.request('DELETE', `/calendar-notes/${id}`); }

    async createInvoice(data) { return this.request('POST', '/invoices', data); }
    async updateInvoice(id, data) { return this.request('PUT', `/invoices/${id}`, data); }
    async deleteInvoice(id) { return this.request('DELETE', `/invoices/${id}`); }

    async createChat(data) { return this.request('POST', '/chats', data); }
    async updateChat(id, data) { return this.request('PUT', `/chats/${id}`, data); }
    
    async createStaff(data) { return this.request('POST', '/staff', data); }
    async updateStaff(id, data) { return this.request('PUT', `/staff/${id}`, data); }
    async deleteStaff(id) { return this.request('DELETE', `/staff/${id}`); }

    // ==========================================
    // AUTH METHODS
    // ==========================================
    async login(credentials) {
        const response = await this.request('POST', '/auth/login', credentials);
        if (response.data && response.data.token) {
            this.setToken(response.data.token);
            this.setUser(response.data.user);
        }
        return response;
    }

    logout() {
        this.clearToken();
        window.location.replace('login.html');
    }
}

window.ApiService = new CentoroApiService();
