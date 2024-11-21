const express = require('express')
const cors = require('cors')

const UserRoutes = require('./routes/UserRoutes')
const MovieRoutes = require('./routes/MovieRoutes')
const ReviewRoutes = require('./routes/ReviewRoutes')

const app = express()

app.use(express.json())

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

app.use(express.static('public'))

app.use('/', UserRoutes)
app.use('/movies', MovieRoutes)
app.use('/reviews', ReviewRoutes)

app.listen(5000)

module.exports = app;