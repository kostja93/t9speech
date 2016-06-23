var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var T9Node = require('./src/T9Node');
var Learning = require('./src/Wiki');
var t9Map = require('./src/T9Map').map;
var InputTreeBuilder = require('./src/WordTreeBuilder');

var t9LearningTree = new T9Node(null);
var learningEvent = new Learning(t9LearningTree);
var inputTree;

learningEvent.on('ready', function () {
    app.get('/', function(req, res){
        res.sendFile(__dirname + '/public/index.html');
    });

    io.on('connection', function(socket){
        inputTree = new InputTreeBuilder(t9LearningTree);
        console.log("New user");

        socket.on('digitPressed', function (digit) {
            inputTree.addChars(t9Map[digit]);

            inputTree.getWords().forEach(function (word) {
                socket.emit('message', {message: word.message, prob: word.prob});
            });

            inputTree.bestPaths.forEach(function (word) {
                socket.emit('debug', word);
            });

            inputTree.goodNotes.forEach(function (word) {
                socket.emit('debug_2', word);
            });
        });
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
});