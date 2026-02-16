import { useEffect, useState } from 'react';
import AdminApiService from '../services/AdminApiService';

export default function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            setLoading(true);
            const data = await AdminApiService.obtenerTodasLasVentas();
            setVentas(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error cargando ventas:', err);
        } finally {
            setLoading(false);
        }
    };

    const actualizarEstado = async (ventaId) => {
        if (!newStatus) {
            alert('Selecciona un estado');
            return;
        }

        try {
            await AdminApiService.actualizarEstadoVenta(ventaId, newStatus);
            setSelectedVenta(null);
            setNewStatus('');
            cargarVentas();
            alert('Estado actualizado correctamente');
        } catch (err) {
            alert('Error al actualizar: ' + err.message);
        }
    };

    const estadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmado':
                return 'bg-blue-100 text-blue-800';
            case 'enviado':
                return 'bg-purple-100 text-purple-800';
            case 'entregado':
                return 'bg-green-100 text-green-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Ventas</h1>
                <button
                    onClick={cargarVentas}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    🔄 Actualizar
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {ventas.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p>No hay ventas registradas</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 p-3 text-left">ID</th>
                                <th className="border border-gray-300 p-3 text-left">Usuario</th>
                                <th className="border border-gray-300 p-3 text-left">Total</th>
                                <th className="border border-gray-300 p-3 text-left">Estado</th>
                                <th className="border border-gray-300 p-3 text-left">Fecha</th>
                                <th className="border border-gray-300 p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta) => (
                                <tr key={venta.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-3">{venta.id}</td>
                                    <td className="border border-gray-300 p-3">{venta.usuario_id}</td>
                                    <td className="border border-gray-300 p-3 font-semibold">${venta.total?.toFixed(2) || '0.00'}</td>
                                    <td className="border border-gray-300 p-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadoColor(venta.estado)}`}>
                                            {venta.estado || 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 p-3">
                                        {new Date(venta.fecha_venta).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="border border-gray-300 p-3 text-center">
                                        <button
                                            onClick={() => {
                                                setSelectedVenta(venta.id);
                                                setNewStatus(venta.estado || 'pendiente');
                                            }}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de edición */}
            {selectedVenta && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Actualizar Estado - Venta #{selectedVenta}</h2>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Nuevo Estado:</label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-600"
                            >
                                <option value="">Seleccionar estado...</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="enviado">Enviado</option>
                                <option value="entregado">Entregado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => actualizarEstado(selectedVenta)}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedVenta(null);
                                    setNewStatus('');
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
