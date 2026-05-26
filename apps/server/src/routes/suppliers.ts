import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authMiddleware, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router: Router = Router();

// 1. Obtener todos los proveedores
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json(suppliers);
  } catch (error) {
    console.error('❌ Error al obtener proveedores:', error);
    return res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// 2. Obtener un proveedor por ID
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    return res.json(supplier);
  } catch (error) {
    console.error('❌ Error al obtener proveedor:', error);
    return res.status(500).json({ error: 'Error al obtener proveedor' });
  }
});

// 3. Crear un nuevo proveedor (Solo ADMIN)
router.post('/', authMiddleware, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { name, email, phone, notes, website } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre del proveedor es obligatorio' });
    }

    // Verificar si ya existe un proveedor con el mismo nombre
    const existingSupplier = await prisma.supplier.findUnique({
      where: { name },
    });

    if (existingSupplier) {
      return res.status(400).json({ error: 'Ya existe un proveedor con este nombre' });
    }

    const supplier = await prisma.supplier.create({
      data: { name, email, phone, notes, website },
    });

    return res.status(201).json(supplier);
  } catch (error) {
    console.error('❌ Error al crear proveedor:', error);
    return res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

// 4. Editar un proveedor existente (Solo ADMIN)
router.put('/:id', authMiddleware, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, email, phone, notes, website } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre del proveedor es obligatorio' });
    }

    // Verificar si el proveedor existe
    const supplierExists = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplierExists) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Si se está cambiando el nombre, verificar que no choque con otro proveedor
    if (name !== supplierExists.name) {
      const nameConflict = await prisma.supplier.findUnique({
        where: { name },
      });
      if (nameConflict) {
        return res.status(400).json({ error: 'Ya existe otro proveedor con este nombre' });
      }
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: { name, email, phone, notes, website },
    });

    return res.json(updatedSupplier);
  } catch (error) {
    console.error('❌ Error al actualizar proveedor:', error);
    return res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

// 5. Eliminar un proveedor (Solo ADMIN)
router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Verificar si el proveedor existe
    const supplierExists = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplierExists) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Al eliminar, la relación onDelete: SetNull configurada en el schema
    // automáticamente pondrá a NULL la columna supplierId de los productos asociados.
    await prisma.supplier.delete({
      where: { id },
    });

    return res.json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error al eliminar proveedor:', error);
    return res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});

export default router;
