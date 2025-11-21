'use client';

import { useState } from 'react';
import { Car, Hash, Palette, Tag } from 'lucide-react';

export default function VehicleForm() {
  const [formData, setFormData] = useState({
    patente: '',
    marca: '',
    modelo: '',
    color: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/vehiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: '¡Vehículo registrado exitosamente!' 
        });
        // Limpiar formulario
        setFormData({
          patente: '',
          marca: '',
          modelo: '',
          color: '',
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Error al registrar el vehículo' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error de conexión. Por favor, intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-black text-gray-900 mb-2">
          Registrar Vehículo
        </h2>
        <p className="text-gray-600">
          Completa los datos del vehículo para agregarlo al inventario
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Patente */}
            <div className="col-span-2">
              <label htmlFor="patente" className="block text-sm font-semibold text-gray-900 mb-2">
                Patente
              </label>
              <div className="relative">
                <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="patente"
                  name="patente"
                  value={formData.patente}
                  onChange={handleChange}
                  placeholder="ABC123"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Marca */}
            <div>
              <label htmlFor="marca" className="block text-sm font-semibold text-gray-900 mb-2">
                Marca
              </label>
              <div className="relative">
                <Car className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  placeholder="Toyota"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Modelo */}
            <div>
              <label htmlFor="modelo" className="block text-sm font-semibold text-gray-900 mb-2">
                Modelo
              </label>
              <div className="relative">
                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="Corolla"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Color */}
            <div className="col-span-2">
              <label htmlFor="color" className="block text-sm font-semibold text-gray-900 mb-2">
                Color
              </label>
              <div className="relative">
                <Palette className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Blanco"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mt-6 p-4 rounded-xl ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:shadow-lg hover:shadow-red-700/30 text-white font-semibold py-3 px-6 rounded-xl cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed justify-center flex items-center"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Registrar Vehículo'
              )}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ patente: '', marca: '', modelo: '', color: '' })}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-500 cursor-pointer font-semibold rounded-xl transition-colors"
            >
              Limpiar
            </button>
          </div>
        </form>

        {/* Info Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <p className="text-sm text-gray-600">
            💡 <span className="font-semibold">Tip:</span> Asegúrate de verificar los datos antes de registrar el vehículo en el sistema.
          </p>
        </div>
      </div>

      {/* Stats Preview */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Vehículos Totales</p>
          <p className="text-2xl font-bold text-gray-900">142</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Nuevos este mes</p>
          <p className="text-2xl font-bold text-green-600">+18</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Disponibles</p>
          <p className="text-2xl font-bold text-red-600">89</p>
        </div>
      </div>
    </div>
  );
}