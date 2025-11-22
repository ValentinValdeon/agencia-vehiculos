import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; 

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { 
      nombre, apellido, domicilio, localidad, codigo_postal, 
      provincia, telefono, nacimiento, cuil, dni, 
      tipo_dni, mail, estado_civil 
    } = body;

    // Validación básica de campos obligatorios (ajusta según tus reglas)
    
    if (!nombre || !apellido || !dni || !cuil || !nacimiento) {
        return NextResponse.json(
            { 
            error: "Faltan campos obligatorios" 
            },
            { status: 400 }
        );
    }
    
    // Convertir DNI y Código Postal a números (si la columna en la BD es INT)
    const dni_int = parseInt(dni);
    const codigo_postal_int = parseInt(codigo_postal);

    // Consulta SQL para insertar el nuevo cliente
    const [result] = await pool.query(
      `INSERT INTO client (
        nombre, apellido, domicilio, localidad, codigo_postal, provincia, 
        telefono, nacimiento, cuil, dni, tipo_dni, mail, estado_civil
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, apellido, domicilio, localidad, codigo_postal_int, provincia, 
        telefono, nacimiento, cuil, dni_int, tipo_dni, mail, estado_civil 
      ]
      // si el estad civil eta casado te tien que dejar cargar los datos del conyuge los cuales son: nombre, apellido, dni, tipo de dni
      // opcion cargar una foto del dni del titular y conyuge si hace falta 
      
    );

    return NextResponse.json({
      message: "Cliente creado exitosamente",
      id: (result as any).insertId
    });

  } catch (err: any) {
    console.error("Error al insertar cliente:", err);
    // 1062 es el código de error de MySQL para 'Duplicate entry' (ej. DNI repetido)
    if (err.errno === 1062) {
         return NextResponse.json(
             { error: "El cliente ya existe (DNI o CUIL duplicado)." },
             { status: 409 }
         );
    }
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud." },
      { status: 500 }
    );
  }
}