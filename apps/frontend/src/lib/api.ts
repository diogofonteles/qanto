import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  CreateSupermarketDto,
  Product,
  ShoppingList,
  ComparisonResult,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

class ApiClient {
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    auth: boolean = false
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(auth),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async registerSupermarket(data: CreateSupermarketDto): Promise<any> {
    return this.request('/supermarkets/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<any> {
    return this.request('/users/profile', {}, true);
  }

  async getProducts(params?: Record<string, any>): Promise<{ data: Product[]; meta: any }> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/products${queryString}`);
  }

  async getProductById(id: string): Promise<Product> {
    return this.request(`/products/${id}`);
  }

  async getMyLists(): Promise<ShoppingList[]> {
    return this.request('/lists', {}, true);
  }

  async createList(name: string): Promise<ShoppingList> {
    return this.request(
      '/lists',
      {
        method: 'POST',
        body: JSON.stringify({ name }),
      },
      true
    );
  }

  async getListById(id: string): Promise<ShoppingList> {
    return this.request(`/lists/${id}`, {}, true);
  }

  async addItemToList(listId: string, productId: string, quantity: number): Promise<any> {
    return this.request(
      `/lists/${listId}/items`,
      {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      },
      true
    );
  }

  async compareList(listId: string, supermarketIds: string[]): Promise<ComparisonResult> {
    return this.request(
      '/comparisons',
      {
        method: 'POST',
        body: JSON.stringify({ listId, supermarketIds }),
      },
      true
    );
  }

  async getComparisons(limit?: number): Promise<any[]> {
    const queryString = limit ? `?limit=${limit}` : '';
    return this.request(`/comparisons${queryString}`, {}, true);
  }

  async getSupermarkets(params?: Record<string, any>): Promise<any[]> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request(`/supermarkets${queryString}`);
  }

  async getCategories(): Promise<any[]> {
    return this.request('/products/categories');
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  getStoredUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }
}

export const api = new ApiClient();
