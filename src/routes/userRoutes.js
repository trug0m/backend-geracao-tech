const express = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/token', userController.generateToken)
router.get('/:id', userController.getUserById)
router.post('/', userController.createUser)
router.put('/:id', authMiddleware, userController.updateUser)
router.delete('/:id', authMiddleware, userController.deleteUser)

module.exports = router
