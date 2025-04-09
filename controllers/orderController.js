import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Verify products and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      // Calculate item price
      const price = product.discountPrice || product.price;
      totalAmount += price * item.quantity;

      // Add to order items
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    // Add order to user's orders
    const user = await User.findById(req.user._id);
    user.orders.push(order._id);
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name images");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is admin or order belongs to user
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;

    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate("user", "name email")
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.countDocuments({});

    // Total revenue
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent orders
    const recentOrders = await Order.find({})
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
