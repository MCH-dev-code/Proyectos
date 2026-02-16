import React, { useEffect } from "react";

export const Toast = ({ mensaje, tipo = "success", duracion = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duracion);
    return () => clearTimeout(timer);
  }, [duracion, onClose]);

  const estilos = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500"
  };

  return (
    <div className={`fixed bottom-4 right-4 ${estilos[tipo]} text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50`}>
      {mensaje}
    </div>
  );
};
