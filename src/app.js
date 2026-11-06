const express = require('express')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API rodando' })
})

app.use('/v1/user', userRoutes)

module.exports = app
