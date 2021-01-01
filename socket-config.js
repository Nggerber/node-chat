const express = require('express');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(__dirname + "/views"))

io.on('connection', function (socket){

    socket.on('username', function(username){
        socket.username = username
        socket.emit(socket.username)
    })

    socket.on('chat-message', function (data){
        console.log(socket.username)
        console.log("User Message: ", data)

        socket.emit('new-message', "<strong>" + socket.username + "</strong>:  " + data)
        socket.broadcast.emit('new-message', "<strong>" + socket.username + "</strong>:  " + data)

    })

    socket.on('typing', function (data){
        socket.broadcast.emit('typing', data)


    })
})

module.exports  = socket