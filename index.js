const express = require('express');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)


//server
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname + "/node_modules"))
app.use(express.static(__dirname + "/views"))

//load the html onto the page
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html")
});

//establish the sockets connection
io.on('connection', function (socket) {
    console.log("client conected")
    socket.on("cool", function (data) {
        console.log(data)

    })

    // log the message from the front end
    socket.on("chat_message", function (data) {
        console.log("user message", data)

        // takes the logged messages from the backed and sends them to the front end
        socket.broadcast.emit("new-message", data);
        socket.emit("new-message", data);
    })

})



server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT)

});