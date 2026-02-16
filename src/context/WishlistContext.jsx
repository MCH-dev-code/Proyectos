import React, { createContext, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const agregarAWishlist = (producto) => {
    const existe = wishlist.find(item => item.id === producto.id);
    if (!existe) {
      setWishlist([...wishlist, producto]);
      return { success: true };
    }
    return { error: "Producto ya en wishlist" };
  };

  const eliminarDelWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const estaEnWishlist = (id) => {
    return wishlist.some(item => item.id === id);
  };

  const value = {
    wishlist,
    agregarAWishlist,
    eliminarDelWishlist,
    estaEnWishlist,
    cantidadWishlist: wishlist.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
