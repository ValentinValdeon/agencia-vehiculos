'use client';

import { useState, useEffect } from 'react';
import { User, Car, DollarSign, Calendar, FileText, CheckCircle2, AlertCircle, ArrowRight, CreditCard, Plus, X } from 'lucide-react';

export default function SaleForm() {
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [focusedField, setFocusedField] = useState('');
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    cliente_search: '',
    vehiculo_id: '',
    vehiculo_search: '',
    precio_total: '',
    observaciones: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const [pagos, setPagos] = useState({
    cheques: [] as any[],
    financiacion: {
      entidad: '',
      cuotas: '',
      monto_cuota: '',
      total_financiado: ''
    },
    usado: {
      dominio: '',
      marca: '',
      modelo: '',
      anio: '',
      cotizacion: ''
    },
    documento: {
      fecha_vencimiento: '',
      monto: '',
      firmante: ''
    }
  });

  const [metodosActivos, setMetodosActivos] = useState({
    cheques: false,
    financiacion: false,
    usado: false,
    documento: false
  });


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchClientes();
    fetchVehiculos();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const res = await fetch('/api/vehiculos');
      const data = await res.json();
      setVehiculos(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarCheque = () => {
    setPagos(prev => ({
      ...prev,
      cheques: [...prev.cheques, {
        banco: '',
        numero: '',
        monto: '',
        fecha_cobro: '',
        titular: ''
      }]
    }));
  };

  const eliminarCheque = (index: number) => {
    setPagos(prev => ({
      ...prev,
      cheques: prev.cheques.filter((_, i) => i !== index)
    }));
  };

  const handleChequeChange = (index: number, field: string, value: string) => {
    setPagos(prev => ({
      ...prev,
      cheques: prev.cheques.map((cheque, i) => 
        i === index ? { ...cheque, [field]: value } : cheque
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...formData,
        pagos
      };

      const response = await fetch('/api/sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: '¡Venta registrada exitosamente!' 
        });
        // Reset form
        setFormData({
          cliente_id: '',
          cliente_search: '',
          vehiculo_id: '',
          vehiculo_search: '',
          precio_total: '',
          observaciones: '',
          fecha: new Date().toISOString().split('T')[0],
        });
        setPagos({
          cheques: [],
          financiacion: { entidad: '', cuotas: '', monto_cuota: '', total_financiado: '' },
          usado: { dominio: '', marca: '', modelo: '', anio: '', cotizacion: '' },
          documento: { fecha_vencimiento: '', monto: '', firmante: '' }
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Error al registrar la venta' 
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

  const totalFields = 5;
  const filledFields = Object.values(formData).filter(v => v !== '').length;
  const progressPercent = (filledFields / totalFields) * 100;

  return (
    <div className="flex gap-8 h-full">
      {/* Left Side */}
      <div className="w-96 flex flex-col gap-20">
        <div>
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full mb-4 animate-fade-in">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Nueva Venta</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">
              Registrar<br />Venta
            </h1>
            <p className="text-lg text-gray-600">
              Completa la información de la venta y los métodos de pago
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Progreso</span>
              <span className="text-sm font-bold text-red-600">{filledFields}/{totalFields}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {filledFields === totalFields ? '¡Listo para enviar!' : `Faltan ${totalFields - filledFields} campos obligatorios`}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative">
            <DollarSign className="w-8 h-8 mb-3 text-red-500" />
            <p className="text-sm text-gray-400 mb-1">Ventas del Mes</p>
            <p className="text-4xl font-black">28</p>
            <p className="text-xs text-green-400 mt-2">↑ 15% vs mes anterior</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="p-10">
            
            {/* DATOS DE LA VENTA */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Información de la Venta</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Cliente con Autocompletado */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Cliente <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${
                      focusedField === 'cliente_id' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.cliente_search || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({ ...prev, cliente_search: value, cliente_id: '' }));
                      }}
                      onFocus={() => setFocusedField('cliente_id')}
                      onBlur={() => setTimeout(() => setFocusedField(''), 200)}
                      placeholder="Buscar cliente por DNI..."
                      required={!formData.cliente_id}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-500 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.cliente_id && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in z-10" />
                    )}
                  </div>
                  
                  {/* Dropdown de sugerencias */}
                  {focusedField === 'cliente_id' && formData.cliente_search && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-20">
                      {clientes
                        .filter((cliente: any) => {
                          const search = formData.cliente_search || '';
                          return cliente.dni?.toString().includes(search);
                        })
                        .slice(0, 5)
                        .map((cliente: any) => (
                          <button
                            key={cliente.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                cliente_id: cliente.id.toString(),
                                cliente_search: cliente.dni
                              }));
                              setFocusedField('');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <p className="font-semibold text-gray-900">{cliente.nombre} {cliente.apellido}</p>
                            <p className="text-sm text-gray-600">DNI: {cliente.dni} • {cliente.mail}</p>
                          </button>
                        ))}
                      {clientes.filter((cliente: any) => {
                        const search = formData.cliente_search || '';
                        return cliente.dni?.toString().includes(search);
                      }).length === 0 && (
                        <div className="px-4 py-3 text-center text-gray-500">
                          No se encontraron clientes
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Vehículo con Autocompletado */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Vehículo <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${
                      focusedField === 'vehiculo_id' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Car className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.vehiculo_search || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({ ...prev, vehiculo_search: value, vehiculo_id: '' }));
                      }}
                      onFocus={() => setFocusedField('vehiculo_id')}
                      onBlur={() => setTimeout(() => setFocusedField(''), 200)}
                      placeholder="Buscar vehículo por dominio o VIN..."
                      required={!formData.vehiculo_id}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-500 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.vehiculo_id && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in z-10" />
                    )}
                  </div>
                  
                  {/* Dropdown de sugerencias */}
                  {focusedField === 'vehiculo_id' && formData.vehiculo_search && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-20">
                      {vehiculos
                        .filter((vehiculo: any) => {
                          const search = formData.vehiculo_search?.toLowerCase() || '';
                          return (
                            vehiculo.dominio?.toLowerCase().includes(search) ||
                            vehiculo.vin?.toLowerCase().includes(search)
                          );
                        })
                        .slice(0, 5)
                        .map((vehiculo: any) => (
                          <button
                            key={vehiculo.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                vehiculo_id: vehiculo.id.toString(),
                                vehiculo_search: vehiculo.dominio || vehiculo.vin
                              }));
                              setFocusedField('');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <p className="font-semibold text-gray-900">{vehiculo.marca} {vehiculo.modelo}</p>
                            <p className="text-sm text-gray-600">
                              {vehiculo.dominio || vehiculo.vin} • {vehiculo.anio} • ${parseFloat(vehiculo.precio).toLocaleString('es-AR')}
                            </p>
                          </button>
                        ))}
                      {vehiculos.filter((vehiculo: any) => {
                        const search = formData.vehiculo_search?.toLowerCase() || '';
                        return (
                          vehiculo.dominio?.toLowerCase().includes(search) ||
                          vehiculo.vin?.toLowerCase().includes(search)
                        );
                      }).length === 0 && (
                        <div className="px-4 py-3 text-center text-gray-500">
                          No se encontraron vehículos
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Precio Total */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Precio Total <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'precio_total' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      name="precio_total"
                      value={formData.precio_total}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('precio_total')}
                      onBlur={() => setFocusedField('')}
                      placeholder="15000000"
                      required
                      step="0.01"
                      min="0"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-500 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                    {formData.precio_total && (
                      <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2 animate-scale-in" />
                    )}
                  </div>
                </div>

                {/* Fecha */}
                <div className="group">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Fecha de Venta <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                      focusedField === 'fecha' ? 'text-red-600 scale-110' : 'text-gray-400'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('fecha')}
                      onBlur={() => setFocusedField('')}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-500 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                    />
                  </div>
                </div>

                {/* Observaciones */}
                <div className="group col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Observaciones</label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    placeholder="Notas adicionales sobre la venta..."
                    rows={3}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-500 font-medium focus:outline-none focus:border-red-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* MÉTODOS DE PAGO */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Seleccionar métodos de Pago</h3>
              </div>
              
              <div className="mb-6 bg-gray-100 p-4 rounded-xl border border-gray-300">
                <div className="grid grid-cols-2 gap-3 text-sm">

                  {[
                    { key: "cheques", label: "Cheques" },
                    { key: "financiacion", label: "Financiación" },
                    { key: "usado", label: "Vehículo Usado" },
                    { key: "documento", label: "Documento" }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center space-x-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={metodosActivos[item.key as keyof typeof metodosActivos]}
                        onChange={(e) =>
                          setMetodosActivos((prev) => ({
                            ...prev,
                            [item.key]: e.target.checked
                          }))
                        }
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {item.label}
                      </span>
                    </label>
                  ))}

                </div>
              </div>
              
              {/* Cheques */}
              {metodosActivos.cheques && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-900">Cheques</h4>
                  <button
                    type="button"
                    onClick={agregarCheque}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Cheque</span>
                  </button>
                </div>

                {pagos.cheques.map((cheque, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-4 mb-4 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-gray-700">Cheque #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => eliminarCheque(index)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Banco"
                        value={cheque.banco}
                        onChange={(e) => handleChequeChange(index, 'banco', e.target.value)}
                        className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-red-600"
                      />
                      <input
                        type="text"
                        placeholder="Número"
                        value={cheque.numero}
                        onChange={(e) => handleChequeChange(index, 'numero', e.target.value)}
                        className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-red-600"
                      />
                      <input
                        type="number"
                        placeholder="Monto"
                        value={cheque.monto}
                        onChange={(e) => handleChequeChange(index, 'monto', e.target.value)}
                        className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-red-600"
                      />
                      <input
                        type="date"
                        placeholder="Fecha de Cobro"
                        value={cheque.fecha_cobro}
                        onChange={(e) => handleChequeChange(index, 'fecha_cobro', e.target.value)}
                        className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-red-600"
                      />
                      <input
                        type="text"
                        placeholder="Titular"
                        value={cheque.titular}
                        onChange={(e) => handleChequeChange(index, 'titular', e.target.value)}
                        className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-red-600 col-span-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
              )}

              {/* Financiación */}
              {metodosActivos.financiacion && (
              <div className="mb-6 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h4 className="text-sm font-bold text-blue-900 mb-4">Financiación Bancaria</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Entidad Bancaria"
                    value={pagos.financiacion.entidad}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      financiacion: { ...prev.financiacion, entidad: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="number"
                    placeholder="Cantidad de Cuotas"
                    value={pagos.financiacion.cuotas}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      financiacion: { ...prev.financiacion, cuotas: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="number"
                    placeholder="Monto por Cuota"
                    value={pagos.financiacion.monto_cuota}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      financiacion: { ...prev.financiacion, monto_cuota: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="number"
                    placeholder="Total Financiado"
                    value={pagos.financiacion.total_financiado}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      financiacion: { ...prev.financiacion, total_financiado: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              )}

              {/* Usado (Permuta) */}
              {metodosActivos.usado && (
              <div className="mb-6 bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h4 className="text-sm font-bold text-green-900 mb-4">Vehículo Usado (Permuta)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Dominio"
                    value={pagos.usado.dominio}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      usado: { ...prev.usado, dominio: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-sm font-medium focus:outline-none focus:border-green-600"
                  />
                  <input
                    type="text"
                    placeholder="Marca"
                    value={pagos.usado.marca}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      usado: { ...prev.usado, marca: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-sm font-medium focus:outline-none focus:border-green-600"
                  />
                  <input
                    type="text"
                    placeholder="Modelo"
                    value={pagos.usado.modelo}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      usado: { ...prev.usado, modelo: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-sm font-medium focus:outline-none focus:border-green-600"
                  />
                  <input
                    type="number"
                    placeholder="Año"
                    value={pagos.usado.anio}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      usado: { ...prev.usado, anio: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-sm font-medium focus:outline-none focus:border-green-600"
                  />
                  <input
                    type="number"
                    placeholder="Cotización"
                    value={pagos.usado.cotizacion}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      usado: { ...prev.usado, cotizacion: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-sm font-medium focus:outline-none focus:border-green-600 col-span-2"
                  />
                </div>
              </div>
              )}

              {/* Documento */}
              {metodosActivos.documento && (
              <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                <h4 className="text-sm font-bold text-purple-900 mb-4">Pago con Documento</h4>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="date"
                    placeholder="Fecha Vencimiento"
                    value={pagos.documento.fecha_vencimiento}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      documento: { ...prev.documento, fecha_vencimiento: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-600"
                  />
                  <input
                    type="number"
                    placeholder="Monto"
                    value={pagos.documento.monto}
                    onChange={(e) => setPagos(prev => ({
                      ...prev,
                      documento: { ...prev.documento, monto: e.target.value }
                    }))}
                    className="px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>
              )}
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
                      Registrar Venta
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">💡 Tip:</span> Los métodos de pago son opcionales. Solo completa los que se utilicen en esta venta.
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