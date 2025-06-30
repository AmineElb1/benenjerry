const Order = require('../models/Order')

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 })
  res.json(orders)
}

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
}

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )
  res.json(order)
}

exports.deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id)
  res.json({ message: 'Order deleted' })
}
