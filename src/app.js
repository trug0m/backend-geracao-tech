const express = require('express')
const userRoutes = require('./routes/userRoutes')
const categoryRoutes = require('./routes/categoryRoutes')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API rodando' })
})

app.use('/v1/user', userRoutes)
app.use('/v1/category', categoryRoutes)

module.exports = app
