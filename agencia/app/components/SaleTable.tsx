'use client';

import { useState, useEffect } from "react";
import { Search, DollarSign, Eye, X, Calendar, User, Car, CreditCard, Banknote, Building2, FileText, Filter } from "lucide-react";

export default function SaleTable() {
    const [ventas, setVentas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVenta, setSelectedVenta] = useState<any>(null);

    useEffect(() => {
        fetchVentas();
    }, []);

    const fetchVentas = async () => {
        try {
            const response = await fetch('/api/sale', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setVentas(data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    // Filtrar ventas
    const filteredVentas = ventas.filter((venta: any) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            venta.cliente_dni?.toString().includes(searchLower) ||
            venta.vehiculo_patente?.toLowerCase().includes(searchLower) ||
            venta.vehiculo_vin?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Registro de Ventas</h2>
                    <p className="text-gray-600">
                        Total: <span className="font-bold text-red-600">{filteredVentas.length}</span> ventas
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                    Buscar por DNI, Dominio o VIN
                </label>
                <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder=""
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-500 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Vehículo</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Precio Total</th>
                                <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {filteredVentas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <DollarSign className="w-12 h-12 text-gray-300" />
                                            <p className="text-gray-500 font-semibold">
                                                {searchTerm 
                                                    ? "No se encontraron ventas con esos criterios" 
                                                    : "No hay ventas registradas"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredVentas.map((venta: any, index: number) => (
                                    <tr 
                                        key={venta.id} 
                                        className={`hover:bg-gray-50 transition-colors ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                        }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            {new Date(venta.fecha).toLocaleDateString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                                            {venta.cliente_nombre} {venta.cliente_apellido}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            {venta.vehiculo_marca} {venta.vehiculo_modelo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                                            ${parseFloat(venta.precio_total).toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedVenta(venta)}
                                                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all hover:scale-105"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Ver</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Info */}
            {filteredVentas.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            <span className="font-bold text-gray-900">💡 Tip:</span> Haz clic en "Ver" para acceder a todos los detalles de la venta.
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                            Mostrando {filteredVentas.length} de {ventas.length} ventas
                        </p>
                    </div>
                </div>
            )}

            {/* Modal */}
            {selectedVenta && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-scale-in">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-t-3xl flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                                    <DollarSign className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">Venta #{selectedVenta.id}</h3>
                                    <p className="text-sm text-gray-300">
                                        {new Date(selectedVenta.fecha).toLocaleDateString('es-AR', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedVenta(null)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="overflow-y-auto flex-1 p-8 space-y-6">
                            {/* Información Principal */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200">
                                    <p className="text-sm font-bold text-red-800 mb-2">PRECIO TOTAL</p>
                                    <p className="text-3xl font-black text-red-900">
                                        ${parseFloat(selectedVenta.precio_total).toLocaleString('es-AR')}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                                    <p className="text-sm font-bold text-blue-800 mb-2">CLIENTE</p>
                                    <p className="text-lg font-black text-blue-900">
                                        {selectedVenta.cliente_nombre} {selectedVenta.cliente_apellido}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                                    <p className="text-sm font-bold text-green-800 mb-2">VEHÍCULO</p>
                                    <p className="text-lg font-black text-green-900">
                                        {selectedVenta.vehiculo_marca} {selectedVenta.vehiculo_modelo}
                                    </p>
                                </div>
                            </div>

                            {/* Observaciones */}
                            {selectedVenta.observaciones && (
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <h4 className="text-lg font-black text-gray-900 mb-3 flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-red-600" />
                                        OBSERVACIONES
                                    </h4>
                                    <p className="text-gray-700">{selectedVenta.observaciones}</p>
                                </div>
                            )}

                            {/* Métodos de Pago */}
<div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
    <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-red-600" />
        Métodos de Pago
    </h4>
    <div className="space-y-4">
        {/* Cheques */}
        {selectedVenta?.pagos?.cheques?.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Banknote className="w-4 h-4 mr-2 text-purple-600" />
                    Cheques ({selectedVenta.pagos.cheques.length})
                </h5>

                <div className="space-y-3">
                    {selectedVenta.pagos.cheques.map((cheque : any, index : number) => (
                        <div key={index} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-600 font-semibold">Banco:</span>
                                    <span className="ml-2 text-gray-900">{cheque.banco}</span>
                                </div>

                                <div>
                                    <span className="text-gray-600 font-semibold">Número:</span>
                                    <span className="ml-2 text-gray-900">{cheque.numero_cheque}</span>
                                </div>

                                <div>
                                    <span className="text-gray-600 font-semibold">Monto:</span>
                                    <span className="ml-2 text-purple-700 font-bold">
                                        ${parseFloat(cheque.monto).toLocaleString('es-AR')}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-gray-600 font-semibold">Fecha Cobro:</span>
                                    <span className="ml-2 text-gray-900">
                                        {new Date(cheque.fecha_cobro).toLocaleDateString('es-AR')}
                                    </span>
                                </div>

                                <div className="col-span-2">
                                    <span className="text-gray-600 font-semibold">Titular:</span>
                                    <span className="ml-2 text-gray-900">{cheque.titular}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Financiación */}
        {selectedVenta?.pagos?.financiacion && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                    Financiación Bancaria
                </h5>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-600 font-semibold">Entidad:</span>
                            <span className="ml-2 text-gray-900">
                                {selectedVenta.pagos.financiacion.entidad_bancaria}
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-600 font-semibold">Cuotas:</span>
                            <span className="ml-2 text-gray-900">
                                {selectedVenta.pagos.financiacion.cantidad_cuotas}
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-600 font-semibold">Monto/Cuota:</span>
                            <span className="ml-2 text-blue-700 font-bold">
                                ${parseFloat(selectedVenta.pagos.financiacion.monto_cuota).toLocaleString('es-AR')}
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-600 font-semibold">Total:</span>
                            <span className="ml-2 text-blue-700 font-bold">
                                ${parseFloat(selectedVenta.pagos.financiacion.total_financiado).toLocaleString('es-AR')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Usado */}
        {selectedVenta?.pagos?.usado && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Car className="w-4 h-4 mr-2 text-green-600" />
                    Vehículo en Permuta
                </h5>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-600 font-semibold">Dominio:</span>
                            <span className="ml-2 text-gray-900">{selectedVenta.pagos.usado.dominio}</span>
                        </div>

                        <div>
                            <span className="text-gray-600 font-semibold">Vehículo:</span>
                            <span className="ml-2 text-gray-900">
                                {selectedVenta.pagos.usado.marca} {selectedVenta.pagos.usado.modelo}
                            </span>
                        </div>

                        <div>
                            <span className="text-gray-600 font-semibold">Año:</span>
                            <span className="ml-2 text-gray-900">{selectedVenta.pagos.usado.anio}</span>
                        </div>

                        <div>
                            <span className="text-gray-600 font-semibold">Cotización:</span>
                            <span className="ml-2 text-green-700 font-bold">
                                ${parseFloat(selectedVenta.pagos.usado.cotizacion).toLocaleString('es-AR')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Documento */}
        {selectedVenta?.pagos?.documento && (
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-purple-600" />
                    Pago con Documento
                </h5>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="grid grid-cols-3 gap-3 text-sm">

                    <div>
                        <span className="text-gray-600 font-semibold">Vencimiento:</span>
                        <span className="ml-2 text-gray-900">
                            {new Date(selectedVenta.pagos.documento.fecha_vencimiento).toLocaleDateString('es-AR')}
                        </span>
                    </div>

                    <div>
                        <span className="text-gray-600 font-semibold">Monto:</span>
                        <span className="ml-2 text-purple-700 font-bold">
                            ${parseFloat(selectedVenta.pagos.documento.monto).toLocaleString('es-AR')}
                        </span>
                    </div>

                    <div>
                        <span className="text-gray-600 font-semibold">Firmante:</span>
                        <span className="ml-2 text-gray-900">{selectedVenta.pagos.documento.firmante}</span>
                    </div>

                </div>
            </div>
        </div>
        )}
    </div>
</div>

                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-100 p-6 rounded-b-3xl border-t border-gray-200 flex-shrink-0">
                            <button
                                onClick={() => setSelectedVenta(null)}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02]"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}