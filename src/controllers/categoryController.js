const Category = require('../models/Category')

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' })
    }
    return res.status(200).json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      use_in_menu: category.use_in_menu,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

const createCategory = async (req, res) => {
  try {
    const { name, slug, use_in_menu } = req.body

    if (!name || !slug) {
      return res
        .status(400)
        .json({ message: 'Os campos name e slug são obrigatórios' })
    }

    const category = await Category.create({
      name,
      slug,
      use_in_menu,
    })

    return res.status(201).json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      use_in_menu: category.use_in_menu,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, slug, use_in_menu } = req.body

    if (!name || !slug) {
      return res
        .status(400)
        .json({ message: 'Os campos name e slug são obrigatórios' })
    }

    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' })
    }

    await category.update({ name, slug, use_in_menu })
    return res.status(204).send()
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' })
    }

    await category.destroy()
    return res.status(204).send()
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

module.exports = {
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
