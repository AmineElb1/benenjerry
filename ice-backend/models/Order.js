const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  flavor: String,
  topping: String,
  status: {
    type: String,
    enum: ['te verwerken', 'verzonden', 'geannuleerd'],
    default: 'te verwerken'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Order', orderSchema)
