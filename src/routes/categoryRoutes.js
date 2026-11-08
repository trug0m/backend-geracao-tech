const express = require('express')
const categoryController = require('../controllers/categoryController')

const router = express.Router()

router.get('/search', categoryController.searchCategories)
router.get('/:id', categoryController.getCategoryById)
router.post('/', categoryController.createCategory)
router.put('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)
module.exports = router
