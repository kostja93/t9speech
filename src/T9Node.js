class T9Node {
    constructor(parent, char, children, count) {
        this.parent = parent || null;
        this.char = char || "";
        this.children = children || [];
        this.count = count || 1;
    }

    addChild(child) {
        this.children.forEach((kid) => {
            if (kid.char == child.char) {
                kid.count += child.count;
            }
        });
    }
}