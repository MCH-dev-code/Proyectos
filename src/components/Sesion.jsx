import React, { useState, useContext } from "react";
import { UsuarioContext } from "../context/UsuarioContext.jsx";

const Sesion = () => {
  const { usuarioActual, cerrarSesion, registrarUsuario, iniciarSesion, actualizarPerfil } = useContext(UsuarioContext);
  const [tipoForm, setTipoForm] = useState(usuarioActual ? "perfil" : "login"); // login, registro, perfil
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editando, setEditando] = useState(false);

  // Form Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Form Registro
  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [regTelefono, setRegTelefono] = useState("");

  // Edición de perfil
  const [editNombre, setEditNombre] = useState(usuarioActual?.nombre || "");
  const [editTelefono, setEditTelefono] = useState(usuarioActual?.telefono || "");
  const [editDireccion, setEditDireccion] = useState(usuarioActual?.direccion || "");
  const [editMetodoPago, setEditMetodoPago] = useState(usuarioActual?.metodoPago || "");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const resultado = iniciarSesion(loginEmail, loginPassword);
    if (resultado.error) {
      setError(resultado.error);
    } else {
      setSuccess("¡Sesión iniciada correctamente!");
      setLoginEmail("");
      setLoginPassword("");
      setTimeout(() => {
        setTipoForm("perfil");
      }, 1000);
    }
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (regPassword !== regPassword2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (regPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const resultado = registrarUsuario(regNombre, regEmail, regPassword, regTelefono);
    if (resultado.error) {
      setError(resultado.error);
    } else {
      setSuccess("¡Cuenta creada correctamente! Bienvenido " + regNombre);
      setRegNombre("");
      setRegEmail("");
      setRegPassword("");
      setRegPassword2("");
      setRegTelefono("");
      setTimeout(() => {
        setTipoForm("perfil");
      }, 1500);
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    setTipoForm("login");
    setSuccess("Sesión cerrada correctamente");
  };

  const handleGuardarPerfil = () => {
    const resultado = actualizarPerfil(editNombre, editTelefono, editDireccion, editMetodoPago);
    if (resultado.success) {
      setSuccess("Perfil actualizado correctamente");
      setEditando(false);
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError(resultado.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Robcast</h1>
          <p className="text-gray-600">Gestiona tu cuenta</p>
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
            {success}
          </div>
        )}

        {/* Contenedor principal */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Si está logueado: Mostrar perfil */}
          {usuarioActual ? (
            <div className="space-y-6">
              {/* Header perfil */}
              <div className="text-center">
                <div className="text-5xl mb-3">👤</div>
                <h2 className="text-2xl font-bold text-gray-800">{usuarioActual.nombre}</h2>
                <p className="text-gray-600">{usuarioActual.email}</p>
              </div>

              {/* Puntos y Rewards */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">Puntos de Lealtad</p>
                <p className="text-3xl font-bold text-orange-600">{usuarioActual.puntos || 0} 🏆</p>
                <p className="text-gray-600 text-xs mt-1">Gana puntos en cada compra</p>
              </div>

              {/* Tabs para perfil/órdenes */}
              <div className="flex gap-2 border-b-2">
                <button
                  onClick={() => setEditando(false)}
                  className={`px-4 py-2 font-bold border-b-2 transition ${
                    !editando
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent"
                  }`}
                >
                  📋 Datos Personales
                </button>
                <button
                  onClick={() => setEditando(true)}
                  className={`px-4 py-2 font-bold border-b-2 transition ${
                    editando
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent"
                  }`}
                >
                  📦 Mis Órdenes ({usuarioActual.ordenes?.length || 0})
                </button>
              </div>

              {/* Datos Personales */}
              {!editando ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-semibold text-gray-800">{usuarioActual.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">{usuarioActual.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-semibold text-gray-800">{usuarioActual.telefono || "No añadido"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dirección de Envío</p>
                      <p className="font-semibold text-gray-800">{usuarioActual.direccion || "No añadida"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Método de Pago</p>
                      <p className="font-semibold text-gray-800">{usuarioActual.metodoPago || "No añadido"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Miembro desde</p>
                      <p className="font-semibold text-gray-800">{usuarioActual.fechaRegistro}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditNombre(usuarioActual.nombre);
                        setEditTelefono(usuarioActual.telefono);
                        setEditDireccion(usuarioActual.direccion);
                        setEditMetodoPago(usuarioActual.metodoPago);
                        setEditando(false);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      ✏️ Editar Datos
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                /* Mis Órdenes */
                <div className="space-y-4">
                  {usuarioActual.ordenes && usuarioActual.ordenes.length > 0 ? (
                    usuarioActual.ordenes.map((orden) => (
                      <div key={orden.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-gray-800">Orden #{orden.id}</p>
                            <p className="text-sm text-gray-600">{orden.fecha}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            orden.estado === "Entregada" ? "bg-green-100 text-green-700" :
                            orden.estado === "En camino" ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {orden.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          📍 {orden.direccion}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          📦 {orden.productos?.length || 0} producto(s)
                        </p>
                        <p className="font-bold text-lg text-blue-600">
                          Total: {orden.total}
                        </p>
                        {orden.puntosGanados && (
                          <p className="text-xs text-orange-600 mt-2">
                            +{orden.puntosGanados} 🏆 puntos ganados
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-600">📦 Aún no tienes órdenes</p>
                      <p className="text-sm text-gray-500 mt-2">Realiza tu primera compra para verla aquí</p>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Editar Perfil */}
              {editando === false && !editando && (
                <button
                  onClick={() => {
                    // Ya está en vista de órdenes, no necesita modal
                  }}
                  style={{ display: "none" }}
                >
                  hidden
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Tabs: Login / Registro */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => {
                    setTipoForm("login");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold transition ${
                    tipoForm === "login"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setTipoForm("registro");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-bold transition ${
                    tipoForm === "registro"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Mensajes de error */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Formulario Login */}
              {tipoForm === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Iniciar Sesión
                  </button>

                  <div className="text-center text-sm text-gray-600 pt-2">
                    <p>
                      Usa estos datos de prueba:<br />
                      <span className="font-mono text-xs">demo@test.com / 123456</span>
                    </p>
                  </div>
                </form>
              )}

              {/* Formulario Registro */}
              {tipoForm === "registro" && (
                <form onSubmit={handleRegistro} className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={regNombre}
                      onChange={(e) => setRegNombre(e.target.value)}
                      placeholder="Juan Pérez"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={regTelefono}
                      onChange={(e) => setRegTelefono(e.target.value)}
                      placeholder="+1 (809) 123-4567"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      value={regPassword2}
                      onChange={(e) => setRegPassword2(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Crear Cuenta
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-600 text-sm mt-6">
          <p>Robcast - E-commerce de Tecnología</p>
          <p>(809) 594-6269</p>
        </div>
      </div>
    </div>
  );
};

export default Sesion;
