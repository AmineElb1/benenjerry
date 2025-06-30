// server.js

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

const orderRoutes = require('./routes/orderRoutes')

dotenv.config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/orders', orderRoutes)

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Verbonden met MongoDB')
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Server draait op poort ${PORT}`)
  })
})
.catch(err => {
  console.error('❌ MongoDB connectie faalde:', err.message)
})
