var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

mongoose.Promise = Promise


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = 'mongodb://user:user@ds249707.mlab.com:49707/socketchatapp';

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

var messages = [
    { name: 'Tim', message: 'Hi' },
    { name: 'Jane', message: 'Hello' }
]

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })

})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({ name: user }, (err, messages) => {
        res.send(messages)
    })

})

app.post('/messages', async(req, res) => {
    try {
        var message = new Message(req.body)

        var savedMessage = await message.save()

        message.save()
            .then(() => {
                console.log('saved')
                return Message.findOne({ message: 'badword' })
            })
            .then(censored => {
                if (censored) {
                    console.log('censored words found', censored)
                    return Message.remove({ _id: censored.id })
                }
                io.emit('message', req.body)
                res.sendStatus(200)
            })


    } catch (error) {
        res.sendStatus(500)
        return console.error(error)

    } finally {
        console.log('message post called')
    }




})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})