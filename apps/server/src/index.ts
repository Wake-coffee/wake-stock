import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.js";
import suppliersRoutes from "./routes/suppliers.js";
import productsRoutes from "./routes/products.js";
import reportsRoutes from "./routes/reports.js";

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de proveedores
app.use("/api/suppliers", suppliersRoutes);

// Rutas de productos
app.use("/api/products", productsRoutes);

// Rutas de reportes
app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.send("Wake Stock Express + Prisma Server Running");
});

// Iniciar servidor localmente (no en serverless de Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

export default app;
