'use strict'

const socket = io()

socket.emit('conectarse', {})

socket.on('respuesta', function (datos) {
  console.log(datos)
})
