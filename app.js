var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var T9Node = require('./src/T9Node');
var Learning = require('./src/Wiki');
var t9Map = require('./src/T9Map').map;

var t9InputTree = new T9Node(null);
var t9LearningTree = new T9Node(null);

var learningEvent = new Learning(t9LearningTree);

var leafChars = [];
function traverse(treeLeaf) {
    if (treeLeaf.children.length > 0) {
        treeLeaf.children.forEach(traverse);
    } else {
        leafChars.forEach((leafChar) => {
            var newLeaf = new T9Node(treeLeaf, leafChar);
            var word = newLeaf.word();
            newLeaf.prob = realProb(word) * ConditionedProbability(word);
            treeLeaf.addChild(newLeaf);
        });
    }
}

function realProb(string) {
    var probability = 1;

    for(var i = 0; i < string.length; i++) {
        var countZahler = 0;
        var countNenner = 1;
        if(i == 0) {
            countZahler = t9LearningTree.getChild(string[i]).count;
            countNenner = fullCharCount();
        } else if(i == 1) {
            countZahler = t9LearningTree.getChild(string[i-1]).getChild(string[i]).count;
            countNenner = t9LearningTree.getChild(string[i-1]).count;
        } else {
            countZahler = t9LearningTree.getChild(string[i-2]).getChild(string[i-1]).getChild(string[i]).count;
            countNenner = t9LearningTree.getChild(string[i-2]).getChild(string[i-1]).count;
        }

        if ( countNenner != 0 )
            probability *= (countZahler/countNenner);
        else
            return 0;
    }

    return probability;
}

function ConditionedProbability(string) {
    return realProb(string) / realProb(string.substr(0, string.length -1));
}

function fullCharCount() {
    var sum = 0;
    for(var i in t9LearningTree.children) {
        sum += t9LearningTree.children[i].count;
    }

    return sum;
}

var words = [];
function messageString(t9Tree) {
    if (t9Tree.children.length <= 0) {
        var newWord = {message: t9Tree.word(), prob: t9Tree.probability()};
        words.push(newWord);
    }
    else
        t9Tree.children.forEach(messageString);
}

learningEvent.on('ready', function () {
    console.log(realProb("the"));
    console.log(ConditionedProbability("the"));
    console.log(realProb("th"));

    console.log(realProb("Did it ever rain in Steinfurt"));
    console.log(realProb("Steinfurt"));
    console.log(realProb("World War"));

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/public/index.html');
    });

    io.on('connection', function(socket){
        console.log("New user");

        socket.on('digitPressed', function (digit) {
            words = [];
            leafChars = t9Map[digit];
            if (leafChars)
                traverse(t9InputTree);

            messageString(t9InputTree);

            words = words.filter(function (a) {
                return a.prob != 0;
            });
            words.sort(function(a, b) {
                return b.prob - a.prob;
            });
            socket.emit('message', words[0]);
        });
    });

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
});