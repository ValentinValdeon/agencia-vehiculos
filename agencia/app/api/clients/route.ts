import { NextResponse } from "next/server";
import { pool } from "@/lib/db";


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { 
      nombre, apellido, domicilio, localidad, codigo_postal, 
      provincia, telefono, nacimiento, cuil, dni, 
      tipo_dni, mail, estado_civil,
      //campos de conyuge
      conyuge_nombre, conyuge_apellido, conyuge_tipo_dni, conyuge_dni, conyuge_nacimiento
    } = body;

    if (!nombre || !apellido || !dni || !mail ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }
    
    const dni_int = parseInt(dni);
    const codigo_postal_int = parseInt(codigo_postal);

    //si hay DNI de cónyuge, convertirlo, sino NULL
    const conyuge_dni_int = conyuge_dni ? parseInt(conyuge_dni) : null;
    //si conyuge_nacimiento viene vacio, lo pasamos como null
    const conyuge_nac_val = conyuge_nacimiento ? conyuge_nacimiento : null;

    const [result] = await pool.query(
      `INSERT INTO client (
        nombre, apellido, domicilio, localidad, codigo_postal, provincia, 
        telefono, nacimiento, cuil, dni, tipo_dni, mail, estado_civil,
        conyuge_nombre, conyuge_apellido, conyuge_tipo_dni, conyuge_dni, conyuge_nacimiento
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, apellido, domicilio, localidad, codigo_postal_int, provincia, 
        telefono, nacimiento, cuil, dni_int, tipo_dni, mail, estado_civil,
        conyuge_nombre || null, 
        conyuge_apellido || null, 
        conyuge_tipo_dni || null, 
        conyuge_dni_int, 
        conyuge_nac_val
      ]
    );

    return NextResponse.json({
      message: "Cliente registrado exitosamente",
      id: (result as any).insertId
    });

  } catch (err: any) {
    console.error("Error al insertar cliente:", err);
    if (err.errno === 1062) {
         return NextResponse.json(
             { error: "El cliente ya existe (DNI o CUIL duplicado)." },
             { status: 409 }
         );
    }
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM client ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}