const { Product, ProductImage, ProductOption, Category } = require('../models')

const getProductById = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
        { model: Category, as: 'categories' },
      ],
    })

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' })
    }

    return res.status(200).json(product)
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Erro interno', error: error.message })
  }
}

module.exports = { getProductById }
