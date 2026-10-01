-- CreateTable
CREATE TABLE "receptions" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantityReceived" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "receivedBy" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "receptions" ADD CONSTRAINT "receptions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
