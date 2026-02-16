// ApiService.js - Cliente HTTP para la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  // ===== PRODUCTOS =====
  static async getProductos() {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
  }

  static async getProductoPorId(id) {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) throw new Error('Producto no encontrado');
    return response.json();
  }

  static async crearProducto(data, token) {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al crear producto');
    return response.json();
  }

  static async actualizarProducto(id, data, token) {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return response.json();
  }

  // ===== USUARIOS =====
  static async registrarse(nombre, email, password, telefono) {
    const response = await fetch(`${API_URL}/usuarios/registrarse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, telefono })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrarse');
    }
    return response.json();
  }

  static async iniciarSesion(email, password) {
    const response = await fetch(`${API_URL}/usuarios/iniciar-sesion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }
    return response.json();
  }

  static async obtenerPerfil(token) {
    const response = await fetch(`${API_URL}/usuarios/perfil`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener perfil');
    return response.json();
  }

  static async actualizarPerfil(data, token) {
    const response = await fetch(`${API_URL}/usuarios/perfil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar perfil');
    return response.json();
  }

  // ===== VENTAS =====
  static async crearVenta(items, total, direccion, token) {
    const response = await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items, total, direccion })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear venta');
    }
    return response.json();
  }

  static async obtenerOrdenes(token) {
    const response = await fetch(`${API_URL}/ventas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener órdenes');
    return response.json();
  }

  static async obtenerOrdenPorId(id, token) {
    const response = await fetch(`${API_URL}/ventas/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Orden no encontrada');
    return response.json();
  }

  static async actualizarEstadoOrden(id, estado, token) {
    const response = await fetch(`${API_URL}/ventas/${id}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ estado })
    });
    if (!response.ok) throw new Error('Error al actualizar estado');
    return response.json();
  }

  static async obtenerEstadisticas(token) {
    const response = await fetch(`${API_URL}/ventas/reportes/estadisticas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return response.json();
  }
}

export default ApiService;
