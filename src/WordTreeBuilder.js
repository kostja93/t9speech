'use strict';
var Probability = require('./Probability');
var T9Node = require('./T9Node');

class WordTreeBuilder {
    constructor(probabilityTree) {
        this.probabiltiyTree = probabilityTree;
        this.probFct = new Probability(probabilityTree);
        this.inputTreeRoot = new T9Node(null);

        this.leafChars = [];
        this.leafNodes = [];
        this.words = [];
    }

    addChars(leafChars) {
        this.leafChars = leafChars;
        this.leafNodes = [];
        if (leafChars)
            this.traverse(this.inputTreeRoot);

        this.filterLeafs();
    }

    traverse(treeLeaf) {
        if (treeLeaf.children.length <= 0) {
            this.leafChars.forEach((leafChar) => {
                var newLeaf = new T9Node(treeLeaf, leafChar);
                var word = newLeaf.word();
                newLeaf.prob = this.probFct.realProb(word) * this.probFct.conditionedProbability(word);

                treeLeaf.addChild(newLeaf);
                this.leafNodes.push(newLeaf);
            });
        } else {
            treeLeaf.children.forEach(this.traverse.bind(this));
        }
    }

    filterLeafs() {
        var filterCond = function (node) {
            return node.probability() > filterMinProb;
        };

        if (this.leafNodes.length >= 10) {
            this.leafNodes.sort(function (leafA, leafB) {
                return leafB.probability() - leafA.probability();
            });

            var filterMinProb = this.leafNodes[10].probability();
            for(var i = 10; i < this.leafNodes.length; i++) {
                this.leafNodes[i].deletePath();
            }
            this.leafNodes = this.leafNodes.filter(filterCond);
        }
    }

    getWords() {
        this.words = [];
        this.messageString(this.inputTreeRoot);
        this.words.sort(function(wordA, wordB) {
            return wordB.prob - wordA.prob;
        });
        return this.words;
    }

    messageString(t9Tree) {
        if (t9Tree.children.length <= 0)
            this.words.push({message: t9Tree.word(), prob: t9Tree.probability()});
        else
            t9Tree.children.forEach(this.messageString.bind(this));
    }
}

module.exports = WordTreeBuilder;