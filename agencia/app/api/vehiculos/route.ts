import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      condicion, // 'NUEVO' o 'USADO'
      marca,
      modelo,
      anio,
      color,
      precio,
      numero_motor,
      numero_chasis,
      vin,
      // Campos exclusivos de Usados
      dominio,
      check_cedula, 
      check_info_dominio, 
      check_info_multa, 
      check_titulo,
      check_08,
      check_libre_deuda,
      check_peritaje,
      check_consignacion
    } = body;

    // 1. Validaciones Básicas (Campos obligatorios para TODOS)
    if (!marca || !modelo || !anio || !precio || !condicion || !vin) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Si es usado, DEBE tener dominio (patente)
    if (condicion === 'USADO' && !dominio) {
      return NextResponse.json(
        { error: "Los vehículos usados deben tener Dominio (Patente)." },
        { status: 400 }
      );
    }

    // Preparamos los valores para 'Usado'. Si es 'Nuevo', forzamos NULL o False.
    const isUsado = condicion === 'USADO';
    
    // Parseamos los valores numéricos para asegurar que sean correctos
    const anio_int = parseInt(anio);
    const precio_decimal = parseFloat(precio);

    // Query SQL
    const [result] = await pool.query(
      `INSERT INTO vehiculo (
        condicion, marca, modelo, anio, color, precio, 
        numero_motor, numero_chasis, vin,
        dominio, 
        check_cedula, check_info_dominio, check_info_multa, check_titulo, 
        check_08, check_libre_deuda, check_peritaje, check_consignacion
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        condicion,
        marca,
        modelo,
        anio_int,
        color,
        precio_decimal,
        numero_motor,
        numero_chasis,
        vin,
        // Si es usado insertamos el dominio, si es nuevo insertamos NULL
        isUsado ? dominio : null,
        // Checklist: Si es usado insertamos el valor (o false si no viene), si es nuevo insertamos 0 (false)
        isUsado ? (check_cedula || 0) : 0,
        isUsado ? (check_info_dominio || 0) : 0,
        isUsado ? (check_info_multa || 0) : 0,
        isUsado ? (check_titulo || 0) : 0,
        isUsado ? (check_08 || 0) : 0,
        isUsado ? (check_libre_deuda || 0) : 0,
        isUsado ? (check_peritaje || 0) : 0,
        isUsado ? (check_consignacion || 0) : 0
      ]
    );

    return NextResponse.json({
      message: "Vehículo registrado exitosamente",
      id: (result as any).insertId
    });

  } catch (err: any) {
    console.error("Error al insertar vehículo:", err);
    
    // Error de duplicado (ej. Patente repetida)
    if (err.errno === 1062) {
         return NextResponse.json(
             { error: "El vehículo ya existe (Patente o VIN duplicado)." },
             { status: 409 }
         );
    }

    return NextResponse.json(
      { error: "Error interno del servidor al guardar el vehículo." },
      { status: 500 }
    );
  }
}

// READ
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM vehiculo ORDER BY created_at DESC");

    const rows = result[0]; // forzamos el tipo

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al obtener los vehículos:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de vehículos" },
      { status: 500 }
    );
  }
}

