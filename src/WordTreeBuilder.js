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
        this.prevLeafs = [];
        this.words = [];

        this.K = 10;
        this.depth = 3;
        this.bestPaths = [];
        this.alsoGoodPaths = [];
        this.goodNotes = [];
    }

    addChars(leafChars) {
        this.leafChars = leafChars;
        this.prevLeafs = this.leafNodes;
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
                var parentProb = 0;
                var condProb = 0;

                if (word.length > this.depth) {
                    word = word.substr(word.length - this.depth);
                    condProb = this.probFct.conditionedProbability(word);
                }
                if (newLeaf.parent) {
                    parentProb = newLeaf.parent.prob;
                }

                newLeaf.prob = parentProb + this.probFct.realProb(word) + condProb;

                if (newLeaf.prob != Infinity && newLeaf != 0) {
                    treeLeaf.addChild(newLeaf);
                    this.leafNodes.push(newLeaf);
                }
            });
        } else {
            treeLeaf.children.forEach(this.traverse.bind(this));
        }
    }

    filterLeafs() {
        this.alsoGoodPaths = [];//this.leafNodes;
        this.bestPaths = [];
        this.leafChars.forEach((char) => {
            var bestPathsForChar = [];
            this.leafNodes.forEach(function (leafNode) {
                if (leafNode.char == char)
                    bestPathsForChar.push(leafNode.word());
            });
            bestPathsForChar.sort(WordTreeBuilder.sorting);
            this.bestPaths.push(bestPathsForChar[0]);
        });

        //this.leafNodes.forEach((node) => {
        //    if (!node.parent) return;
        //
        //    var bestPathsForChar = node.parent.children;
        //    bestPathsForChar.sort(WordTreeBuilder.sorting);
        //    bestPaths.push(bestPathsForChar[0]);
        //});


        if (this.leafNodes.length >= this.K) {
            this.leafNodes.sort(WordTreeBuilder.sorting);
            this.alsoGoodPaths = [];

            for(var i = 0; i < this.K; i++) {
                this.alsoGoodPaths.push(this.leafNodes[i].word());
            }

            for(i = this.K; i < this.leafNodes.length; i++) {
                this.leafNodes[i].deletePath();
            }
        }

        this.goodNotes = [];
        this.alsoGoodPaths.forEach((node) => {
            var inGoodNodes = false;
            this.bestPaths.forEach((leafNode) => {
                if (node == leafNode)
                    inGoodNodes = true;
            });

            if(inGoodNodes) {
                this.goodNotes.push(node);
            }
        });

    }

    getWord() {
        return this.getWords()[0].message;
    }

    getWords() {
        this.words = [];
        this.messageString(this.inputTreeRoot);
        this.words.sort(WordTreeBuilder.sorting);
        return this.words;
    }

    messageString(t9Tree) {
        if (t9Tree.children.length <= 0)
            this.words.push({message: t9Tree.word(), prob: t9Tree.probability()});
        else
            t9Tree.children.forEach(this.messageString.bind(this));
    }

    static sorting(wordA, wordB) {
        return wordA.prob - wordB.prob;
    }
}

module.exports = WordTreeBuilder;