import {
  UserProfile,
  UserFinanceData,
  Booking,
  AiAnalysisResult,
  AiStatus,
} from '../types';

const isNativeMobile =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:');

const API_BASE = import.meta.env.VITE_API_URL || (isNativeMobile ? 'https://fnc.bonto.page' : '');

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('ub_auth_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('ub_auth_token', token);
    } else {
      localStorage.removeItem('ub_auth_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = `${API_BASE}/api${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 || response.status === 403) {
        this.setToken(null);
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Fehler bei Anfrage (${response.status})`);
      }

      return data as T;
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        throw new Error('Verbindung zum Server fehlgeschlagen. Bitte prüfe deine Internetverbindung oder den Backend-Status.');
      }
      throw err;
    }
  }

  // --- Auth Endpoints ---
  public async register(payload: { email: string; password: string; name?: string }) {
    const res = await this.request<{ token: string; user: UserProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(res.token);
    return res;
  }

  public async login(payload: { email: string; password: string }) {
    const res = await this.request<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(res.token);
    return res;
  }

  public async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/me');
  }

  public async updateProfile(payload: { name?: string; email?: string; currentPassword?: string }) {
    return this.request<UserProfile>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  public async changePassword(payload: { oldPassword: string; newPassword: string }) {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async deleteAccount(password: string) {
    const res = await this.request<{ message: string }>('/auth/delete-account', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    this.setToken(null);
    return res;
  }

  // --- Finance Endpoints ---
  public async getFinances(): Promise<UserFinanceData> {
    return this.request<UserFinanceData>('/finances');
  }

  public async saveFinances(data: UserFinanceData): Promise<UserFinanceData> {
    return this.request<UserFinanceData>('/finances', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async addBooking(booking: Partial<Booking>): Promise<UserFinanceData> {
    return this.request<UserFinanceData>('/finances/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  public async deleteBooking(bookingId: string): Promise<UserFinanceData> {
    return this.request<UserFinanceData>(`/finances/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  public async resetFinances(): Promise<UserFinanceData> {
    return this.request<UserFinanceData>('/finances/reset', {
      method: 'POST',
    });
  }

  public async exportData(): Promise<any> {
    return this.request<any>('/finances/export');
  }

  // --- AI Endpoints ---
  public async analyzeAi(data?: UserFinanceData): Promise<AiAnalysisResult> {
    return this.request<AiAnalysisResult>('/ai/analyze', {
      method: 'POST',
      body: data ? JSON.stringify(data) : JSON.stringify({}),
    });
  }

  public async getAiStatus(): Promise<AiStatus> {
    return this.request<AiStatus>('/ai/status');
  }
}

export const api = new ApiService();
