import express from 'express';
import { Order, OrderItem, Product } from '../models';
import { OrderStatus } from '../models/Order';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// 获取订单列表
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const where: any = {};
    if (!req.user!.isAdmin) {
      where.userId = req.user!.id;
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch orders' });
  }
});

// 获取单个订单
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const where: any = { id: req.params.id };
    if (!req.user!.isAdmin) {
      where.userId = req.user!.id;
    }

    const order = await Order.findOne({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ detail: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch order' });
  }
});

// 创建订单
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const orderData = req.body;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await Order.create({
      userId: req.user!.id,
      orderNumber,
      status: orderData.status || 'pending',
      totalAmount: orderData.total_amount,
      paymentMethod: orderData.payment_method,
      paymentId: orderData.payment_id,
      shippingAddress: orderData.shipping_address,
      shippingCity: orderData.shipping_city,
      shippingState: orderData.shipping_state,
      shippingPostcode: orderData.shipping_postcode,
      shippingCountry: orderData.shipping_country,
      shippingPhone: orderData.shipping_phone,
      shippingFee: orderData.shipping_fee || 0,
      tax: orderData.tax || 0,
    });

    // 创建订单项目
    if (orderData.items && orderData.items.length > 0) {
      const items = orderData.items.map((item: any) => ({
        orderId: order.id,
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total_price,
      }));

      await OrderItem.bulkCreate(items);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ detail: 'Failed to create order' });
  }
});

// 更新订单状态（仅管理员）
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ detail: 'Order not found' });
    }

    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to update order status' });
  }
});

// 取消订单
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const where: any = { id: req.params.id };
    if (!req.user!.isAdmin) {
      where.userId = req.user!.id;
    }

    const order = await Order.findOne({ where });
    if (!order) {
      return res.status(404).json({ detail: 'Order not found' });
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to cancel order' });
  }
});

export default router;
