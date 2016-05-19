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

var lastLeaf = null;
function messageString(t9Tree) {
    lastLeaf = t9Tree.count;
    if (t9Tree.children.length <= 0)
        return  t9Tree.char;
    else
        return t9Tree.char + messageString(t9Tree.children[0]);
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

        var message = messageString(t9InputTree);
        socket.emit('message', {message, lastLeaf});
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});