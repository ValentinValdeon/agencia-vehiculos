import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  // Necesitamos una conexión específica para manejar transacciones
  const connection = await pool.getConnection();

  try {
    const body = await request.json();
    
    const {
      cliente_id,
      vehiculo_id,
      precio_total,
      observaciones,
      fecha,
      pagos
    } = body;

    // 1. Validaciones básicas
    if (!cliente_id || !vehiculo_id || !precio_total || fecha) {
      return NextResponse.json(
            { error: "Faltan datos de la venta" },
            { status: 400 }
        );
    }

    // Definir la fecha de venta: Si viene en el body la usamos, sino usamos la fecha actual
    const fechaVenta = fecha ? new Date(fecha) : new Date();

    // 2. INICIAR TRANSACCIÓN
    await connection.beginTransaction();

    // A. Insertar la Venta (Cabecera) con la FECHA
    const [ventaResult] = await connection.query(
      `INSERT INTO venta (cliente_id, vehiculo_id, precio_total, observaciones, fecha) 
       VALUES (?, ?, ?, ?, ?)`,
      [cliente_id, vehiculo_id, parseFloat(precio_total), observaciones, fechaVenta]
    );
    
    const ventaId = (ventaResult as any).insertId;

    // B. Procesar Pagos

    // --- 1. CHEQUES ---
    if (pagos?.cheques && Array.isArray(pagos.cheques) && pagos.cheques.length > 0) {
      for (const cheq of pagos.cheques) {
        await connection.query(
          `INSERT INTO pago_cheque (venta_id, banco, numero_cheque, monto, fecha_cobro, titular) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [ventaId, cheq.banco, cheq.numero, parseFloat(cheq.monto), cheq.fecha_cobro, cheq.titular]
        );
      }
    }

    // --- 2. FINANCIACIÓN ---
    if (pagos?.financiacion && pagos.financiacion.total_financiado > 0) {
      const fin = pagos.financiacion;
      await connection.query(
        `INSERT INTO pago_financiacion (venta_id, entidad_bancaria, cantidad_cuotas, monto_cuota, total_financiado) 
         VALUES (?, ?, ?, ?, ?)`,
        [ventaId, fin.entidad, fin.cuotas, parseFloat(fin.monto_cuota), parseFloat(fin.total_financiado)]
      );
    }

    // --- 3. USADO (Permuta) ---
    if (pagos?.usado && pagos.usado.cotizacion > 0) {
      const usado = pagos.usado;
      await connection.query(
        `INSERT INTO pago_usado (venta_id, dominio, marca, modelo, anio, cotizacion) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [ventaId, usado.dominio, usado.marca, usado.modelo, usado.anio, parseFloat(usado.cotizacion)]
      );
    }

    // --- 4. DOCUMENTO ---
    if (pagos?.documento && pagos.documento.monto > 0) {
      const doc = pagos.documento;
      await connection.query(
        `INSERT INTO pago_documento (venta_id, fecha_vencimiento, monto) 
         VALUES (?, ?, ?, ?)`,
        [ventaId, doc.fecha_vencimiento, parseFloat(doc.monto), doc.firmante]
      );
      // FALTA COSAS ACA EN EL DOCUMENTO SUPUESTAMENTEEEEEEEEEEEEEEEEEEEEEEEEEEEE
    }

    // C. Confirmar Transacción
    await connection.commit();

    return NextResponse.json({ 
      message: "Venta registrada exitosamente", 
      id: ventaId 
    });

  } catch (error: any) {
    await connection.rollback();
    console.error("Error en transacción de venta:", error);
    return NextResponse.json(
      { error: "Error al procesar la venta: " + error.message }, 
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

// 