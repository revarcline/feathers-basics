const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

// message service that allows to create new
// and return all existing messages
class MessageService {
  constructor() {
    this.messages = []
  }

  async find () {
    // Just return all our messages
    return this.messages
  }

  async create (data) {
    // the new message is the data merged with a unique id
    // using the message length since it changes whenever we add one
    const message = {
      id: this.messages.length,
      text: data.text
    }

    // add new message to the list
    this.messages.push(message)
    return message
  }
}

const app = express(feathers())

// parse http json bodies
app.use(express.json())
// parse url-encoded params
app.use(express.urlencoded({extended: true}))
// host static files on the current folder
app.use(express.static(__dirname))
// rest api support
app.configure(express.rest())
// configure socket.io real-time apis
app.configure(socketio())
// register an in-memory messages service
app.use('/messages', new MessageService())
// register a nicer error handler than the default express one
app.use(express.errorHandler())

// add any new real-time connection to the 'everybody' channel
app.on('connection', connection => app.channel('everybody').join(connection))

// publish all events to everybody channel
app.publish(data => app.channel('everybody'))


// start the server
app.listen(3030).on('listening', () =>
  console.log('Feathers server listening on localhost:3030')
)

// also a message so the api ain't empty
app.service('messages').create({
  text: 'Hello world from the server'
})
