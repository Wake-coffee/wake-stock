import { prisma } from "../src/prisma.js";

async function main() {
  // 1. Limpiar datos existentes
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.checklistReport.deleteMany();

  console.log("🧹 Limpieza de base de datos completa.");

  // Pre-calculated bcrypt hash for password "password123"
  const passwordHash = '$2b$10$5Ka4LowHXma6JCrT8HdSmOwyPMAcCmeIi9CE9c9y6b7SxWnQvbGRm';

  // 2. Crear Usuarios de prueba
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@wake.com",
      password: passwordHash,
      name: "Administrador de Cafetería",
      role: "ADMIN",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: "user@wake.com",
      password: passwordHash,
      name: "Empleado de Cocina",
      role: "USER",
    },
  });

  console.log(
    '👤 Usuarios de prueba creados (password para ambos: "password123").',
  );

  // 3. Crear Proveedores de prueba
  const beFood = await prisma.supplier.create({
    data: {
      name: "beFood",
      notes: "Reparte solo los domingos por la tarde",
      email: "befood@gmail.com",
      phone: "68290011",
    },
  });

  const makro = await prisma.supplier.create({
    data: {
      name: "Makro",
      notes: "Entregas por la mañana, requiere pedido antes de las 18:00",
      email: "contacto@makro.es",
      phone: "912345678",
    },
  });

  console.log("✅ Proveedores creados.");

  // 4. Crear Productos de prueba
  await prisma.product.create({
    data: {
      name: "Pollo",
      status: "DISPONIBLE",
      stock: 10,
      maxQuantity: 10,
      minQuantity: 3,
      durationDays: 10,
      supplierId: beFood.id,
      imageUrl:
        "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80",
    },
  });

  await prisma.product.create({
    data: {
      name: "Salmon",
      status: "BAJO_STOCK",
      stock: 1, // Por debajo del mínimo de 2
      maxQuantity: 8,
      minQuantity: 2,
      durationDays: 10,
      supplierId: beFood.id,
      imageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
    },
  });

  await prisma.product.create({
    data: {
      name: "Huevos",
      status: "AGOTADO",
      stock: 0, // Agotado
      maxQuantity: 30,
      minQuantity: 10,
      durationDays: 15,
      supplierId: makro.id,
      imageUrl:
        "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&q=80",
    },
  });

  await prisma.product.create({
    data: {
      name: "Pastrami",
      status: "DISPONIBLE",
      stock: 5,
      maxQuantity: 5,
      minQuantity: 1,
      durationDays: 12,
      supplierId: makro.id,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    },
  });

  console.log("📦 Productos creados con stock variado.");
  console.log("🌱 Semillado de base de datos completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error en el semillado:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
