import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de Login para el Panel Admin
 * Requiere autenticación JWT para acceder al panel
 */
export function LoginPanel() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Verificar que el usuario sea admin
      if (data.rol !== 'admin') {
        throw new Error('Acceso denegado: Solo administradores pueden acceder');
      }

      // Guardar token y rol
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify({
        id: data.usuario_id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }));

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Robcast</h1>
          <p className="text-gray-600 mt-2">Panel de Administración</p>
          <p className="text-sm text-gray-500 mt-1">Acceso exclusivo para administradores</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mostrar errores */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Input Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@robcast.com"
            />
          </div>

          {/* Input Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600">
            <strong>Nota:</strong> Este panel es de acceso restringido. Solo administradores pueden ingresar con sus credenciales autorizadas.
          </p>
        </div>

        {/* Credentials helper (Solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-xs text-yellow-800 font-mono">
              Demo: admin@robcast.com.do / admin123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
