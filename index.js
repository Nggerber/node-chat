const { name } = require('ejs');
const express = require('express');
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const managers = {

}



// let toggle = true;

//server
const PORT = process.env.PORT || 3000

app.use(express.static(__dirname + "/node_modules"))
app.use(express.static(__dirname + "/views"))


//load the html onto the page
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html")
})

let managerIndex = 0

//establish the sockets connection
io.on('connection', function (socket) {

    console.log("New User Connected")
    let userSocket = socket.id
    console.log(userSocket)

    socket.on('username', function (username) {
        socket.username = username
        socket.emit(socket.username)
        console.log(username)
    });

    // if (toggle) {

    //     socket.join('room1')
    //     socket.room = "room1"
    //     // users[socket.id] = {
    //     //     room: "room1",
    //     //     username: "Bob"
    //     // }
    // }
    // else {

    //     socket.join('room2')
    //     socket.room = "room2"
    //     // users[socket.id] = {
    //     //     room: "room2",
    //     //     username: "Herb"
    //     // }
    // }

    // toggle = !toggle
    // // 

    socket.on("connect_manager", function () {
        managers[socket.id] = {
            name: socket.username,
            id: socket.id,
            room: socket.id,
            online: true,
        }
        console.log(managers)
        socket.join(socket.id)
        socket.room = socket.id
    });



    socket.on("connect_to_manager", function () {
        console.log(managerIndex, Object.keys(managers).length)
        let managerId = Object.keys(managers)[managerIndex++ % Object.keys(managers).length]
        socket.emit("return-manager-socket-id", managerId)
        socket.join(managerId)
        socket.room = managerId

        // log the message from the front end

    });

    socket.on("leave_chat", function () {
        socket.leave(socket.room)
        delete socket.room
    })

    socket.on("chat_message", function (data) {
        if (socket.room) {
            console.log("User Message:", data)
            console.log(socket.username)
            console.log(socket.room)
            // takes the logged messages from the backed and sends them to the front end
            // socket.broadcast.emit("new-message", "<strong>" + socket.username + "</strong>: " + data);
            // io.to(users[socket.id].room).emit('new-message', "<strong>" + socket.username + "</strong>:  " + data)
            io.to(socket.room).emit('new-message', "<strong>" + socket.username + "</strong>:  " + data)

        }
        // socket.emit('new-message', "<strong>" + socket.username + "</strong>:  " + data)

    });



    // log the message from the front end

    // socket.on("chat_message", function (data) {
    //     console.log("User Message:", data)
    //     console.log(socket.username)

    //     // takes the logged messages from the backed and sends them to the front end
    //     // socket.broadcast.emit("new-message", "<strong>" + socket.username + "</strong>: " + data);
    //     // io.to(users[socket.id].room).emit('new-message', "<strong>" + socket.username + "</strong>:  " + data)
    //     io.to(managerId).emit('new-message', "<strong>" + socket.username + "</strong>:  " + data)

    //     // socket.emit('new-message', "<strong>" + socket.username + "</strong>:  " + data)

    // })

    socket.on('typing', function (data) {
        console.log(data);
        io.to(socket.room).emit('typing', data);

    });

})


server.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT)

});