'use client';

import { useState } from 'react';
import { User, Home, MapPin, Mail, Phone, Calendar, Hash, CreditCard } from 'lucide-react';


const maritalStatuses = [
  'Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión Civil'
];

export default function ClientForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    domicilio: '',
    localidad: '',
    codigo_postal: '',
    provincia: '',
    telefono: '',
    nacimiento: '',
    cuil: '',
    dni: '',
    tipo_dni: 'DNI',
    mail: '',
    estado_civil: maritalStatuses[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
            type: 'success', 
            text: '¡Cliente registrado exitosamente!' 
        });

        setFormData({
          nombre: '', 
          apellido: '', 
          domicilio: '', 
          localidad: '', 
          codigo_postal: '',
          provincia: '', 
          telefono: '', 
          nacimiento: '', 
          cuil: '', 
          dni: '',
          tipo_dni: 'DNI', 
          mail: '', 
          estado_civil: maritalStatuses[0],
        });
      } else {
        setMessage({ 
            type: 'error', 
            text: data.error || 'Error al registrar el cliente.' 
        });
      }
    } catch {
      setMessage({ 
        type: 'error', 
        text: 'Error de conexión.' 
    });
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-black text-red-600 mb-2">Registrar Nuevo Cliente</h2>
        <p className="text-gray-600">Ingresa todos los datos del cliente.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl">
        <form onSubmit={handleSubmit} className="p-8">

          {/* ---- DATOS PERSONALES ---- */}
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2">Datos Personales</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Nombre</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Apellido</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Mail */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Mail</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="mail"
                  value={formData.mail}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* ---- DOCUMENTACIÓN ---- */}
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2 mt-4">Documentación</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Tipo de DNI */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tipo de Documento</label>
              <div className="relative">
                <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="tipo_dni"
                  value={formData.tipo_dni}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="LE">LE</option>
                </select>
              </div>
            </div>

            {/* DNI */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">DNI</label>
              <div className="relative">
                <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  inputMode="numeric"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* CUIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">CUIL/CUIT</label>
              <div className="relative">
                <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="cuil"
                  value={formData.cuil}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* ---- CONTACTO ---- */}
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2 mt-4">Contacto y Estado</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Teléfono</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  inputMode="numeric"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Fecha Nacimiento */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Fecha de Nacimiento</label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  name="nacimiento"
                  value={formData.nacimiento}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Estado Civil */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Estado Civil</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="estado_civil"
                  value={formData.estado_civil}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {maritalStatuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ---- DOMICILIO ---- */}
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2 mt-4">Domicilio</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Domicilio */}
            <div className="lg:col-span-full">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Domicilio</label>
              <div className="relative">
                <Home className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="domicilio"
                  value={formData.domicilio}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Localidad */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Localidad</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Provincia */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Provincia</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Código Postal */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Código Postal</label>
              <div className="relative">
                <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  inputMode="numeric"
                  name="codigo_postal"
                  value={formData.codigo_postal}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* ---- MENSAJE ---- */}
          {message.text && (
            <div className={`mt-6 p-4 rounded-xl ${
              message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* ---- BOTONES ---- */}
          <div className="mt-8 flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white font-semibold py-3 px-6 rounded-xl"
            >
              {loading ? "Registrando..." : "Registrar Cliente"}
            </button>

            <button
              type="button"
              onClick={() => setFormData({
                nombre: "", apellido: "", domicilio: "", localidad: "",
                codigo_postal: "", provincia: "", telefono: "", nacimiento: "",
                cuil: "", dni: "", tipo_dni: "DNI", mail: "",
                estado_civil: maritalStatuses[0],
              })}
              className="px-6 py-3 text-gray-700 border border-gray-200 rounded-xl"
            >
              Limpiar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
