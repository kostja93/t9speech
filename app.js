var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var T9Node = require('./src/T9Node');
var Learning = require('./src/Wiki');
var t9Map = require('./src/T9Map').map;
var Probability = require('./src/Probability');

var t9InputTree = new T9Node(null);
var t9LearningTree = new T9Node(null);

var learningEvent = new Learning(t9LearningTree);
var probability;

var leafChars = [];
function traverse(treeLeaf) {
    if (treeLeaf.children.length > 0) {
        treeLeaf.children.forEach(traverse);
    } else {
        leafChars.forEach((leafChar) => {
            var newLeaf = new T9Node(treeLeaf, leafChar);
            var word = newLeaf.word();
            newLeaf.prob = probability.realProb(word) * probability.conditionedProbability(word);

            treeLeaf.addChild(newLeaf);
        });
    }
}

function filter() {
    words.sort(function(a, b) {
        return b.prob - a.prob;
    });

    if (words.length > 10) {
        var minProb = words[9].prob;
        for(var i = 10; i < words.length; i++) {
            words[i].leaf.parent.children = words[i].leaf.parent.children.filter(function(leaf) {
                return leaf.probability() > minProb;
            });
        }
    }
}

var words = [];
function messageString(t9Tree) {
    if (t9Tree.children.length <= 0) {
        var newWord = {message: t9Tree.word(), prob: t9Tree.probability(), leaf: t9Tree};
        words.push(newWord);
    }
    else
        t9Tree.children.forEach(messageString);
}

learningEvent.on('ready', function () {
    probability = new Probability(t9LearningTree);

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/public/index.html');
    });

    io.on('connection', function(socket){
        console.log("New user");

        socket.on('digitPressed', function (digit) {
            words = [];
            var minProb = 3;
            leafChars = t9Map[digit];
            if (leafChars)
                traverse(t9InputTree);

            messageString(t9InputTree);

            words.sort(function(a, b) {
                return b.prob - a.prob;
            });
            if (words.length > 10) {
                minProb = words[9].prob;
                words = words.filter(function (word) {
                    return word.prob > minProb;
                });
            }

            words.forEach(function (word) {
                socket.emit('message', {message: word.message, prob: word.prob});
            });
            socket.emit('message', {message: "MinProb", prob: minProb});
        });
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
});