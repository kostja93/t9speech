'use strict';

class T9Node {
    constructor(parent, char, children, count) {
        this.parent = parent || null;
        this.char = char || "";
        this.children = children || [];
        this.count = count || 1;
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

    posibillity() {
        var absolute = 0;
        for(var i in this.parent.children) {
            absolute += this.parent.children[i].count;
        }

        return this.count/absolute;
    }
}

module.exports = T9Node;