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

io.on('connection', function (socket) {
    console.log("client conected")
    socket.on("cool", function (data) {
        console.log(data)

    })

socket.on("chat_message", function(data){
    console.log("user message", data)
    socket.broadcast.emit("new-message", data);
    socket.emit("new-message", data);
})

    // setInterval(function(){
    //     socket.emit("Greeting", "Hello")



    // },2000)
    // socket.on('username', function (username) {
    //     socket.username = username;
    //     io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    // })

    // socket.on('disconnect', function(username){
    //     io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    // })

    // socket.on('chat_message', function(message) {
    //     io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    // });

})



server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT)

});