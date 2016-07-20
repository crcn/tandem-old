"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const index_1 = require('../object/index');
const observable_1 = require('../decorators/observable');
let Node = class Node extends index_1.default {
    get nextSibling() {
        if (this.parentNode)
            return this;
        var sn = this.parentNode.childNodes;
        return sn[sn.indexOf(this) + 1];
    }
    get previousSibling() {
        if (!this.parentNode)
            return;
        var sn = this.parentNode.childNodes;
        return sn[sn.indexOf(this) - 1];
    }
    flatten(nodes = []) {
        nodes.push(this);
    }
    filter(filter, ret = []) {
        if (filter(this))
            ret.push(this);
    }
    willUnmount() {
        // OVERRIDE ME
    }
    didMount() {
        // OVERRIDE ME
    }
};
Node = __decorate([
    observable_1.default
], Node);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Node;
//# sourceMappingURL=base.js.map