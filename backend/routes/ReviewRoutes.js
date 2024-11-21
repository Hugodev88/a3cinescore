const router = require('express').Router()
const ReviewController = require('../controllers/ReviewController')

const verifyToken = require('../helpers/verify-token')

// C
router.post('/add', verifyToken, ReviewController.addReview)

// R
router.get('/', ReviewController.showReviews)
router.get('/:id', ReviewController.getReviewById)

// U
router.put('/edit/:id', ReviewController.editReview)

// D
router.delete('/delete/:id', ReviewController.deleteReview)

module.exports = router