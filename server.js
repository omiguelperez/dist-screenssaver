'use strict'

const port = process.env.PORT || 8080

const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')
const swig = require('swig')
const _ = require('underscore')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

let sockets = [], currentSocket

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

  // Un nuevo cliente se ha conectado
  socket.on('connected', function () {
    sockets.push(socket)
    if (sockets.length === 1) {
      currentSocket = socket
      socket.emit('run', {
        left: '-100px',
        top: '50px'
      })
    }
  })

  // Mostrar la pelota en el siguiente cliente
  socket.on('next', function(position) {
    let next = sockets[Math.floor(Math.random() * sockets.length)]
    currentSocket = next
    next.emit('run', {
      left: '-100px',
      top: position.top
    })
  })

  // Un cliente se ha desconectado
  socket.on('disconnect', function() {
    // console.log(`Cliente desconectado: ${socket.id}`)
    sockets = _.without(sockets, socket)
    if (socket == currentSocket) {
      let next = currentSocket = sockets[Math.floor(Math.random() * sockets.length)]
      if (sockets.length) {
        next.emit('run', {
          left: '-100px',
          top: '50px'
        })
      }
    }
  })
}

function onListening() {
  console.log(`Server running on port ${port}`)
}

server.listen(port)
