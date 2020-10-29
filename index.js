const express = require('express');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const uuid = require('uuid')


//server
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname + "/node_modules"))
app.use(express.static(__dirname + "/views"))

const users = [];
const connections = []

//load the html onto the page

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html")
});

//establish the sockets connection
io.on('connection', function (socket) {

    console.log("New User Connected")


    socket.on('username', function (username) {
        socket.username = username
        // console.log(username)
        socket.emit(socket.username)
    })

    // log the message from the front end
    socket.on("chat_message", function (data) {
        console.log("User Message:", data)
        console.log(socket.username)

        // takes the logged messages from the backed and sends them to the front end
        socket.broadcast.emit("new-message", "<strong>" +  socket.username  + "</strong>: " + data);
        socket.emit('new-message', "<strong>" +  socket.username  + "</strong>:  " + data)
       


    })


})


server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT)

});