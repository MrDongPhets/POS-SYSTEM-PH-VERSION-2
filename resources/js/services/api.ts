import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Types
interface AuthTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface User {
    id: number;
    company_id: number;
    store_id?: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    permissions: {
        can_override_prices: boolean;
        can_apply_discounts: boolean;
        can_process_returns: boolean;
        can_void_transactions: boolean;
    };
}

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: any;
}

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
});

// Token management
class TokenManager {
    private static TOKEN_KEY = 'pos_access_token';
    private static REFRESH_TOKEN_KEY = 'pos_refresh_token';
    private static USER_KEY = 'pos_user';

    static getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static removeToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    static getUser(): User | null {
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    static setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    static clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
}

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = TokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Check if error is token expired
            const errorData: any = error.response.data;
            if (errorData?.error === 'token_expired') {
                try {
                    const response = await AuthService.refreshToken();
                    if (response.success && response.access_token) {
                        TokenManager.setToken(response.access_token);
                        originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    TokenManager.clearAuth();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // Other 401 errors, clear auth and redirect
                TokenManager.clearAuth();
                window.location.href = '/login';
            }
        }

        // Handle 403 errors (forbidden)
        if (error.response?.status === 403) {
            const errorData: any = error.response.data;
            
            // Check if company is pending approval
            if (errorData?.pending_approval) {
                window.location.href = '/company/pending-approval';
            }
        }

        return Promise.reject(error);
    }
);

// Auth Service
export const AuthService = {
    async login(email: string, password: string, companyCode?: string): Promise<any> {
        const response = await api.post('/auth/login', {
            email,
            password,
            company_code: companyCode
        });
        
        const data = response.data;
        if (data.success && data.access_token) {
            TokenManager.setToken(data.access_token);
            TokenManager.setUser(data.user);
        }
        
        return data;
    },

    async register(formData: any): Promise<ApiResponse> {
        const response = await api.post('/auth/register', formData);
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } finally {
            TokenManager.clearAuth();
            window.location.href = '/login';
        }
    },

    async refreshToken(): Promise<any> {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    async changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<ApiResponse> {
        const response = await api.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation
        });
        return response.data;
    },

    async getProfile(): Promise<ApiResponse<User>> {
        const response = await api.get('/auth/me');
        return response.data;
    },

    isAuthenticated(): boolean {
        return !!TokenManager.getToken();
    },

    getCurrentUser(): User | null {
        return TokenManager.getUser();
    }
};

// Company Service
export const CompanyService = {
    async getProfile(): Promise<ApiResponse> {
        const response = await api.get('/company/profile');
        return response.data;
    },

    async updateProfile(data: any): Promise<ApiResponse> {
        const response = await api.put('/company/profile', data);
        return response.data;
    },

    async getDashboard(): Promise<ApiResponse> {
        const response = await api.get('/company/dashboard');
        return response.data;
    },

    async getSubscription(): Promise<ApiResponse> {
        const response = await api.get('/company/subscription');
        return response.data;
    }
};

// Store Service
export const StoreService = {
    async getAll(): Promise<ApiResponse> {
        const response = await api.get('/stores');
        return response.data;
    },

    async get(id: number): Promise<ApiResponse> {
        const response = await api.get(`/stores/${id}`);
        return response.data;
    },

    async create(data: any): Promise<ApiResponse> {
        const response = await api.post('/stores', data);
        return response.data;
    },

    async update(id: number, data: any): Promise<ApiResponse> {
        const response = await api.put(`/stores/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/stores/${id}`);
        return response.data;
    },

    async activate(id: number): Promise<ApiResponse> {
        const response = await api.post(`/stores/${id}/activate`);
        return response.data;
    },

    async deactivate(id: number): Promise<ApiResponse> {
        const response = await api.post(`/stores/${id}/deactivate`);
        return response.data;
    }
};

// Product Service
export const ProductService = {
    async getAll(params?: any): Promise<ApiResponse> {
        const response = await api.get('/products', { params });
        return response.data;
    },

    async get(id: number): Promise<ApiResponse> {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    async create(data: any): Promise<ApiResponse> {
        const response = await api.post('/products', data);
        return response.data;
    },

    async update(id: number, data: any): Promise<ApiResponse> {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<ApiResponse> {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    async updateStock(id: number, quantity: number, type: string): Promise<ApiResponse> {
        const response = await api.post(`/products/${id}/update-stock`, {
            quantity,
            type
        });
        return response.data;
    },

    async import(file: File): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/products/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async export(): Promise<void> {
        const response = await api.get('/products/export', {
            responseType: 'blob'
        });
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `products_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

// Transaction Service
export const TransactionService = {
    async create(data: any): Promise<ApiResponse> {
        const response = await api.post('/pos/transaction', data);
        return response.data;
    },

    async get(id: string): Promise<ApiResponse> {
        const response = await api.get(`/pos/transaction/${id}`);
        return response.data;
    },

    async getAll(params?: any): Promise<ApiResponse> {
        const response = await api.get('/pos/transactions', { params });
        return response.data;
    },

    async getTodayTransactions(): Promise<ApiResponse> {
        const response = await api.get('/pos/transactions/today');
        return response.data;
    },

    async voidTransaction(id: string, reason: string): Promise<ApiResponse> {
        const response = await api.post(`/pos/transaction/${id}/void`, { reason });
        return response.data;
    },

    async returnTransaction(id: string, items: any[], reason: string): Promise<ApiResponse> {
        const response = await api.post(`/pos/transaction/${id}/return`, {
            items,
            reason
        });
        return response.data;
    },

    async startSession(): Promise<ApiResponse> {
        const response = await api.post('/pos/session/start');
        return response.data;
    },

    async endSession(data: any): Promise<ApiResponse> {
        const response = await api.post('/pos/session/end', data);
        return response.data;
    },

    async getCurrentSession(): Promise<ApiResponse> {
        const response = await api.get('/pos/session');
        return response.data;
    }
};

// Export default api instance
export default api;