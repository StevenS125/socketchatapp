var express = require('express')
var bodyParser = require("body-parser")
var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())

var messages = [
    { name: "Steve", message: "Fuck yourself" },
    { name: "Slammy", message: "duck yourself" }
]

app.get('/messages', (req, res) => {
    res.send(messages)
})

app.post('/messages', (req, res) => {
    console.log(req.body)
    res.sendStatus(200)
})

var server = app.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})