'use strict';
var request = require('request');
var cheerio = require('cheerio');
var T9Node = require('./T9Node');

class Wiki {
    constructor(rootNode) {
        this.load();
        this.keyMap = require('./T9Map');
        this.rootNode = rootNode;
    }

    prepareString($) {
        var learnString = $('body').text().toString().replace(/(\t)/g, '');
        learnString = learnString.replace(/(\n)/g, ' ');
        learnString = learnString.replace(/( )+/g, ' ');

        return learnString;
    }

    loadLearning(err, res, html) {
        var $ = cheerio.load(html);
        var learnString = this.prepareString($);

        this.learning(learnString);
    }

    learning(learningStr) {
        for(var i = 0; i < learningStr.length; i++) {
            var char = learningStr[i];
            this.rootNode.addChild(new T9Node(this.rootNode, char));
        }
    }

    load() {
        request("https://en.wikipedia.org/wiki/Celtic_neopaganism", {}, this.loadLearning.bind(this));
    }
}

new Wiki();