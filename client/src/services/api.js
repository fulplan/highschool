// API service for backend communication
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setAuthToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      },
      ...options
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication
  async login(username, password) {
    const response = await this.request('/login', {
      method: 'POST',
      body: { username, password }
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  // Menu
  async getMenu() {
    return this.request('/menu');
  }

  async createMenuItem(item) {
    return this.request('/menu', {
      method: 'POST',
      body: item
    });
  }

  async updateMenuItem(id, item) {
    return this.request(`/menu/${id}`, {
      method: 'PUT',
      body: item
    });
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData
    });
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders${queryString ? '?' + queryString : ''}`);
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData
    });
  }

  // Health check
  async health() {
    return this.request('/health');
  }
}

export default new ApiService();