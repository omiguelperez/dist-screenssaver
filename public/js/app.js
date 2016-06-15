'use strict'

const socket = io()

let $esfera = $('#esfera')

socket.emit('connected')

socket.on('run', function(position) {
	$esfera.css('display', 'block')
	$esfera.css({
		left: position.left,
		top: position.top
	})
	$esfera.animate({
		'left': '+=130%'
	}, {
		queue: false,
		duration: 4000,
		complete: function() {
			socket.emit('next', {
				top: $esfera.css('top')
			})
      $esfera.css('display', 'none')
		}
	})
})
