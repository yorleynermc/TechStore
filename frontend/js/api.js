const API_BASE_URL = window.location.hostname === 'localhost' ?
    'http://localhost:3000/api' :
    '/api';

// Cliente HTTP centralizado para todas las llamadas a la API REST.
// El token JWT se persiste en localStorage para sobrevivir recargas de página.
class TechStoreAPI {
    constructor() {
        this.token = localStorage.getItem('admin_token');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = { 'Content-Type': 'application/json' };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers: {...headers, ...options.headers }
        });

        // Token expirado o inválido: limpiar sesión y redirigir al login.
        if (response.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = 'admin-login.html';
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje || 'Error en la solicitud');
        }

        return data;
    }

    // AUTH
    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        this.token = data.token;
        localStorage.setItem('admin_token', this.token);
        return data;
    }

    logout() {
        this.token = null;
        localStorage.removeItem('admin_token');
    }

    // PRODUCTOS - Público
    async getProductos(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/productos?${query}`, { method: 'GET' });
    }

    async getProducto(id) {
        return this.request(`/productos/${id}`, { method: 'GET' });
    }

    async checkout(items) {
        return this.request('/productos/carrito/checkout', {
            method: 'POST',
            body: JSON.stringify({ items })
        });
    }

    // PRODUCTOS - Admin
    async createProducto(producto) {
        return this.request('/productos', {
            method: 'POST',
            body: JSON.stringify(producto)
        });
    }

    async updateProducto(id, producto) {
        return this.request(`/productos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(producto)
        });
    }

    async deleteProducto(id) {
        return this.request(`/productos/${id}`, {
            method: 'DELETE'
        });
    }

    async getStockBajo() {
        return this.request('/productos/stock-bajo', { method: 'GET' });
    }

    async getDashboard() {
        return this.request('/productos/dashboard', { method: 'GET' });
    }
}

const api = new TechStoreAPI();