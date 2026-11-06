const bcrypt = require('bcrypt')

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

module.exports = { getUserById, createUser, updateUser, deleteUser }
