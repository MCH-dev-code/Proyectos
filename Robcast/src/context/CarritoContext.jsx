import React, { createContext, useState } from "react";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const itemExistente = prev.find((item) => item.id === producto.id);
      if (itemExistente) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id);
    } else {
      setCarrito((prev) =>
        prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
      );
    }
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    totalCarrito,
    cantidadItems,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
