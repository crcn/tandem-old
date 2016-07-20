"use strict";
class Collection extends Array {
    constructor(properties = undefined) {
        super();
        if (properties) {
            Object.assign(this, properties);
        }
    }
    /**
     * assigns new properties to this collection
     */
    setProperties(properties) {
        Object.assign(this, properties);
    }
    /**
     * pushes items to the end of the array
     */
    push(...items) {
        return this.splice(this.length, 0, ...items).length;
    }
    /**
     * pushes items to the beginning of the array
     */
    unshift(...items) {
        return this.splice(0, 0, ...items).length;
    }
    /**
     * removes an item at the end of the array
     */
    pop() {
        return this.splice(this.length - 1, 1)[0];
    }
    /**
     * removes an item at the beginning of the array
     */
    shift() {
        return this.splice(0, 1)[0];
    }
    /**
     */
    remove(item) {
        var i = this.indexOf(item);
        if (~i)
            this.splice(i, 1);
    }
    /**
     */
    splice(start, deleteCount = 0, ...items) {
        // OVERRIDE ME 
        return super.splice(start, deleteCount, ...items);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Collection;
//# sourceMappingURL=collection.js.map