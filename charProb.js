var T9Node = require('./src/T9Node');
var Learning = require('./src/Wiki');

var t9LearningTree = new T9Node(null);
new Learning(t9LearningTree);

function getCharCount(leafChar) {
    for(var i in t9LearningTree.children) {
        if (leafChar == t9LearningTree.children[i].char)
            return t9LearningTree.children[i].count;
    }

    return 0;
}

function fullCharCount() {
    var sum = 0;
    for(var i in t9LearningTree.children) {
        sum += t9LearningTree.children[i].count;
    }

    return sum;
}

function calcProbability(string) {
    var prob = (getCharCount(string[0])/fullCharCount());

    if(string.length > 1)
        prob *= calcProbability(string.substr(1));

    return prob;
}

function ConditionedProbability(string) {
    return realProb(string) / realProb(string.substr(0, string.length -1));
}

function realProb(string) {
    var probability = 0;

    for(var i = 2; i < string.length; i++) {
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

        probability += -Math.log(countZahler/countNenner);
    }

    console.log(probability);
}

setTimeout(function () {
    var prob = calcProbability("t");
    console.log(prob);
    prob = calcProbability("z");
    console.log(prob);

    prob = calcProbability("th");
    console.log(prob);

    realProb("Did it ever rain in Steinfurt");
    realProb("Steinfurt");
    realProb("World War");
}, 10000);