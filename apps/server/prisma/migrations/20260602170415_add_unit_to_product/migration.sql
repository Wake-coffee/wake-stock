-- CreateEnum
CREATE TYPE "ProductUnit" AS ENUM ('UNIDAD', 'KG', 'GRAMOS', 'PAQUETE', 'LITRO', 'CAJA');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "unit" "ProductUnit" NOT NULL DEFAULT 'UNIDAD';
