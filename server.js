//Загружаем модуль express
const express = require('express')
//Подключаем фреймворк экспресс(создаем объект приложения)
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const createPath = require('./helpers/create-path')

const PORT = 3000

//Начинаем прослушивать подключения на порту 3000
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
    socket.username = 'Anonymous'
    socket.on('send mess', (data) => {
        io.sockets.emit('add mess', {name: data.name, mess: data.mess, className: data.className})
    })


})

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render(createPath('index'))
})