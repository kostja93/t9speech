'use strict';

class Probability {
    constructor(learnedTree) {
        this.learningTree = learnedTree;
    }

    realProb(string) {
        var probability = 1;

        for(var i = 0; i < string.length; i++) {
            var countZahler = 0;
            var countNenner = 1;
            if(i == 0) {
                countZahler = this.learningTree.getChild(string[i]).count;
                countNenner = this.learningTree.fullCharCount();
            } else if(i == 1) {
                countZahler = this.learningTree.getChild(string[i-1]).getChild(string[i]).count;
                countNenner = this.learningTree.getChild(string[i-1]).count;
            } else {
                countZahler = this.learningTree.getChild(string[i-2]).getChild(string[i-1]).getChild(string[i]).count;
                countNenner = this.learningTree.getChild(string[i-2]).getChild(string[i-1]).count;
            }

            if ( countNenner != 0 )
                probability *= (countZahler/countNenner);
            else
                return -Infinity;
        }

        return probability;
    }

    getChild(treeLeaf, string, position) {
        getChild(position)
    }

    conditionedProbability(string) {
        var condition = this.realProb(string.substr(0, string.length -1)) ;
        return (this.realProb(string) / condition);
    }
}

module.exports = Probability;