'use strict'

const port = process.env.PORT || 8080

const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')
const swig = require('swig')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

let sockets = []

server.on('listening', onListening)

io.on('connection', onConnection)

// Configurando la aplicacion
app.use(express.static(path.join(__dirname, 'public')))
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'public', 'views'))

// URLs

app.get('/', function (req, res) {
  res.render('index', {})
})

// Funciones de los event emitters

function onConnection(socket) {
  console.log(`User connected: ${socket.id}`)

  socket.on('conectarse', function () {
    sockets.push({
      id: socket.id,
      socket: socket
    })
    socket.emit('respuesta', {
      datos: 'Se ha guardado en socket'
    })
  })
}

function onListening() {
  console.log(`Server running on port ${port}`)
}

server.listen(port)
