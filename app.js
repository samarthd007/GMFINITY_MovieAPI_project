require('dotenv').config()
require('express-async-errors')
const morgon = require('morgan')

//express Config
const express = require('express')
const app = express()
const axios = require('axios')
const body_parser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//config
app.use(express.json())
app.use(body_parser.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(morgon('tiny'))
app.use(cors())

//routes
app.get('/', async (req, res) => {
    console.log(`first page`)
    res.send('first page')
})

//Auth Route
const authRoutes = require('./Routers/authRoute')
app.use('/api/v1/auth', authRoutes)

//user route
const userRoute = require('./Routers/userRoute')
app.use('/api/v1/user', userRoute)
//movie router
const movieRouter = require('./Routers/movieRoute')
app.use('/api/v1/movie', movieRouter)

//playlist route
const playlistRoute = require('./Routers/playListRoutes')
app.use('/api/v1/playlist', playlistRoute)

//notfound Route
const notFoundHandler = require('./Middlewares/not-found')
app.use(notFoundHandler)

//errorhandler route
const errorHandler = require('./Middlewares/errorHandlerMiddleware')
app.use(errorHandler)

//DataBase Configuration
const connect = require('./DataBase/connect')

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connect(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening to ${port}...`))
    } catch (error) {
        console.log(error)
    }
}
start()
