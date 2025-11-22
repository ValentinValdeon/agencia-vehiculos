'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Home, MapPin, Mail, Phone, Calendar, Hash, CheckCircle2, AlertCircle, ArrowRight, Users, IdCard } from 'lucide-react';

const maritalStatuses = [
  'Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a'
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

// Definición de tipos para las respuestas de la API
type Province = { nombre: string; };
type Locality = { nombre: string; };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [focusedField, setFocusedField] = useState('');

  

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

    const finalFormData = {
      ...formData,
      provincia: query, 
      localidad: queryLocalidad, 
    };

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
        setQuery(''); // Limpiar provincia
        setQueryLocalidad(''); // Limpiar localidad
        setLocalidades([]);
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

  const handleLocalitySelection = useCallback((loc: string) => {
    setQueryLocalidad(loc);
    setFormData(prev => ({ ...prev, localidad: loc }));
    setShowLocalidades(false);
  }, []);

  // Calcular progreso
  const totalFields = 13;
  const filledFields = Object.entries(formData).filter(([key, value]) => {
    if (key === 'tipo_dni' || key === 'estado_civil') return true;
    return value !== '';
  }).length;
  const progressPercent = (filledFields / totalFields) * 100;

  const [query, setQuery] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showList, setShowList] = useState(false);

  const [localidades, setLocalidades] = useState<string[]>([]);
  const [queryLocalidad, setQueryLocalidad] = useState("");
  const [filteredLocalidades, setFilteredLocalidades] = useState<string[]>([]);
  const [showLocalidades, setShowLocalidades] = useState(false);

  


  useEffect(() => {
    // API de provincias argentinas (exactamente la que te pasé antes)
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then(res => res.json())
      .then(data => {
        const lista = data.provincias.map((p: { nombre: any; }) => p.nombre);
        setProvincias(lista);
        setFiltered(lista);
      });
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered(provincias);  // mostrar todas
    } else {
      setFiltered(
        provincias.filter((prov : string) =>
          prov.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, provincias]);

  

 useEffect(() => {
    if (queryLocalidad.trim() === "") {
    setFilteredLocalidades(localidades);
    } else {
    const newFiltered = localidades.filter((loc: string) =>
      loc.toLowerCase().includes(queryLocalidad.toLowerCase())
    );
    setFilteredLocalidades(newFiltered);
    }
 }, [queryLocalidad, localidades]);

 // Función para manejar la selección de provincia
 const handleProvinceSelection = useCallback(async (provincia: string) => {
    // 1. Actualizar estado de Provincia
    setQuery(provincia);
    setFormData(prev => ({ ...prev, provincia: provincia }));
    setShowList(false);

    // 2. Limpiar estados de Localidad al cambiar la provincia (CRUCIAL para el bug)
    setQueryLocalidad('');
    setFormData(prev => ({ ...prev, localidad: '' }));
    
    // 3. Fetch de localidades
    try {
    const res = await fetch(
      `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&max=500&orden=nombre` // Agregué orden por nombre
    );

    const data = await res.json();
    const uniqueLocalities = new Set((data.localidades as Locality[]).map((l) => l.nombre));
    const listaLoc = Array.from(uniqueLocalities).sort() as string[];

    // 4. Setear la nueva lista maestra y la lista filtrada inicial
    setLocalidades(listaLoc);
    setFilteredLocalidades(listaLoc);
    } catch (e) {
    console.error("Error fetching localities:", e);
    setLocalidades([]);
    setFilteredLocalidades([]);
    }
 }, []);

  return (
    <div className="flex gap-8 h-full">
      {/* Left Side - Header & Info */}
      <div className="w-96 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full mb-4 animate-fade-in">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Nuevo Cliente</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">
              Registrar<br />Cliente
            </h1>
            <p className="text-lg text-gray-600">
              Completa toda la información personal y de contacto del nuevo cliente
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Progreso del formulario</span>
              <span className="text-sm font-bold text-red-600">{filledFields}/{totalFields}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {filledFields === totalFields ? '¡Listo para enviar!' : `Faltan ${totalFields - filledFields} campos`}
            </p>
          </div>

          {/* Section Progress */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">Datos Personales</span>
              </div>
              <span className="text-xs font-bold text-gray-600">3 campos</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <IdCard className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">Documentación</span>
              </div>
              <span className="text-xs font-bold text-gray-600">3 campos</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">Contacto</span>
              </div>
              <span className="text-xs font-bold text-gray-600">3 campos</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">Domicilio</span>
              </div>
              <span className="text-xs font-bold text-gray-600">4 campos</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative">
            <Users className="w-8 h-8 mb-3 text-red-500" />
            <p className="text-sm text-gray-400 mb-1">Total Clientes</p>
            <p className="text-4xl font-black">287</p>
            <p className="text-xs text-green-400 mt-2">↑ 23% vs mes anterior</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="p-10">
            
            {/* DATOS PERSONALES */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Datos Personales</h3>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Nombre */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Nombre</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'nombre' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('nombre')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Ej: Juan"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.nombre && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>

                {/* Apellido */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Apellido</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'apellido' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('apellido')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Ej: Pérez"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.apellido && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>

                {/* Mail */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Correo Electrónico</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'mail' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      name="mail"
                      value={formData.mail}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('mail')}
                      onBlur={() => setFocusedField('')}
                      placeholder="correo@ejemplo.com"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.mail && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* DOCUMENTACIÓN */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <IdCard className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Documentación</h3>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Tipo DNI */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Tipo de Documento</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'tipo_dni' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <IdCard className="w-5 h-5" />
                    </div>
                    <select
                      name="tipo_dni"
                      value={formData.tipo_dni}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('tipo_dni')}
                      onBlur={() => setFocusedField('')}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    >
                      <option value="DNI">DNI</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="LE">LE</option>
                    </select>
                  </div>
                </div>

                {/* DNI */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Número de Documento</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'dni' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Hash className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('dni')}
                      onBlur={() => setFocusedField('')}
                      placeholder="12345678"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.dni && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>

                {/* CUIL */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">CUIL/CUIT</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'cuil' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <IdCard className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="cuil"
                      value={formData.cuil}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('cuil')}
                      onBlur={() => setFocusedField('')}
                      placeholder="20-12345678-9"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.cuil && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACTO */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Contacto y Estado</h3>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Teléfono */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Teléfono</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'telefono' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('telefono')}
                      onBlur={() => setFocusedField('')}
                      placeholder="+54 9 11 1234-5678"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.telefono && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>

                {/* Fecha Nacimiento */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Fecha de Nacimiento</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'nacimiento' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      type="date"
                      name="nacimiento"
                      value={formData.nacimiento}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('nacimiento')}
                      onBlur={() => setFocusedField('')}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.nacimiento && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>

                {/* Estado Civil */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Estado Civil</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'estado_civil' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <select
                      name="estado_civil"
                      value={formData.estado_civil}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('estado_civil')}
                      onBlur={() => setFocusedField('')}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    >
                      {maritalStatuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* DOMICILIO */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Domicilio</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Domicilio */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Dirección Completa</label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'domicilio' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Home className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="domicilio"
                      value={formData.domicilio}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('domicilio')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Calle 123, Piso 4, Depto B"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.domicilio && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Provincia */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-900 mb-3">Provincia</label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'provincia' ? 'text-red-600 scale-110' : 'text-gray-400'
                      }`}>
                      <MapPin className="w-5 h-5" />
                      </div>
                      <input
                      type="text"
                      name="provincia"
                      value={query}
                      onChange={e => {
                        setQuery(e.target.value);
                        setShowList(true);
                        // Limpiar localidades si el usuario empieza a escribir de nuevo
                        if (e.target.value !== formData.provincia) {
                        setQueryLocalidad('');
                        setFormData(prev => ({ ...prev, localidad: '', provincia: e.target.value }));
                        }
                      }}
                      onFocus={() => { setFocusedField('provincia'); setShowList(true); }}
                      onBlur={() => { setFocusedField(''); setTimeout(() => setShowList(false), 200); }}
                      placeholder="Provincia"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                      />
                      {showList && filtered.length > 0 && (
                      <ul className="absolute z-20 bg-white w-full border border-gray-300 rounded-xl mt-2 max-h-52 overflow-y-auto shadow-xl">
                        {filtered.map((provincia) => (
                        <li
                          key={provincia}
                          className="p-3 cursor-pointer hover:bg-red-50 text-gray-800 transition-colors"
                          onMouseDown={(e) => {
                          e.preventDefault();
                          handleProvinceSelection(provincia);
                          }}
                        >
                          {provincia}
                        </li>
                        ))}
                      </ul>
                      )}
                    </div>
                  </div>

                  {/* Localidad */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-900 mb-3">Localidad</label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                        focusedField === 'localidad' ? 'text-red-600 scale-110' : 'text-gray-400'
                      }`}>
                        <MapPin className="w-5 h-5" />
                      </div>

                    <input
                    type="text"
                    name="localidad"
                    value={queryLocalidad}
                    onChange={(e) => {
                      setQueryLocalidad(e.target.value);
                      setShowLocalidades(true);
                    }}
                    onFocus={() => { setFocusedField('localidad'); setShowLocalidades(true); }}
                    onBlur={() => { setFocusedField(''); setTimeout(() => setShowLocalidades(false), 200); }}
                    placeholder={localidades.length > 0 ? "Localidad" : "Selecciona una provincia primero"}
                    required
                    disabled={localidades.length === 0}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                    />
                    {formData.localidad && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                      )}

                    {showLocalidades && filteredLocalidades.length > 0 && (
                    <ul className="absolute z-20 bg-white w-full border border-gray-300 rounded-xl mt-2 max-h-52 overflow-y-auto shadow-xl">
                      {filteredLocalidades.map((loc) => (
                      <li
                        key={loc}
                        className="p-3 cursor-pointer hover:bg-red-50 text-gray-800 transition-colors"
                        onMouseDown={(e) => {
                        e.preventDefault();
                        handleLocalitySelection(loc);
                        }}
                      >
                        {loc}
                      </li>
                      ))}
                    </ul>
                    )}
                  </div>
                  </div>


                  {/* Código Postal */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-900 mb-3">Código Postal</label>
                    <div className="relative">
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                        focusedField === 'codigo_postal' ? 'text-red-600 scale-110' : 'text-gray-400'
                      }`}>
                        <Hash className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="codigo_postal"
                        value={formData.codigo_postal}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('codigo_postal')}
                        onBlur={() => setFocusedField('')}
                        placeholder="1234"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                      />
                      {formData.codigo_postal && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                      )}
                    </div>
                  </div>
                </div>
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
                disabled={loading || filledFields < totalFields}
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
                      Registrar Cliente
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
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
                  setMessage({ type: '', text: '' });
                }}
                className="px-8 py-4 text-gray-700 hover:bg-gray-100 font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">🔒 Privacidad:</span> Todos los datos personales son confidenciales y están protegidos según la Ley de Protección de Datos Personales 25.326.
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