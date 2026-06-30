import PDFDocument from "pdfkit";

interface ProductData {
  name: string;
  stock: number;
  unit: string;
}

export async function generateInventoryPDF(
  products: ProductData[],
  userName: string,
  date: Date
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      bufferPages: true,
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Título
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("Reporte de Inventario", { align: "center" })
      .moveDown(0.5);

    // Fecha y usuario
    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`Fecha: ${date.toLocaleDateString("es-ES")}`, { align: "left" })
      .text(`Generado por: ${userName}`)
      .moveDown(1);

    // Tabla header
    const tableTop = doc.y;
    const colWidth = 200;
    const rowHeight = 25;

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Producto", 50, tableTop)
      .text("Stock Actual", 50 + colWidth, tableTop)
      .text("Unidad", 50 + colWidth + 120, tableTop);

    // Línea separadora
    doc
      .moveTo(50, tableTop + 20)
      .lineTo(550, tableTop + 20)
      .stroke();

    let currentY = tableTop + 30;

    // Filas de productos
    doc.font("Helvetica").fontSize(10);
    products.forEach((product) => {
      // Verificar salto de página ANTES de escribir la fila
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      doc.text(product.name, 50, currentY, { width: colWidth });
      doc.text(product.stock.toString(), 50 + colWidth, currentY);
      doc.text(product.unit, 50 + colWidth + 120, currentY);

      currentY += rowHeight;
    });

    // Footer
    doc
      .moveTo(50, currentY + 10)
      .lineTo(550, currentY + 10)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`Total productos: ${products.length}`, 50, currentY + 20, {
        align: "center",
      });

    doc.end();
  });
}

interface OrderRequestProductData {
  name: string;
  stock: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  status: string;
  supplier: {
    name: string;
    phone: string | null;
    email: string | null;
  } | null;
}

export async function generateOrderRequestPDF(
  products: OrderRequestProductData[],
  userName: string,
  date: Date
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      bufferPages: true,
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Título
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("Solicitud de Pedidos", { align: "center" })
      .moveDown(0.5);

    // Fecha y usuario
    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`Fecha: ${date.toLocaleDateString("es-ES")}`, { align: "left" })
      .text(`Generado por: ${userName}`)
      .moveDown(1);

    // Agrupar por proveedor
    const groupedBySupplier = new Map<string | null, OrderRequestProductData[]>();
    products.forEach((product) => {
      const supplierKey = product.supplier?.name || null;
      if (!groupedBySupplier.has(supplierKey)) {
        groupedBySupplier.set(supplierKey, []);
      }
      groupedBySupplier.get(supplierKey)!.push(product);
    });

    const rowHeight = 25;
    let currentY = doc.y;

    // Renderizar cada proveedor
    groupedBySupplier.forEach((supplierProducts, supplierName) => {
      // Verificar salto de página
      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
      }

      // Nombre del proveedor
      if (supplierName) {
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(supplierName)
          .moveDown(0.3);

        // Teléfono y email
        const supplier = supplierProducts[0]!.supplier;
        let contactInfo = "";
        if (supplier?.phone) contactInfo += `Tel: ${supplier.phone}`;
        if (supplier?.email) {
          if (contactInfo) contactInfo += " | ";
          contactInfo += `Email: ${supplier.email}`;
        }
        if (contactInfo) {
          doc
            .font("Helvetica")
            .fontSize(9)
            .text(contactInfo)
            .moveDown(0.3);
        }
      } else {
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text("Sin Proveedor Asignado")
          .moveDown(0.3);
      }

      currentY = doc.y;

      // Headers de tabla
      const tableTop = currentY;
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Producto", 50, tableTop)
        .text("Stock", 150, tableTop)
        .text("Mín", 210, tableTop)
        .text("Máx", 250, tableTop)
        .text("Unidad", 290, tableTop)
        .text("Estado", 350, tableTop)
        .text("A pedir", 420, tableTop);

      // Línea separadora
      doc
        .moveTo(50, tableTop + 18)
        .lineTo(520, tableTop + 18)
        .stroke();

      currentY = tableTop + 28;

      // Filas de productos
      doc.font("Helvetica").fontSize(9);
      supplierProducts.forEach((product) => {
        // Verificar salto de página
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;

          // Repetir headers después del salto
          doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("Producto", 50, currentY)
            .text("Stock", 150, currentY)
            .text("Mín", 210, currentY)
            .text("Máx", 250, currentY)
            .text("Unidad", 290, currentY)
            .text("Estado", 350, currentY)
            .text("A pedir", 420, currentY);

          doc
            .moveTo(50, currentY + 18)
            .lineTo(520, currentY + 18)
            .stroke();

          currentY += 28;
        }

        const toPedir = Math.max(0, product.maxQuantity - product.stock);

        doc.text(product.name, 50, currentY, { width: 95 });
        doc.text(product.stock.toString(), 150, currentY);
        doc.text(product.minQuantity.toString(), 210, currentY);
        doc.text(product.maxQuantity.toString(), 250, currentY);
        doc.text(product.unit, 290, currentY);
        doc.text(product.status, 350, currentY);
        doc.text(toPedir.toString(), 420, currentY);

        currentY += rowHeight;
      });

      // Separador entre proveedores
      doc
        .moveTo(50, currentY + 10)
        .lineTo(520, currentY + 10)
        .stroke();

      currentY += 25;
      doc.moveDown(0.5);
      currentY = doc.y;
    });

    // Footer
    currentY = doc.y;
    doc
      .moveTo(50, currentY)
      .lineTo(520, currentY)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(9)
      .text(`Total productos: ${products.length}`, 50, currentY + 10, {
        align: "center",
      });

    doc.end();
  });
}
