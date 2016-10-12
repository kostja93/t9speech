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

function printResult(fullLength, diff) {
    console.log("Fehleranalyse:");
    console.log("--------------");
    console.log("Zeichen im Teststring: ", fullLength);
    console.log("Falsche Zeichen      : ", diff);
    console.log("Fehler Quote         : ", Math.ceil((diff/fullLength)*1000)/10, '%');
}

learningEvent.on('ready', function () {
    console.log("Ready");

    var testString = learningEvent.learnStrings[0].substr(0, 1000);
    var diff = 0;
    var length = 0;
    for(var j = 0; j < testString.length; j += 100) {
        var string = testString.substr(j, 100);
        inputTree = new InputTreeBuilder(t9LearningTree);
        var t9Input = t9Mapper.charToT9(string);

        for(var i = 0; i < t9Input.length; i++) {
            inputTree.addChars(t9Map[t9Input[i]]);
        }

        var word = inputTree.getWord();
        length += word.length;
        diff   += compareStrings(string, word);
        console.log(".", Math.ceil((j/testString.length)*100));
    }

    if (diff >= 0)
        printResult(length, diff);
    else {
        console.log("Fehler: ", string.length, word);
    }
});