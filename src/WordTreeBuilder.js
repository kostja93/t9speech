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

        this.K = 20;
        this.depth = 4;
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
        if (treeLeaf.children.length <= 0 && treeLeaf.isActive()) {
            this.leafChars.forEach((leafChar) => {
                var newLeaf = new T9Node(treeLeaf, leafChar);
                var word = newLeaf.word();
                var parentProb = 0;
                var condProb = 0;

                if (word.length > this.depth) {
                    word = word.substr(word.length - this.depth);
                    condProb = this.probFct.conditionedProbability(word);
                }

                if (null == treeLeaf.parent) {
                    parentProb = treeLeaf.prob;
                } else {
                    parentProb = this.probFct.realProb(word);
                }

                newLeaf.prob = parentProb + condProb;

                if (newLeaf.prob != Infinity) {
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

        this.leafNodes.forEach((node) => {
            var bestPathsForParent = [];

            if (node.parent.parent) {
                node.parent.children.forEach((sibling) => {
                    bestPathsForParent.push(sibling);
                });
                bestPathsForParent.sort(WordTreeBuilder.sorting);
                this.bestPaths.push(bestPathsForParent[0]);
            }
        });

        if (this.leafNodes.length >= this.K) {
            this.leafNodes.sort(WordTreeBuilder.sorting);
            this.alsoGoodPaths = [];

            for(var i = 0; i < this.K; i++) {
                this.alsoGoodPaths.push(this.leafNodes[i]);
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

            if(!inGoodNodes) {
                node.setInActive();
            }
        });

    }

    getWord() {
        return this.getWords()[0].message;
    }

    getWords() {
        this.words = [];
        //this.messageString(this.inputTreeRoot);
        this.leafNodes.forEach((node) => {
            this.words.push({message: node.word(), prob: node.probability()});
        });
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