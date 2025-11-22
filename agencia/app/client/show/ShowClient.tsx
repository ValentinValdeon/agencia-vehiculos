"use client";
import { useEffect, useState } from "react";


interface Client {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    estado_civil: string;
    fecha_nacimiento: string;
    mail: string;
}

export default function ShowClient() {
    const [clientes, setClientes] = useState<Client[]>([]);


    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch("/api/clients");
                const data = await res.json();
                setClientes(data);
            } catch (error) {
                console.error("Error cargando clientes:", error);
            }
        };


        fetchClients();
    }, []);


    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Lista de Clientes</h1>

        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
        <tr>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">Apellido</th>
            <th className="p-3 border">DNI</th>
            <th className="p-3 border">Estado Civil</th>
            <th className="p-3 border">Fecha Nac.</th>
            <th className="p-3 border">Mail</th>
            <th className="p-3 border">Acciones</th>
        </tr>
        </thead>


        <tbody>
        {clientes.map((c) => (
            <tr key={c.id} className="text-center">
            <td className="p-3 border">{c.nombre}</td>
            <td className="p-3 border">{c.apellido}</td>
            <td className="p-3 border">{c.dni}</td>
            <td className="p-3 border">{c.estado_civil}</td>
            <td className="p-3 border">{c.fecha_nacimiento}</td>
            <td className="p-3 border">{c.mail}</td>


            <td className="p-3 border space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded">Más info</button>
                <button className="px-3 py-1 bg-yellow-500 text-white rounded">Editar</button>
                <button className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
            </td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
    );
}