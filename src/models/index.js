const sequelize = require('../config/database')
const User = require('./User')
const Category = require('./Category')
const Product = require('./Product')
const ProductImage = require('./ProductImage')
const ProductOption = require('./ProductOption')

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' })
ProductImage.belongsTo(Product, { foreignKey: 'product_id' })

Product.hasMany(ProductOption, { foreignKey: 'product_id', as: 'options' })
ProductOption.belongsTo(Product, { foreignKey: 'product_id' })

Product.belongsToMany(Category, {
  through: 'product_category',
  foreignKey: 'product_id',
  otherKey: 'category_id',
  as: 'categories',
  timestamps: false,
})
Category.belongsToMany(Product, {
  through: 'product_category',
  foreignKey: 'category_id',
  otherKey: 'product_id',
  as: 'products',
  timestamps: false,
})

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  ProductImage,
  ProductOption,
}
