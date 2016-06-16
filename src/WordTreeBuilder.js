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

        this.K = 10;
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
                newLeaf.prob =  this.probFct.realProb(word); //* this.probFct.conditionedProbability(word);

                treeLeaf.addChild(newLeaf);
                this.leafNodes.push(newLeaf);
            });
        } else {
            treeLeaf.children.forEach(this.traverse.bind(this));
        }
    }

    filterLeafs() {
        if (this.leafNodes.length >= this.K) {
            this.leafNodes.sort(WordTreeBuilder.sorting);

            for(var i = this.K; i < this.leafNodes.length; i++) {
                this.leafNodes[i].deletePath();
            }
        }
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