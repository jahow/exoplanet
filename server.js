import { startSimulation, handleMessage } from './simulation'

// SETUP
const express = require('express')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const argv = require('minimist')(process.argv)

const bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

// ROUTES
// try static files in the public folder when accessing the root URL
app.use(express.static(path.join(__dirname, '/public')))

// if no static file found, send 404
app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain')
  res.status(404).send('file not found')
})

// SOCKETS
io.on('connection', function (socket) {
  console.log('user ' + socket.id + ' connected')

  socket.on('disconnect', function () {
    console.log('user ' + socket.id + ' disconnected')
  })

  // all messages are handled by the sim
  socket.on('message', msg => {
    handleMessage(msg)
  })
})

// SERVER LAUNCH
var port = parseInt(argv.port) || parseInt(argv.p) || 8080

var server = http.listen(port, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('listening on %s:%s', host, port)

  startSimulation()
})
