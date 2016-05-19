var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var T9Node = require('./src/T9Node');
var Learning = require('./src/Wiki');
var t9Map = require('./src/T9Map');

var t9InputTree = new T9Node(null);
var t9LearningTree = new T9Node(null);

new Learning(t9LearningTree);

var leafChars = [];
function traverse(treeLeaf) {
    if (treeLeaf.children.length > 0) {
        treeLeaf.children.forEach(traverse);
    } else {
        leafChars.forEach((leafChar) => {
            treeLeaf.addChild(new T9Node(treeLeaf, leafChar));
        });
    }
}

var words = [];
function messageString(t9Tree) {
    if (t9Tree.children.length <= 0)
        words.push({message: t9Tree.word(), prob: t9Tree.possibility()});
    else
        t9Tree.children.forEach(messageString);
}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    console.log("New user");

    socket.on('digitPressed', function (digit) {
        leafChars = t9Map[digit];
        if (leafChars)
            traverse(t9InputTree);

        messageString(t9InputTree);
        words.forEach(function (word) {
            socket.emit('message', word);
        })
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});