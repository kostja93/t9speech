'use strict';
var EventEmitter = require('events');
var request = require('request');
var cheerio = require('cheerio');
var T9Node = require('./T9Node');

class Wiki extends EventEmitter{

    constructor(rootNode) {
        super();
        this.load();
        this.rootNode = rootNode;

        this.DEPTH = 5;
        this.documentsCount = 0;

        this.learnStrings = [];

        this.on('done', () => {
            this.documentsCount++;
            if(this.documentsCount == 3) {
                this.emit('ready');
            }
        });
    }

    static prepareString($) {
        var learnString = $('body').text().toString().replace(/(\t)/g, '');
        learnString = learnString.replace(/(\n)/g, ' ');
        learnString = learnString.replace(/( )+/g, ' ');
        learnString = learnString.replace(/[^a-zA-Z0-9 .,]+/g, '');

        return learnString;
    }

    loadLearning(err, res, html) {
        if (err) return null;
        var $ = cheerio.load(html);
        var learnString = Wiki.prepareString($);

        this.learnStrings.push(learnString);
        this.learning(learnString);
    }

    learning(learningStr) {
        for(var i = 0; i < (learningStr.length - this.DEPTH); i++) {
            Wiki.traversLearn(this.rootNode, learningStr.substr(i, this.DEPTH));
        }
        this.emit('done');
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
        request("https://en.wikipedia.org/wiki/World_War_II", {}, this.loadLearning.bind(this));
        request("https://en.wikipedia.org/wiki/Computer_graphics", {}, this.loadLearning.bind(this));
        request("https://en.wikipedia.org/wiki/Mary_Hanford_Ford", {}, this.loadLearning.bind(this));
    }
}

module.exports = Wiki;