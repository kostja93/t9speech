'use strict';

class T9Node {
    constructor(parent, char, count, children) {
        this.parent = parent || null;
        this.char = char || "";
        this.children = children || [];
        this.count = count || 1;

        this.prob = 0;
    }

    getChild(char) {
        for(var i in this.children) {
            if (this.children[i].char == char) {
                return this.children[i];
            }
        }

        return new T9Node(this, '', 0);
    }

    addChild(child) {
        var addToChildren = true;

        for(var i in this.children) {
            if (child.char == this.children[i].char) {
                this.children[i].count += child.count;

                child.children.forEach((enkel) => {
                    this.children[i].addChild(enkel);
                });

                addToChildren = false;
            }
        }

        if (addToChildren)
            this.children.push(child);
    }

    word() {
        var before = "";
        if (this.parent) {
            before = this.parent.word();
        }

        return before + this.char;
    }

    probability() {
        return this.prob;
    }

    fullCharCount() {
        var sum = 0;
        for(var i in this.children) {
            sum += this.children[i].count;
        }

        return sum;
    }
    
    deletePath() {
        if (this.parent) {
            this.parent.children = this.parent.children.filter((sibling) => {
                return sibling.char != this.char;
            });

            if(this.parent.children.length == 0)
                this.parent.deletePath();
        }
    }
}

module.exports = T9Node;