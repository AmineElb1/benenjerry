// server.js

require('dotenv').config() 

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const orderRoutes = require('./routes/orderRoutes')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/orders', orderRoutes)

console.log('MONGO_URI =', process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Verbonden met MongoDB')
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(` Server draait op poort ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connectie faalde:', err.message)
  })
