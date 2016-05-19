var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var T9Node = require('./src/T9Node');
var Learning = require('./src/Wiki');

var t9InputTree = new T9Node(null);
var t9LearningTree = new T9Node(null);

new Learning(t9LearningTree);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    t9LearningTree;
    console.log("New user");

    socket.on('digitPressed', function (digit) {
        console.log(digit);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});