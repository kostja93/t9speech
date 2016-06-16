var T9Node = require('./src/T9Node');
var Learning = require('./src/Wiki');
var t9Mapper = require('./src/T9Map');
var t9Map = t9Mapper.map;
var InputTreeBuilder = require('./src/WordTreeBuilder');

var t9LearningTree = new T9Node(null);
var learningEvent = new Learning(t9LearningTree);
var inputTree;

function compareStrings(stringA, stringB) {
    var diff = 0;

    if(stringA.length != stringB.length) return -1;

    for(var i = 0; i < stringA.length; i++) {
        if (stringA[i] != stringB[i])
            diff++;
    }

    return diff;
}

function printResult(string, diff) {
    console.log("Fehleranalyse:");
    console.log("--------------");
    console.log("Zeichen im Teststring: ", string.length);
    console.log("Falsche Zeichen      : ", diff);
    console.log("Fehler Quote         : ", Math.ceil((diff/string.length)*100), '%');
    console.log(" ");
    console.log(" ");
    console.log(" ");
}

learningEvent.on('ready', function () {
    console.log("Ready");

    var string = learningEvent.learnStrings[0].substr(0, 10);
    console.log("Starting Analysing");
    inputTree = new InputTreeBuilder(t9LearningTree);
    var t9Input = t9Mapper.charToT9(string);

    for(var i = 0; i < t9Input.length; i++) {
        inputTree.addChars(t9Map[t9Input[i]]);
    }

    var word = inputTree.getWord();
    var diff = compareStrings(string, word);

    if (diff >= 0)
        printResult(string, diff);
    else {
        console.log("Fehler: ", string.length, word);
    }
});