const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatorios' })
    }

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(400).json({ message: 'Email ou senha inválidos' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )
    return res.status(200).json({ token })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

const User = require('../models/User')

const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    return res.status(200).json({
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

const createUser = async (req, res) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body
    if (!firstname || !surname || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: 'Todos os campos são obrigatórios' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não conferem' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      firstname,
      surname,
      email,
      password: hashedPassword,
    })

    return res.status(201).json({
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { firstname, surname, email } = req.body

    if (!firstname || !surname || !email) {
      return res
        .status(400)
        .json({ message: 'Todos os campos são obrigatórios' })
    }

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    await user.update({ firstname, surname, email })
    return res.status(204).send()
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    await user.destroy()
    return res.status(204).send()
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

module.exports = {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  generateToken,
}
