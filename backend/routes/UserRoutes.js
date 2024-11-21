const router = require('express').Router()
const ReviewController = require('../controllers/ReviewController')
const UserController = require('../controllers/UserController')

const verifyToken = require('../helpers/verify-token')

// CREATE
router.post('/register', UserController.register)
router.post('/login', UserController.login)

// READ
router.get('/user/:id', UserController.getUserById)
router.get('/:id/reviews', verifyToken, ReviewController.getUserReviews)

// UPDATE
router.patch('/edit/:id', verifyToken, UserController.editUser)

router.get('/checkuser', UserController.checkUser)

module.exports = router