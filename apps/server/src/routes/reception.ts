import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authMiddleware, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router: Router = Router();

// 1. POST /api/receptions → crear nueva recepción (USER y ADMIN)
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { productId, quantityReceived, notes } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!productId || !quantityReceived || quantityReceived <= 0) {
      return res.status(400).json({ error: 'productId y quantityReceived son requeridos y deben ser válidos' });
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Crear la recepción
    const reception = await prisma.reception.create({
      data: {
        productId,
        quantityReceived: parseFloat(String(quantityReceived)),
        notes: notes || null,
        receivedBy: user.name || user.email || 'Usuario',
      },
      include: {
        product: true,
      },
    });

    // Actualizar stock del producto
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: parseFloat(String(quantityReceived)),
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Recepción registrada correctamente',
      reception,
    });
  } catch (error) {
    console.error('❌ Error al crear recepción:', error);
    return res.status(500).json({
      error: 'Error al registrar la recepción',
    });
  }
});

// 2. GET /api/receptions → obtener histórico de recepciones (solo ADMIN)
router.get('/', authMiddleware, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const receptions = await prisma.reception.findMany({
      take: parseInt(String(limit)),
      skip: parseInt(String(offset)),
      include: {
        product: true,
      },
      orderBy: {
        receivedAt: 'desc',
      },
    });

    const total = await prisma.reception.count();

    return res.json({
      receptions,
      total,
      limit: parseInt(String(limit)),
      offset: parseInt(String(offset)),
    });
  } catch (error) {
    console.error('❌ Error al obtener recepciones:', error);
    return res.status(500).json({
      error: 'Error al obtener el histórico de recepciones',
    });
  }
});

// 3. GET /api/receptions/today → obtener recepciones de hoy (USER y ADMIN)
router.get('/today', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const receptions = await prisma.reception.findMany({
      where: {
        receivedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        receivedAt: 'desc',
      },
    });

    return res.json(receptions);
  } catch (error) {
    console.error('❌ Error al obtener recepciones de hoy:', error);
    return res.status(500).json({
      error: 'Error al obtener recepciones de hoy',
    });
  }
});

// 4. GET /api/receptions/:id → obtener detalles de una recepción (solo ADMIN)
router.get('/:id', authMiddleware, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const reception = await prisma.reception.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!reception) {
      return res.status(404).json({ error: 'Recepción no encontrada' });
    }

    return res.json(reception);
  } catch (error) {
    console.error('❌ Error al obtener recepción:', error);
    return res.status(500).json({
      error: 'Error al obtener la recepción',
    });
  }
});

export default router;
