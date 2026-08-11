const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Create New Order & Send Order Confirmation Email
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Stock check
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.countInStock < item.qty) {
      return res.status(400).json({ message: `Stock not available for ${item.name}` });
    }
  }

  // Save order to Database
  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    totalPrice,
    isPaid: true,
    paidAt: Date.now(),
  });

  const createdOrder = await order.save();

  // Deduct Inventory Stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.qty },
    });
  }

  // Send Order Success Confirmation Email
  try {
    const itemsListHtml = orderItems
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px;"><img src="${item.image}" width="50" style="border-radius: 8px;"/></td>
          <td style="padding: 8px;">${item.name}</td>
          <td style="padding: 8px;">x${item.qty}</td>
          <td style="padding: 8px; font-weight: bold;">₹${item.price * item.qty}</td>
        </tr>
      `
      )
      .join('');

    await sendEmail({
      email: req.user.email,
      subject: `Order Confirmed! Order #${createdOrder._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10B981;">Thank You for Your Order!</h2>
          <p>Hi ${req.user.name}, your order has been successfully placed.</p>
          <p><strong>Order ID:</strong> ${createdOrder._id}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>

          <h3>Order Items</h3>
          <table style="width: 100%; text-align: left; border-collapse: collapse;">
            <thead>
              <tr style="background: #f4f4f4;">
                <th style="padding: 8px;">Item</th>
                <th style="padding: 8px;">Name</th>
                <th style="padding: 8px;">Qty</th>
                <th style="padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <h3 style="margin-top: 15px;">Total Amount Paid: ₹${totalPrice}</h3>
          <p style="color: #666; font-size: 12px;">Delivery Address: ${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Order email sending failed:', error.message);
  }

  res.status(201).json(createdOrder);
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

module.exports = {
  addOrderItems,
  getMyOrders,
};