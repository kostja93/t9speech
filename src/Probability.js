'use strict';
var Wiki = require('./Wiki');

class Probability {
    constructor(learnedTree) {
        this.learningTree = learnedTree;
    }

    realProb(string) {
        var probability = 0;

        for(var i = 0; i < string.length; i++) {
            var countZahler = 0;
            var countNenner = 1;

            if(i == 0) {
                countZahler = this.learningTree.getChild(string[i]).count;
                countNenner = this.learningTree.fullCharCount();
            } else {
                countZahler = this.getChild(string, i, 0).count;
                countNenner = this.getChild(string, i-1, 0).count;
            }

            if ( countNenner != 0 )
                probability += -Math.log(countZahler/countNenner);
            else
                return Infinity;
        }

        return probability;
    }

    getChild(string, position, depth) {
        depth = depth || 1;
        if (position <= 0 || depth >= 5)
            return this.learningTree.getChild(string[0]);
        return this.getChild(string, position-1, depth+1).getChild(string[position]);
    }

    conditionedProbability(string) {
        var condition = Math.exp(-this.realProb(string.substr(0, string.length -1)));
        var prob = Math.exp(-this.realProb(string));
        return -Math.log( prob / condition);
    }
}

module.exports = Probability;