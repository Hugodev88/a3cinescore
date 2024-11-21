const router = require('express').Router()
const ReviewController = require('../controllers/ReviewController')
const MovieController = require('../controllers/MovieController')

const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')
 
// C
router.post('/add', verifyToken, imageUpload.single("photo"), MovieController.addMovie)

// R
router.get('/', MovieController.showMovies)
router.get('/:id', MovieController.getMovieById)
router.get('/:id/reviews', ReviewController.getMovieReviews)

// U
router.put('/edit/:id', verifyToken, MovieController.editMovie)

// D
router.delete('/delete/:id', verifyToken, MovieController.deleteMovie)

module.exports = router
    