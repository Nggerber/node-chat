// create the connection to the local host
let socket = io.connect('http://localhost:3000');


let username = prompt('What would you like your username');
let role = prompt("what is your role")

socket.emit('username', username);

$('form').submit(function (e) {

    // prevents page reloading
    e.preventDefault();

    //send the chat message to the backend
    socket.emit('chat_message', $('#txt').val());
    $('#txt').val('');
    return false;
});

//button that allows user to connect with manager
$("#manager-btn").on("click", function () {
    console.log("Connect to manager")
    socket.emit("connect_to_manager")
    socket.on("return-manager-socket-id", function (data) {
        console.log(data)
    });

});

//socket to emit when manager has connected
$("#manager-connect").on("click", function () {
    if (role === "m") {
        socket.emit("connect_manager")
        console.log("manager connected")
    }
    else {
        console.log("You are not a manager")
    }

});

$("#leave-chat").on("click", function () {
    console.log("click")
    socket.emit("leave_chat")
})


// append the chat text message
socket.on('new-message', function (data) {
    let chatbubble = $('<p>')
    chatbubble.addClass("chat-bubble")
    $('#messages').prepend(chatbubble.html(data));
});

socket.on("socket-d", function (data) {
    console.log(data)
})

var timeout;
let typing = false

function timeoutFunction() {
    typing = false;
    socket.emit("typing", false);
}

$('.input-messages').keyup(function () {
    typing = true;
    socket.emit('typing', username + ' is typing...');
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);
});

socket.on('typing', function (data) {
    if (data) {
        $('.typing').html(data);
    } else {
        $('.typing').html("");
    }
});

