require('dotenv').config()

const app = require('./app')
const sequelize = require('./config/database')

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await sequelize.authenticate()

    require('./models')

    await sequelize.sync()
    console.log('Tabelas sincronizadas')
    console.log('Conexão com o banco OK')

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  } catch (error) {
    console.error('Erro ao conectar no banco:', error.message)
  }
}

startServer()
