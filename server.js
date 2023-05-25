const express = require('express')
const app = express()
const mongoose = require('mongoose')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

app.set('view engine', 'ejs')

const PORT = 3000

mongoose
    .connect('mongodb://127.0.0.1:27017/db')
    .then((res) => console.log('Connected to DB'))
    .catch(err => console.log(err))

require('./passport/init')(passport)

server.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`)
})

connections = []
//Прослушиваем каждое присоединение к приложению
io.sockets.on('connection', (socket) => {
    console.log('New user connected')
    // Добавление нового соединения в массив
    connections.push(socket)
    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1)
        console.log('User disconnected')
    })

    socket.on('send mess', (data) => {
        io.sockets.emit('add mess', {name: data.name, mess: data.mess, className: data.className})
    })
})
app.use(cookieParser())
app.use(bodyParser())
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

app.use(session({secret: "secret"}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

require('./app/routes')(app, passport)

