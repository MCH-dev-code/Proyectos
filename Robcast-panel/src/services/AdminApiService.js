// Panel Admin - Cliente API Service
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AdminApiService {
  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // ===== PRODUCTOS =====
  async getProductos() {
    const response = await fetch(`${API_URL}/productos`, {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
  }

  async crearProducto(producto) {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(producto)
    });
    if (!response.ok) throw new Error('Error al crear producto');
    return response.json();
  }

  async actualizarProducto(id, producto) {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(producto)
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return response.json();
  }

  async eliminarProducto(id) {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar producto');
    return response.json();
  }

  // ===== VENTAS =====
  async obtenerEstadisticas() {
    const response = await fetch(`${API_URL}/ventas/reportes/estadisticas`, {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return response.json();
  }

  async obtenerTodasLasVentas() {
    const response = await fetch(`${API_URL}/ventas`, {
      headers: this.getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener ventas');
    return response.json();
  }

  async actualizarEstadoVenta(id, estado) {
    const response = await fetch(`${API_URL}/ventas/${id}/estado`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ estado })
    });
    if (!response.ok) throw new Error('Error al actualizar venta');
    return response.json();
  }
}

export default new AdminApiService();
