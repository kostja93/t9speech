'use strict';

class T9Node {
    constructor(parent, char, count, children) {
        this.parent = parent || null;
        this.char = char || "";
        this.children = children || [];
        this.count = count || 1;
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
        var absolute = 0;
        if (this.parent)
            for(var i in this.parent.children) {
                absolute += this.parent.children[i].count;
            }
        else
            return 1;

        return this.count/absolute;
    }
}

module.exports = T9Node;