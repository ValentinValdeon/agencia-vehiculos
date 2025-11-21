import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.query("SELECT 1 + 1 AS result");
    await connection.end();
    console.log("ACA ESTOY");
    return NextResponse.json({
      success: true,
      message: "Conexión exitosa a la base de datos",
      db_result: rows
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error al conectar con la base de datos",
      error: error.message
    }, { status: 500 });
  }
}
