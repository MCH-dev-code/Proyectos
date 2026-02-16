import React, { createContext, useState, useEffect } from "react";
import ApiService from "../services/ApiService.js";

export const UsuarioContext = createContext();

export const UsuarioProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    if (token) {
      cargarPerfil();
    }
  }, []);

  const cargarPerfil = async () => {
    try {
      setCargando(true);
      const usuario = await ApiService.obtenerPerfil(token);
      setUsuarioActual(usuario);
    } catch (err) {
      console.error(err);
      // Token inválido, limpiar
      localStorage.removeItem('token');
      setToken(null);
      setUsuarioActual(null);
    } finally {
      setCargando(false);
    }
  };

  // Registrar nuevo usuario
  const registrarUsuario = async (nombre, email, password, telefono) => {
    try {
      setCargando(true);
      setError(null);
      const { usuario, token: nuevoToken } = await ApiService.registrarse(nombre, email, password, telefono);
      setToken(nuevoToken);
      setUsuarioActual(usuario);
      localStorage.setItem('token', nuevoToken);
      return { success: true, usuario };
    } catch (err) {
      const mensaje = err.message;
      setError(mensaje);
      return { error: mensaje };
    } finally {
      setCargando(false);
    }
  };

  // Login
  const iniciarSesion = async (email, password) => {
    try {
      setCargando(true);
      setError(null);
      const { usuario, token: nuevoToken } = await ApiService.iniciarSesion(email, password);
      setToken(nuevoToken);
      setUsuarioActual(usuario);
      localStorage.setItem('token', nuevoToken);
      return { success: true, usuario };
    } catch (err) {
      const mensaje = err.message;
      setError(mensaje);
      return { error: mensaje };
    } finally {
      setCargando(false);
    }
  };

  // Logout
  const cerrarSesion = () => {
    setUsuarioActual(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  // Actualizar perfil
  const actualizarPerfil = async (nombre, telefono, direccion, metodo_pago) => {
    try {
      setCargando(true);
      setError(null);
      const { usuario } = await ApiService.actualizarPerfil(
        { nombre, telefono, direccion, metodo_pago },
        token
      );
      setUsuarioActual(usuario);
      return { success: true, usuario };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const value = {
    usuarioActual,
    token,
    cargando,
    error,
    registrarUsuario,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
    estaLogueado: !!usuarioActual
  };

  return (
    <UsuarioContext.Provider value={value}>
      {children}
    </UsuarioContext.Provider>
  );
};

