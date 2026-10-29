/**
 * CENTORO ENTERPRISE - API CLIENT
 * Complete version with all API methods
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

    isAuthenticated() {
        return !!this.getToken();
    }

    async request(method, endpoint, data = null, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getToken();
        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json', ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const controller = new AbortController();
        
        // FIX 1: Give login 120 seconds, and all other requests 60 seconds to allow Render to wake up from sleep
        const timeoutMs = endpoint === '/auth/login' ? 120000 : 60000;
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        
        const config = { method, headers, ...options, signal: controller.signal };
        delete config.timeout;
        if (data) {
            if (data instanceof FormData) { delete headers['Content-Type']; config.body = data; }
            else { config.body = JSON.stringify(data); }
        }
        try {
            const response = await fetch(url, config);
            
            // FIX 2: Do NOT show "Session expired" if the user is actively trying to log in
            if (response.status === 401 && endpoint !== '/auth/login') {
                this.clearToken();
                if (!window.location.pathname.includes('login.html')) {
                    window.location.replace('login.html');
                }
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
            clients: () => this.getClients(),
            staff: () => this.getStaff(),
            projects: () => this.getProjects(),
            jobCards: () => this.getJobCards(),
            invoices: () => this.getInvoices(),
            assets: () => this.getAssets(),
            chats: () => this.getChats(),
            vouchers: () => this.getVouchers(),
            settings: () => this.getCompanySettings(),
            websiteStats: () => this.getWebsiteStats(),
            websiteNews: () => this.getWebsiteNews(),
            slides: () => this.getSlides(),
            pages: () => this.getWebsitePages(),
            prices: () => this.getPrices(),
            tracks: () => this.getTracks(),
            packs: () => this.getPacks(),
            samples: () => this.getSamples(),
            fridayDrops: () => this.getFridayDrops(),
            monthlyOffers: () => this.getMonthlyOffers(),
            portfolio: () => this.getPortfolio(),
            contracts: () => this.getContracts(),
            expenses: () => this.getExpenses(),
            payments: () => this.getPayments(),
            payroll: () => this.getPayroll(new Date().toISOString().slice(0, 7)),
            bankTransactions: () => this.getBankTransactions(),
            journalEntries: () => this.getJournalEntries(),
            chartAccounts: () => this.getChartAccounts(),
            inventory: () => this.getInventory(),
            emailAccounts: () => this.getEmailAccounts(),
            phoneLines: () => this.getPhoneLines(),
            phoneContacts: () => this.getPhoneContacts(),
            emailCampaigns: () => this.getEmailCampaigns(),
            smsProviders: () => this.getSmsProviders(),
            smsCampaigns: () => this.getSmsCampaigns(),
            staffChats: () => this.getStaffChats(),
            bin: () => this.getBinItems(),
            analytics: () => this.getAnalytics()
        };

        const pageCollections = {
            'index.html': ['clients', 'staff', 'projects', 'jobCards', 'invoices', 'chats', 'vouchers'],
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
        const results = await Promise.allSettled(collections.map(name => common[name]()));
        const failures = results
            .map((result, index) => ({ result, name: collections[index] }))
            .filter(entry => entry.result.status === 'rejected');
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
            else target[name] = value || [];
        });
        this.snapshots.set(target, JSON.parse(JSON.stringify(target)));
        return { failures: 0, loaded: collections.length };
    }

    persistAdminData(target) {
        this.persistQueue = this.persistQueue
            .catch(() => undefined)
            .then(() => this.persistAdminDataNow(target));
        return this.persistQueue;
    }

    async persistAdminDataNow(target) {
        const previous = this.snapshots.get(target);
        if (!previous) return;
        const resources = {
            clients: ['createClient', 'updateClient', 'deleteClient'],
            staff: ['createStaff', 'updateStaff', 'deleteStaff'],
            projects: ['createProject', 'updateProject', 'deleteProject'],
            jobCards: ['createJobCard', 'updateJobCard', 'deleteJobCard'],
            invoices: ['createInvoice', 'updateInvoice', 'deleteInvoice'],
            assets: ['createAsset', 'updateAsset', 'deleteAsset'],
            vouchers: ['createVoucher', 'updateVoucher', 'deleteVoucher'],
            expenses: ['createExpense', 'updateExpense', 'deleteExpense'],
            payments: ['createPayment', null, 'deletePayment'],
            inventory: ['createInventoryItem', 'updateInventoryItem', 'deleteInventoryItem'],
            journalEntries: ['createJournalEntry', 'updateJournalEntry', 'deleteJournalEntry'],
            chartAccounts: ['createChartAccount', 'updateChartAccount', 'deleteChartAccount'],
            contracts: ['createContract', 'updateContract', 'deleteContract'],
            websitePages: ['createWebsitePage', 'updateWebsitePage', 'deleteWebsitePage'],
            emailAccounts: ['connectEmailAccount', null, 'disconnectEmailAccount'],
            phoneLines: ['createPhoneLine', null, 'deletePhoneLine'],
            smsProviders: ['createSmsProvider', null, 'deleteSmsProvider'],
            phoneBook: ['createPhoneContact', 'updatePhoneContact', 'deletePhoneContact'],
            staffChats: ['createStaffChat', null, 'deleteStaffChat']
        };
        const jobs = [];
        const queueCollectionDiff = (before, after, methods, toPayload = item => item) => {
            const beforeById = new Map(before.map(item => [String(item.id), item]));
            const afterById = new Map(after.map(item => [String(item.id), item]));
            after.forEach(item => {
                const old = beforeById.get(String(item.id));
                const payload = toPayload(item);
                if (!old && methods[0]) {
                    jobs.push(this[methods[0]](payload).then(response => {
                        const saved = this.unwrap(response);
                        if (saved && saved.id != null) item.id = String(saved.id);
                    }));
                } else if (old && JSON.stringify(old) !== JSON.stringify(item) && methods[1]) {
                    jobs.push(this[methods[1]](Number(item.id) || item.id, payload));
                }
            });
            before.forEach(item => {
                if (!afterById.has(String(item.id)) && methods[2]) jobs.push(this[methods[2]](Number(item.id) || item.id));
            });
        };
        Object.entries(resources).forEach(([collection, methods]) => {
            const before = Array.isArray(previous[collection]) ? previous[collection] : [];
            const after = Array.isArray(target[collection]) ? target[collection] : [];
            const beforeById = new Map(before.map(item => [String(item.id), item]));
            const afterById = new Map(after.map(item => [String(item.id), item]));
            after.forEach(item => {
                const old = beforeById.get(String(item.id));
                const payload = { ...item };
                delete payload.id;
                if (!old && methods[0]) jobs.push(this[methods[0]](payload));
                else if (old && JSON.stringify(old) !== JSON.stringify(item) && methods[1]) jobs.push(this[methods[1]](Number(item.id) || item.id, payload));
            });
            before.forEach(item => {
                if (!afterById.has(String(item.id)) && methods[2]) jobs.push(this[methods[2]](Number(item.id) || item.id));
            });
        });
        const priorMusic = previous.music || {};
        const currentMusic = target.music || {};
        const withoutId = item => { const payload = { ...item }; delete payload.id; return payload; };
        queueCollectionDiff(priorMusic.tracks || [], currentMusic.tracks || [], ['createTrack', 'updateTrack', 'deleteTrack'], item => {
            const payload = withoutId(item);
            payload.leasePrice = item.lease;
            payload.royaltyFreePrice = item.royaltyFree;
            payload.exclusivePrice = item.exclusive;
            payload.coverUrl = item.cover;
            payload.audioUrl = item.audioUrl || item.dataUrl;
            delete payload.lease; delete payload.royaltyFree; delete payload.exclusive; delete payload.cover; delete payload.dataUrl;
            return payload;
        });
        queueCollectionDiff(priorMusic.packs || [], currentMusic.packs || [], ['createPack', 'updatePack', 'deletePack'], item => {
            const payload = withoutId(item);
            payload.leasePrice = item.lease;
            payload.exclusivePrice = item.exclusive;
            payload.coverUrl = item.cover;
            payload.audioUrl = item.audioUrl || item.dataUrl;
            payload.sampleList = JSON.stringify(item.sampleList || []);
            delete payload.lease; delete payload.exclusive; delete payload.cover; delete payload.dataUrl;
            return payload;
        });
        queueCollectionDiff(priorMusic.samples || [], currentMusic.samples || [], ['createSample', 'updateSample', 'deleteSample'], item => {
            const payload = withoutId(item);
            payload.coverUrl = item.cover;
            payload.audioUrl = item.audioUrl || item.dataUrl;
            delete payload.cover; delete payload.dataUrl;
            return payload;
        });
        queueCollectionDiff(previous.fridayDrops || [], target.fridayDrops || [], ['createFridayDrop', 'updateFridayDrop', 'deleteFridayDrop'], item => {
            const payload = withoutId(item); payload.coverUrl = item.cover; payload.audioUrl = item.audioUrl || item.dataUrl; delete payload.cover; delete payload.dataUrl; return payload;
        });
        queueCollectionDiff(previous.monthlyOffers || [], target.monthlyOffers || [], ['createMonthlyOffer', 'updateMonthlyOffer', 'deleteMonthlyOffer'], item => {
            const payload = withoutId(item); payload.coverUrl = item.cover; payload.audioUrl = item.audioUrl || item.dataUrl; delete payload.cover; delete payload.dataUrl; return payload;
        });
        const previousWebsite = previous.website || {};
        const targetWebsite = target.website || {};
        queueCollectionDiff(previousWebsite.news || [], targetWebsite.news || [], ['createNews', 'updateNews', 'deleteNews'], item => {
            const payload = withoutId(item); payload.imageUrl = item.imageUrl || item.dataUrl; delete payload.dataUrl; return payload;
        });
        queueCollectionDiff(previousWebsite.slides || [], targetWebsite.slides || [], ['createSlide', 'updateSlide', 'deleteSlide'], item => {
            const payload = withoutId(item); payload.desktopUrl = item.desktopUrl || item.desktop; payload.tabletUrl = item.tabletUrl || item.tablet; payload.phoneUrl = item.phoneUrl || item.phone; delete payload.desktop; delete payload.tablet; delete payload.phone; return payload;
        });
        queueCollectionDiff(previous.works || [], target.works || [], ['createPortfolioItem', 'updatePortfolioItem', 'deletePortfolioItem'], item => {
            const payload = withoutId(item); payload.subcategory = item.subcategory || item.sub; payload.imageUrl = item.imageUrl || item.dataUrl; delete payload.sub; delete payload.dataUrl; return payload;
        });
        if (target.settings && JSON.stringify(target.settings) !== JSON.stringify(previous.settings) && this.updateCompanySettings) {
            jobs.push(this.updateCompanySettings(target.settings));
        }
        const results = await Promise.allSettled(jobs);
        const failures = results.filter(result => result.status === 'rejected');
        if (failures.length) throw failures[0].reason;
        this.snapshots.set(target, JSON.parse(JSON.stringify(target)));
        return results;
    }

    // ============ AUTH ============
    async login(identifier, password, channel = 'email') {
        try {
            const response = await this.request('POST', '/auth/login', { 
                username: identifier, 
                email: identifier, 
                password: password, 
                channel: channel 
            });
            if (response.success && response.data && response.data.challengeId) return response;
            if (response.success && response.data && response.data.token && response.data.user) {
                this.setToken(response.data.token);
                this.setUser(response.data.user);
                localStorage.setItem('centoro_admin_logged', JSON.stringify(response.data.user));
                return response;
            }
            throw new Error(response.message || 'Login failed');
        } catch (error) {
            console.error('Login error:', error.message);
            throw error;
        }
    }

    async verifyOtp(challengeId, code) {
        const response = await this.request('POST', '/auth/verify-otp', { challengeId, code });
        if (!response || !response.success || !response.data || !response.data.token || !response.data.user) {
            throw new Error(response && response.message ? response.message : 'OTP verification failed.');
        }
        this.setToken(response.data.token);
        this.setUser(response.data.user);
        localStorage.setItem('centoro_admin_logged', JSON.stringify(response.data.user));
        return response;
    }

    async register(userData) { return this.request('POST', '/auth/register', userData); }
    logout() { this.clearToken(); window.location.href = 'login.html'; }
    getCurrentUser() { return this.getUser(); }

    // ============ DASHBOARD ============
    async getDashboardStats() { return this.request('GET', '/dashboard/stats'); }
    
    // FIX 3: Added missing dashboard support functions
    async getCurrencyRates() { return this.request('GET', '/currency/rates'); }
    async getTimezones() { return this.request('GET', '/currency/timezones'); }
    async getCalendarNotes() { return this.request('GET', '/calendar/notes'); }

    // ============ CLIENTS ============
    async getClients() { return this.request('GET', '/clients'); }
    async getClient(id) { return this.request('GET', `/clients/${id}`); }
    async createClient(data) { return this.request('POST', '/clients', data); }
    async updateClient(id, data) { return this.request('PUT', `/clients/${id}`, data); }
    async deleteClient(id) { return this.request('DELETE', `/clients/${id}`); }
    async recalculateClient(id) { return this.request('POST', `/clients/${id}/recalculate`); }
    async getClientStats() { return this.request('GET', '/clients/stats'); }
    async getClientServices(id) { return this.request('GET', `/clients/${id}/services`); }
    async restoreClient(id) { return this.request('POST', `/clients/${id}/restore`); }
    async hardDeleteClient(id) { return this.request('DELETE', `/clients/${id}/permanent`); }

    // ============ STAFF ============
    async getStaff() { return this.request('GET', '/staff'); }
    async getStaffMember(id) { return this.request('GET', `/staff/${id}`); }
    async createStaff(data) { return this.request('POST', '/staff', data); }
    async updateStaff(id, data) { return this.request('PUT', `/staff/${id}`, data); }
    async deleteStaff(id) { return this.request('DELETE', `/staff/${id}`); }

    // ============ PROJECTS ============
    async getProjects() { return this.request('GET', '/projects'); }
    async getProject(id) { return this.request('GET', `/projects/${id}`); }
    async getProjectsByClient(clientId) { return this.request('GET', `/projects/client/${clientId}`); }
    async createProject(data) { return this.request('POST', '/projects', data); }
    async updateProject(id, data) { return this.request('PUT', `/projects/${id}`, data); }
    async deleteProject(id) { return this.request('DELETE', `/projects/${id}`); }
    async getProjectStats() { return this.request('GET', '/projects/stats'); }

    // ============ INVOICES ============
    async getInvoices() { return this.request('GET', '/invoices'); }
    async getInvoice(id) { return this.request('GET', `/invoices/${id}`); }
    async getInvoicesByClient(clientId) { return this.request('GET', `/invoices/client/${clientId}`); }
    async createInvoice(data) { return this.request('POST', '/invoices', data); }
    async updateInvoice(id, data) { return this.request('PUT', `/invoices/${id}`, data); }
    async deleteInvoice(id) { return this.request('DELETE', `/invoices/${id}`); }
    async markInvoicePaid(id, amount) { return this.request('POST', `/invoices/${id}/payment`, { amount, method: 'EFT', date: new Date().toISOString().slice(0, 10) }); }
    async getInvoiceStats() { return this.request('GET', '/invoices/stats'); }

    // ============ JOB CARDS ============
    async getJobCards() { return this.request('GET', '/jobcards'); }
    async getJobCard(id) { return this.request('GET', `/jobcards/${id}`); }
    async getJobCardsByClient(clientId) { return this.request('GET', `/jobcards/client/${clientId}`); }
    async getJobCardsByProject(projectId) { return this.request('GET', `/jobcards/project/${projectId}`); }
    async createJobCard(data) { return this.request('POST', '/jobcards', data); }
    async updateJobCard(id, data) { return this.request('PUT', `/jobcards/${id}`, data); }
    async deleteJobCard(id) { return this.request('DELETE', `/jobcards/${id}`); }
    async getJobCardStats() { return this.request('GET', '/jobcards/stats'); }

    // ============ VOUCHERS ============
    async getVouchers() { return this.request('GET', '/vouchers'); }
    async getVoucher(id) { return this.request('GET', `/vouchers/${id}`); }
    async createVoucher(data) { return this.request('POST', '/vouchers', data); }
    async updateVoucher(id, data) { return this.request('PUT', `/vouchers/${id}`, data); }
    async deleteVoucher(id) { return this.request('DELETE', `/vouchers/${id}`); }
    async redeemVoucher(id) { return this.request('POST', `/vouchers/${id}/redeem`); }
    async getVoucherStats() { return this.request('GET', '/vouchers/stats'); }

    // ============ ASSETS ============
    async getAssets() { return this.request('GET', '/assets'); }
    async getAsset(id) { return this.request('GET', `/assets/${id}`); }
    async createAsset(data) { return this.request('POST', '/assets', data); }
    async updateAsset(id, data) { return this.request('PUT', `/assets/${id}`, data); }
    async deleteAsset(id) { return this.request('DELETE', `/assets/${id}`); }
    async getAssetStats() { return this.request('GET', '/assets/stats'); }
    async getAvailableAssets() { return this.request('GET', '/assets/available'); }

    // ============ EXPENSES ============
    async getExpenses() { return this.request('GET', '/expenses'); }
    async getExpense(id) { return this.request('GET', `/expenses/${id}`); }
    async createExpense(data) { return this.request('POST', '/expenses', data); }
    async updateExpense(id, data) { return this.request('PUT', `/expenses/${id}`, data); }
    async deleteExpense(id) { return this.request('DELETE', `/expenses/${id}`); }

    // ============ PAYMENTS ============
    async getPayments() { return this.request('GET', '/payments'); }
    async getPayment(id) { return this.request('GET', `/payments/${id}`); }
    async createPayment(data) { return this.request('POST', '/payments', data); }
    async deletePayment(id) { return this.request('DELETE', `/payments/${id}`); }

    // ============ CHATS ============
    async getChats() { return this.request('GET', '/chats'); }
    async getWebsiteChatSessions() { return this.request('GET', '/website/chat/sessions'); }
    async getWebsiteChatMessages(sessionId) { return this.request('GET', `/website/chat/messages/${encodeURIComponent(sessionId)}`); }
    async sendWebsiteChatMessage(data) { return this.request('POST', '/website/chat/messages', data); }
    async uploadFile(file, folder = 'uploads') {
        const form = new FormData();
        form.append('file', file);
        return this.request('POST', `/storage/upload/${encodeURIComponent(folder)}`, form);
    }
    async listStorageFiles(folder) { return this.request('GET', `/storage/objects/${encodeURIComponent(folder)}`); }
    async deleteStorageFile(folder, objectName) {
        return this.request('DELETE', `/storage/objects/${encodeURIComponent(folder)}?object=${encodeURIComponent(objectName)}`);
    }
    async getChat(id) { return this.request('GET', `/chats/${id}`); }
    async getChatMessages(id) { return this.request('GET', `/chats/${id}/messages`); }
    async createChat(data) { return this.request('POST', '/chats', data); }
    async sendMessage(id, data) { return this.request('POST', `/chats/${id}/messages`, data); }
    async updateChatStatus(id, status) { return this.request('PUT', `/chats/${id}/status`, { status }); }
    async linkChatToCalendar(id, date) { return this.request('POST', `/chats/${id}/link-calendar`, { date }); }
    async deleteChat(id) { return this.request('DELETE', `/chats/${id}`); }
    async getChatStats() { return this.request('GET', '/chats/stats'); }

    // ============ STAFF CHAT ============
    async getStaffChats() { return this.request('GET', '/staff-chat'); }
    async getStaffChat(id) { return this.request('GET', `/staff-chat/${id}`); }
    async createStaffChat(data) { return this.request('POST', '/staff-chat', data); }
    async sendStaffMessage(id, data) { return this.request('POST', `/staff-chat/${id}/messages`, data); }
    async deleteStaffChat(id) { return this.request('DELETE', `/staff-chat/${id}`); }

    // ============ SETTINGS ============
    async getCompanySettings() { return this.request('GET', '/settings/company'); }
    async updateCompanySettings(data) { return this.request('PUT', '/settings/company', data); }
    async getThemeSettings() { return this.request('GET', '/settings/theme'); }
    async updateThemeSettings(data) { return this.request('PUT', '/settings/theme', data); }
    async getSecuritySettings() { return this.request('GET', '/settings/security/settings'); }
    async updateSecuritySettings(data) { return this.request('PUT', '/settings/security/settings', data); }

    // ============ WEBSITE ============
    async getWebsiteStats() { return this.request('GET', '/website/stats'); }
    async getLatestWebsiteStats() { return this.request('GET', '/website/stats/latest'); }
    async createWebsiteStats(data) { return this.request('POST', '/website/stats', data); }
    async updateWebsiteStats(id, data) { return this.request('PUT', `/website/stats/${id}`, data); }
    async deleteWebsiteStats(id) { return this.request('DELETE', `/website/stats/${id}`); }

    // ============ WEBSITE NEWS ============
    async getWebsiteNews() { return this.request('GET', '/website/news'); }
    async getPublishedNews() { return this.request('GET', '/website/news/published'); }
    async getNews(id) { return this.request('GET', `/website/news/${id}`); }
    async createNews(data) { return this.request('POST', '/website/news', data); }
    async updateNews(id, data) { return this.request('PUT', `/website/news/${id}`, data); }
    async deleteNews(id) { return this.request('DELETE', `/website/news/${id}`); }

    // ============ WEBSITE SLIDES ============
    async getSlides() { return this.request('GET', '/website/slides'); }
    async getActiveSlides() { return this.request('GET', '/website/slides/active'); }
    async getSlide(id) { return this.request('GET', `/website/slides/${id}`); }
    async createSlide(data) { return this.request('POST', '/website/slides', data); }
    async updateSlide(id, data) { return this.request('PUT', `/website/slides/${id}`, data); }
    async deleteSlide(id) { return this.request('DELETE', `/website/slides/${id}`); }

    // ============ WEBSITE PAGES ============
    async getWebsitePages() { return this.request('GET', '/website/pages'); }
    async getWebsitePage(id) { return this.request('GET', `/website/pages/${id}`); }
    async createWebsitePage(data) { return this.request('POST', '/website/pages', data); }
    async updateWebsitePage(id, data) { return this.request('PUT', `/website/pages/${id}`, data); }
    async deleteWebsitePage(id) { return this.request('DELETE', `/website/pages/${id}`); }

    // ============ WEBSITE PRICES ============
    async getPrices() { return this.request('GET', '/website/prices'); }
    async getPrice(id) { return this.request('GET', `/website/prices/${id}`); }
    async createPrice(data) { return this.request('POST', '/website/prices', data); }
    async updatePrice(id, data) { return this.request('PUT', `/website/prices/${id}`, data); }
    async deletePrice(id) { return this.request('DELETE', `/website/prices/${id}`); }

    // ============ PAYROLL ============
    async getPayroll(period) { return this.request('GET', `/payroll/period/${period}`); }
    async getPayrollSummary(period) { return this.request('GET', `/payroll/period/${period}/summary`); }
    async processPayroll(period) { return this.request('POST', `/payroll/period/${period}/process`); }
    async markPayrollPaid(recordId) { return this.request('POST', `/payroll/records/${recordId}/pay`); }

    // ============ BANK TRANSACTIONS ============
    async getBankTransactions() { return this.request('GET', '/bank-transactions'); }
    async getBankTransaction(id) { return this.request('GET', `/bank-transactions/${id}`); }
    async createBankTransaction(data) { return this.request('POST', '/bank-transactions', data); }
    async reconcileTransaction(id) { return this.request('POST', `/bank-transactions/${id}/reconcile`); }
    async deleteBankTransaction(id) { return this.request('DELETE', `/bank-transactions/${id}`); }
}

window.ApiService = new CentoroApiService();
