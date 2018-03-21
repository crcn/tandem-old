"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var treeMemoKey = Symbol();
exports.getVMObjectTree = function (target, parent) {
    var tree = target[treeMemoKey] && target[treeMemoKey].target === target ? target[treeMemoKey] : new VMTree(target);
    if (parent) {
        tree.$$parent = parent;
    }
    return target[treeMemoKey] = tree;
};
var VMTree = /** @class */ (function () {
    function VMTree(target) {
        var _this = this;
        this._target = target;
        if (target.childNodes) {
            this._children = target.childNodes.map(function (child) { return exports.getVMObjectTree(child, _this); });
        }
        if (target.shadow) {
            this._shadow = exports.getVMObjectTree(target.shadow, this);
        }
    }
    VMTree.prototype.flatten = function () {
        if (this._flattened) {
            return this._flattened;
        }
        this._flattened = [this];
        if (this._shadow) {
            (_a = this._flattened).push.apply(_a, this._shadow.flatten());
        }
        if (this._children) {
            for (var i = 0, length_1 = this._children.length; i < length_1; i++) {
                (_b = this._flattened).push.apply(_b, this._children[i].flatten());
            }
        }
        return this._flattened;
        var _a, _b;
    };
    VMTree.prototype.getNestedTreeById = function (id) {
        return this.flatten().find(function (tree) { return tree._target.id === id; });
    };
    Object.defineProperty(VMTree.prototype, "shadow", {
        get: function () {
            return this._shadow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VMTree.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VMTree.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VMTree.prototype, "parent", {
        get: function () {
            return this.$$parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VMTree.prototype, "path", {
        get: function () {
            var current = this;
            var parent = this.$$parent;
            var path = [];
            while (parent) {
                if (parent.shadow === current) {
                    path.unshift("shadow");
                }
                else {
                    path.unshift(parent._children.indexOf(current));
                }
                current = parent;
                parent = parent.$$parent;
            }
            return path;
        },
        enumerable: true,
        configurable: true
    });
    return VMTree;
}());
//# sourceMappingURL=tree.js.map