const feathers = require('@feathersjs/feathers')
const app = feathers()

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

//register the message service on the feathers application
app.use('messages', new MessageService())

// log every time a new message has been created
app.service('messages').on('created', message => {
  console.log('A new message has been created', message)
})

// a function that creates new messages and logs existing ones
const main = async () => {
  // create a new message
  await app.service('messages').create({
    text: 'Hello Feathers'
  })

  await app.service('messages').create({
    text: 'Hello again'
  })

  // find existing messages
  const messages = await app.service('messages').find()
  console.log('All messages', messages)
}

main()
