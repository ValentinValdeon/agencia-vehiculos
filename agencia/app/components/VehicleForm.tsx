'use client';

import { useState } from 'react';
import { Car, Hash, Palette, Tag, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VehicleForm() {
  const [formData, setFormData] = useState({
    patente: '',
    marca: '',
    modelo: '',
    color: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [focusedField, setFocusedField] = useState('');

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
      const response = await fetch('/api/vehicles', {
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

  const progress = Object.values(formData).filter(val => val !== '').length;
  const progressPercent = (progress / 4) * 100;

  return (
    <div className="flex gap-8 h-full">
      {/* Left Side - Header & Info */}
      <div className="w-96 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full mb-4 animate-fade-in">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Nuevo Registro</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">
              Agregar<br />Vehículo
            </h1>
            <p className="text-lg text-gray-600">
              Completa la información del vehículo para añadirlo al inventario de FRAN MOTORS
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Progreso del formulario</span>
              <span className="text-sm font-bold text-red-600">{progress}/4</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progress === 4 ? '¡Listo para enviar!' : `Faltan ${4 - progress} campos`}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <p className="text-sm text-gray-400 mb-1">Inventario Total</p>
              <p className="text-4xl font-black">142</p>
              <p className="text-xs text-green-400 mt-2">↑ 12% vs mes anterior</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <p className="text-xs text-gray-600 mb-1">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <p className="text-xs text-gray-600 mb-1">Este mes</p>
              <p className="text-2xl font-bold text-red-600">+18</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="p-10">
            <div className="space-y-6">
              {/* Patente */}
              <div className="group">
                <label htmlFor="patente" className="block text-sm font-bold text-gray-900 mb-3 transition-colors">
                  Patente del Vehículo
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'patente' ? 'text-red-600 scale-110' : 'text-gray-400'
                  }`}>
                    <Hash className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="patente"
                    name="patente"
                    value={formData.patente}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('patente')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Ej: ABC123"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                  />
                  {formData.patente && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                  )}
                </div>
              </div>

              {/* Marca & Modelo - Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Marca */}
                <div className="group">
                  <label htmlFor="marca" className="block text-sm font-bold text-gray-900 mb-3">
                    Marca
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'marca' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="marca"
                      name="marca"
                      value={formData.marca}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('marca')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Ej: Toyota"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.marca && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>

                {/* Modelo */}
                <div className="group">
                  <label htmlFor="modelo" className="block text-sm font-bold text-gray-900 mb-3">
                    Modelo
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'modelo' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Tag className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="modelo"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('modelo')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Ej: Corolla"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.modelo && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>
              </div>

              {/* Color */}
              <div className="group">
                <label htmlFor="color" className="block text-sm font-bold text-gray-900 mb-3">
                  Color
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'color' ? 'text-red-600 scale-110' : 'text-gray-400'
                  }`}>
                    <Palette className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('color')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Ej: Blanco Perlado"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                  />
                  {formData.color && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                  )}
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div className={`p-5 rounded-2xl flex items-start space-x-3 animate-slide-up ${
                  message.type === 'success' 
                    ? 'bg-green-50 border-2 border-green-200' 
                    : 'bg-red-50 border-2 border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <p className={`text-sm font-semibold ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message.text}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || progress < 4}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <span className="flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando...
                      </>
                    ) : (
                      <>
                        Registrar Vehículo
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ patente: '', marca: '', modelo: '', color: '' });
                    setMessage({ type: '', text: '' });
                  }}
                  className="px-8 py-4 text-gray-700 hover:bg-gray-100 font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">💡 Recordatorio:</span> Verifica que todos los datos sean correctos antes de enviar. La patente debe coincidir con la documentación oficial del vehículo.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}