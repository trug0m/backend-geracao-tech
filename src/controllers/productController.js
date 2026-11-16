const { Product, ProductImage, ProductOption, Category } = require('../models')
const productInclude = [
  { model: ProductImage, as: 'images' },
  { model: ProductOption, as: 'options' },
  { model: Category, as: 'categories' },
]

const formatProduct = (product) => ({
  id: product.id,
  enabled: product.enabled,
  name: product.name,
  slug: product.slug,
  stock: product.stock,
  description: product.description,
  price: product.price,
  price_with_discount: product.price_with_discount,
  category_ids: product.categories.map((category) => category.id),
  images: product.images.map((image) => ({
    id: image.id,
    content: image.path,
  })),
  options: product.options.map((option) => ({
    id: option.id,
    title: option.title,
    shape: option.shape,
    radius: option.radius,
    type: option.type,
    values: option.values,
  })),
})

const getProductById = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id, {
      include: productInclude,
    })

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' })
    }

    return res.status(200).json(formatProduct(product))
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

const { Op } = require('sequelize')

const searchProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12
    const page = Number(req.query.page) || 1
    const { match } = req.query

    const options = {
      include: productInclude,
      distinct: true,
      where: {},
    }

    if (limit !== -1) {
      options.limit = limit
      options.offset = (page - 1) * limit
    }

    if (match) {
      options.where[Op.or] = [
        { name: { [Op.like]: `%${match}%` } },
        { description: { [Op.like]: `%${match}%` } },
      ]
    }

    const { rows, count } = await Product.findAndCountAll(options)

    return res.status(200).json({
      data: rows.map(formatProduct),
      total: count,
      limit,
      page,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Parâmetros inválidos', error: error.message })
  }
}

const createProduct = async (req, res) => {
  try {
    const {
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
      category_ids,
      options,
    } = req.body

    if (
      !name ||
      !slug ||
      price === undefined ||
      price_with_discount === undefined
    ) {
      return res.status(400).json({
        message:
          'Os campos name, slug, price e price_with_discount são obrigatórios',
      })
    }

    const product = await Product.create({
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
    })

    if (category_ids) {
      await product.setCategories(category_ids)
    }

    if (options) {
      const optionsToCreate = options.map((option) => ({
        ...option,
        product_id: product.id,
      }))
      await ProductOption.bulkCreate(optionsToCreate)
    }

    const created = await Product.findByPk(product.id, {
      include: productInclude,
    })

    return res.status(201).json(formatProduct(created))
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Dados inválidos', error: error.message })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrada' })
    }

    await ProductImage.destroy({ where: { product_id: id } })
    await ProductOption.destroy({ where: { product_id: id } })
    await product.setCategories([])
    await product.destroy()

    return res.status(204).send()
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

module.exports = {
  getProductById,
  createProduct,
  deleteProduct,
  searchProducts,
}
