'use client';

import { useState, useEffect } from "react";
import { Search, Car, CheckCircle2, XCircle, Filter, Eye, X, CalendarDays, DollarSign, Palette, Hash } from "lucide-react";

export default function VehicleTableModal() {
    const [vehiculos, setVehiculos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCondicion, setFilterCondicion] = useState("TODOS");
    const [selectedVehiculo, setSelectedVehiculo] = useState<any>(null);


    useEffect(() => {
        async function fetchVehiculos() {
            try {
                const response = await fetch('/api/vehicles',{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setVehiculos(data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        }
        fetchVehiculos();
    }, []);

    // Filtrar vehículos
    const filteredVehiculos = vehiculos.filter((vehiculo: any) => {
        const matchesSearch = vehiculo.dominio?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            vehiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vehiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vehiculo.vin?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCondicion = filterCondicion === "TODOS" || vehiculo.condicion === filterCondicion;
        return matchesSearch && matchesCondicion;
    });

    return (        
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Inventario de Vehículos</h2>
                    <p className="text-gray-600">
                        Total: <span className="font-bold text-red-600">{filteredVehiculos.length}</span> vehículos
                    </p>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full">
                    <Car className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">FRAN MOTORS</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search Bar */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Buscar por Dominio/Patente, Marca o Modelo
                        </label>
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Ej: ABC123, Toyota, Corolla..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-500 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Condition Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                            Filtrar por Condición
                        </label>
                        <div className="relative">
                            <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <select
                                value={filterCondicion}
                                onChange={(e) => setFilterCondicion(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-500 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                            >
                                <option value="TODOS">Todos</option>
                                <option value="NUEVO">Nuevos</option>
                                <option value="USADO">Usados</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Condición</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Dominio</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">VIN</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Marca</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Modelo</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Año</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Color</th>
                                <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Info</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {filteredVehiculos.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Car className="w-12 h-12 text-gray-300" />
                                            <p className="text-gray-500 font-semibold">
                                                {searchTerm || filterCondicion !== "TODOS" 
                                                    ? "No se encontraron vehículos con esos criterios" 
                                                    : "No hay vehículos registrados"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredVehiculos.map((vehiculo: any, index: number) => (
                                    <tr 
                                        key={vehiculo.id} 
                                        className={`hover:bg-gray-50 transition-colors ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                        }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                vehiculo.condicion === 'NUEVO' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {vehiculo.condicion}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="font-bold text-gray-900">
                                                {vehiculo.dominio || <span className="text-gray-400 italic">-</span>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{vehiculo.vin}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{vehiculo.marca}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vehiculo.modelo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vehiculo.anio}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vehiculo.color}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                                            ${parseFloat(vehiculo.precio).toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedVehiculo(vehiculo)}
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
            {filteredVehiculos.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            <span className="font-bold text-gray-900">💡 Tip:</span> Haz clic en "Ver" para acceder a todos los detalles del vehículo.
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                            Mostrando {filteredVehiculos.length} de {vehiculos.length} vehículos
                        </p>
                    </div>
                </div>
            )}

            {/* Modal */}
            {selectedVehiculo && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-hidden animate-scale-in">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-t-3xl flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                                    <Car className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">
                                        {selectedVehiculo.marca} {selectedVehiculo.modelo}
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        {selectedVehiculo.dominio || 'Sin dominio'} • {selectedVehiculo.anio}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedVehiculo(null)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                            {/* Información Principal */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                                    <p className="text-sm font-bold text-blue-800 mb-2">CONDICIÓN</p>
                                    <p className="text-3xl font-black text-blue-900">{selectedVehiculo.condicion}</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                                    <p className="text-sm font-bold text-green-800 mb-2">PRECIO</p>
                                    <p className="text-3xl font-black text-green-900">
                                        ${parseFloat(selectedVehiculo.precio).toLocaleString('es-AR')}
                                    </p>
                                </div>
                            </div>

                            {/* Detalles del Vehículo */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center">
                                    <Car className="w-5 h-5 mr-2 text-red-600" />
                                    DETALLES DEL VEHÍCULO
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Año</p>
                                        <p className="text-lg font-bold text-gray-900 flex items-center">
                                            <CalendarDays className="w-4 h-4 mr-2 text-gray-600" />
                                            {selectedVehiculo.anio}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Color</p>
                                        <p className="text-lg font-bold text-gray-900 flex items-center">
                                            <Palette className="w-4 h-4 mr-2 text-gray-600" />
                                            {selectedVehiculo.color}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Dominio</p>
                                        <p className="text-lg font-bold text-gray-900 flex items-center">
                                            <Hash className="w-4 h-4 mr-2 text-gray-600" />
                                            {selectedVehiculo.dominio || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Identificación */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <h4 className="text-lg font-black text-gray-900 mb-4 flex items-center">
                                    <Hash className="w-5 h-5 mr-2 text-red-600" />
                                    IDENTIFICACIÓN
                                </h4>
                                <div className="space-y-3">
                                    {selectedVehiculo.numero_motor && (
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Número de Motor</span>
                                            <span className="text-sm font-mono text-gray-900">{selectedVehiculo.numero_motor}</span>
                                        </div>
                                    )}
                                    {selectedVehiculo.numero_chasis && (
                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                            <span className="text-sm font-semibold text-gray-700">Número de Chasis</span>
                                            <span className="text-sm font-mono text-gray-900">{selectedVehiculo.numero_chasis}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Documentación */}
                            {selectedVehiculo.condicion === 'USADO' && (
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <h4 className="text-lg font-black text-gray-900 mb-4">DOCUMENTACIÓN Y VERIFICACIONES</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'Cédula Verde/Azul', value: selectedVehiculo.check_cedula },
                                            { label: 'Info de Dominio', value: selectedVehiculo.check_info_dominio },
                                            { label: 'Info de Multas', value: selectedVehiculo.check_info_multa },
                                            { label: 'Título de Propiedad', value: selectedVehiculo.check_titulo },
                                            { label: 'Formulario 08', value: selectedVehiculo.check_08 },
                                            { label: 'Libre Deuda', value: selectedVehiculo.check_libre_deuda },
                                            { label: 'Peritaje', value: selectedVehiculo.check_peritaje },
                                            { label: 'Consignación', value: selectedVehiculo.check_consignacion },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center justify-between p-3 bg-white rounded-xl">
                                                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                                                {item.value ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-gray-300" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-100 p-6 rounded-b-3xl border-t border-gray-200">
                            <button
                                onClick={() => setSelectedVehiculo(null)}
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