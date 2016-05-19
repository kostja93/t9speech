'use strict';
var request = require('request');
var cheerio = require('cheerio');
var T9Node = require('./T9Node');

class Wiki {
    constructor(rootNode) {
        this.load();
        this.rootNode = rootNode;

        this.DEPTH = 3;
    }

    prepareString($) {
        var learnString = $('body').text().toString().replace(/(\t)/g, '');
        learnString = learnString.replace(/(\n)/g, ' ');
        learnString = learnString.replace(/( )+/g, ' ');
        learnString = learnString.replace(/[^a-zA-Z0-9 .,]+/g, '');

        return learnString;
    }

    loadLearning(err, res, html) {
        var $ = cheerio.load(html);
        var learnString = this.prepareString($);

        this.learning(learnString);
    }

    learning(learningStr) {
        for(var i = 0; i < (learningStr.length - this.DEPTH); i++) {
            console.log(learningStr.substr(i, this.DEPTH));
            Wiki.traversLearn(this.rootNode, learningStr.substr(i, this.DEPTH));
        }
    }

    static traversLearn(node, learnString) {
        var char = learnString[0];
        var newNode = new T9Node(node, char);
        if (learnString.length != 1) {
            Wiki.traversLearn(newNode, learnString.substr(1));
        }

        node.addChild(newNode);
    }

    load() {
        request("https://en.wikipedia.org/wiki/Celtic_neopaganism", {}, this.loadLearning.bind(this));
    }
}

module.exports = Wiki;