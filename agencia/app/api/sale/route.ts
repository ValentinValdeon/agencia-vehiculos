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
    if (!cliente_id || !vehiculo_id || !precio_total) {
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
         VALUES (?, ?, ?)`,
        [ventaId, doc.fecha_vencimiento, parseFloat(doc.monto)]
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

export async function GET() {
  const connection = await pool.getConnection();

  try {
    // Traer todas las ventas con cliente y vehículo
    const [ventasRows] = await connection.query(
      `
      SELECT 
        v.id,
        v.fecha,
        v.precio_total,
        v.observaciones,
        c.id AS cliente_id,
        c.nombre AS cliente_nombre,
        c.apellido AS cliente_apellido,
        c.dni AS cliente_dni,
        vh.id AS vehiculo_id,
        vh.dominio AS vehiculo_patente,
        vh.marca AS vehiculo_marca,
        vh.modelo AS vehiculo_modelo
      FROM venta v
      LEFT JOIN client c ON v.cliente_id = c.id
      LEFT JOIN vehiculo vh ON v.vehiculo_id = vh.id
      ORDER BY v.fecha DESC
      `
    );

    const ventas = ventasRows as any[];

    // Si no hay ventas, devolver lista vacía
    if (ventas.length === 0) {
      return NextResponse.json([]);
    }

    // Armar pagos para cada venta
    for (const venta of ventas) {
      const ventaId = venta.id;

      const [cheques] = await connection.query(
        "SELECT * FROM pago_cheque WHERE venta_id = ?",
        [ventaId]
      );

      const [financiacion] = await connection.query(
        "SELECT * FROM pago_financiacion WHERE venta_id = ?",
        [ventaId]
      );

      const [usado] = await connection.query(
        "SELECT * FROM pago_usado WHERE venta_id = ?",
        [ventaId]
      );

      const [documento] = await connection.query(
        "SELECT * FROM pago_documento WHERE venta_id = ?",
        [ventaId]
      );

      // Agregar los pagos al objeto
      venta.pagos = {
        cheques,
        financiacion: (financiacion as any[]).length > 0 ? (financiacion as any[])[0] : null,
        usado: (usado as any[]).length > 0 ? (usado as any[])[0] : null,
        documento: (documento as any[]).length > 0 ? (documento as any[])[0] : null
      };
    }

    return NextResponse.json(ventas);

  } catch (error: any) {
    console.error("Error al obtener ventas:", error);
    return NextResponse.json(
      { error: "Error al obtener ventas: " + error.message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

// 
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const connection = await pool.getConnection();

//   try {
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json({ error: "ID de venta no proporcionado" }, { status: 400 });
//     }

//     // Buscar la venta principal
//     const [ventaRows] = await connection.query(
//       `
//       SELECT 
//         v.id,
//         v.cliente_id,
//         v.vehiculo_id,
//         v.precio_total,
//         v.observaciones,
//         v.fecha,
//         c.nombre AS cliente_nombre,
//         c.apellido AS cliente_apellido,
//         c.dni AS cliente_dni,
//         vh.patente AS vehiculo_patente,
//         vh.marca AS vehiculo_marca,
//         vh.modelo AS vehiculo_modelo
//       FROM venta v
//       LEFT JOIN cliente c ON v.cliente_id = c.id
//       LEFT JOIN vehiculo vh ON v.vehiculo_id = vh.id_vehiculo
//       WHERE v.id = ?
//       `,
//       [id]
//     );

//     if ((ventaRows as any[]).length === 0) {
//       return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
//     }

//     const venta = (ventaRows as any[])[0];

//     // Cheques
//     const [cheques] = await connection.query<any[]>(
//       "SELECT * FROM pago_cheque WHERE venta_id = ?",
//       [id]
//     );

//     // Financiación
//     const [financiacion] = await connection.query<any[]>(
//       "SELECT * FROM pago_financiacion WHERE venta_id = ?",
//       [id]
//     );

//     // Usado
//     const [usado] = await connection.query<any[]>(
//       "SELECT * FROM pago_usado WHERE venta_id = ?",
//       [id]
//     );

//     // Documento
//     const [documento] = await connection.query<any[]>(
//       "SELECT * FROM pago_documento WHERE venta_id = ?",
//       [id]
//     );

//     // Armar respuesta final
//     const respuesta = {
//       venta: {
//         id: venta.id,
//         fecha: venta.fecha,
//         precio_total: venta.precio_total,
//         observaciones: venta.observaciones
//       },
//       cliente: {
//         id: venta.cliente_id,
//         nombre: venta.cliente_nombre,
//         apellido: venta.cliente_apellido,
//         dni: venta.cliente_dni
//       },
//       vehiculo: {
//         id: venta.vehiculo_id,
//         patente: venta.vehiculo_patente,
//         marca: venta.vehiculo_marca,
//         modelo: venta.vehiculo_modelo
//       },
//       pagos: {
//         cheques,
//         financiacion: financiacion.length > 0 ? financiacion[0] : null,
//         usado: usado.length > 0 ? usado[0] : null,
//         documento: documento.length > 0 ? documento[0] : null
//       }
//     };

//     return NextResponse.json(respuesta);

//   } catch (error: any) {
//     console.error("Error al obtener venta:", error);
//     return NextResponse.json(
//       { error: "Error al obtener la venta: " + error.message },
//       { status: 500 }
//     );
//   } finally {
//     connection.release();
//   }
// }