const express = require('express')
const productController = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/search', productController.searchProducts)
router.get('/:id', productController.getProductById)
router.post('/', authMiddleware, productController.createProduct)
router.delete('/:id', authMiddleware, productController.deleteProduct)

module.exports = router
