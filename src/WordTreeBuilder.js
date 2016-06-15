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
                this.leafNodes[i].parent.children = this.leafNodes[i].parent.children.filter(filterCond);
            }
            this.leafNodes = this.leafNodes.filter(filterCond);
        }
    }

    getWords() {
        console.log("Amount of leaf notes",this.leafNodes.length);
        var words = [];

        this.leafNodes.forEach(function (node) {
            words.push({message: node.word(), prob: node.probability()});
        });

        return words;
    }
}

module.exports = WordTreeBuilder;