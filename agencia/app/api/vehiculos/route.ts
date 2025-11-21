import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { patente, marca, modelo, color } = body;

    if (!patente || !marca || !modelo || !color ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `INSERT INTO vehiculo (patente, marca, modelo, color)
       VALUES (?, ?, ?, ?)`,
      [patente, marca, modelo, color]
    );

    return NextResponse.json({
      message: "Vehículo creado",
      id: (result as any).insertId
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
