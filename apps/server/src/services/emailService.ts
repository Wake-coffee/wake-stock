import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInventoryReport(
  pdfBuffer: Buffer,
  recipientEmail: string
): Promise<void> {
  const date = new Date().toLocaleDateString("es-ES");

  try {
    await resend.emails.send({
      from: "Reporte de Inventario <reportes@wakecoffee.es>",
      to: recipientEmail,
      subject: `Reporte de Inventario - ${date}`,
      html: `
        <h2>Reporte de Inventario Mensual</h2>
        <p>Se adjunta el reporte de inventario generado el <strong>${date}</strong>.</p>
        <p>Revisar el archivo PDF adjunto para ver el detalle de todos los productos.</p>
        <br/>
        <p>Generado por: Wake Stock</p>
      `,
      attachments: [
        {
          filename: `Reporte_Inventario_${date.replace(/\//g, "-")}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  } catch (error) {
    console.error("Error enviando reporte por email:", error);
    throw new Error("No se pudo enviar el reporte por email");
  }
}

export async function sendOrderRequestReport(
  pdfBuffer: Buffer,
  recipientEmail: string
): Promise<void> {
  const date = new Date().toLocaleDateString("es-ES");

  try {
    await resend.emails.send({
      from: "Solicitud de Pedidos <reportes@wakecoffee.es>",
      to: recipientEmail,
      subject: `Solicitud de Pedidos - ${date}`,
      html: `
        <h2>Solicitud de Pedidos Diaria</h2>
        <p>Se adjunta la solicitud de pedidos generada el <strong>${date}</strong>.</p>
        <p>Revisar el archivo PDF adjunto para ver el detalle de los productos a pedir.</p>
        <br/>
        <p>Generado por: Wake Stock</p>
      `,
      attachments: [
        {
          filename: `Solicitud_Pedidos_${date.replace(/\//g, "-")}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  } catch (error) {
    console.error("Error enviando solicitud de pedidos por email:", error);
    throw new Error("No se pudo enviar la solicitud de pedidos por email");
  }
}
