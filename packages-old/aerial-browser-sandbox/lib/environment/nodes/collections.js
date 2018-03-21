"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
var events_1 = require("../events");
var aerial_common2_1 = require("aerial-common2");
var source_mutation_1 = require("source-mutation");
var base_1 = require("../base");
exports.getSEnvHTMLCollectionClasses = aerial_common2_1.weakMemo(function (context) {
    var SEnvMutationEvent = events_1.getSEnvEventClasses(context).SEnvMutationEvent;
    var _Collection = base_1.getSEnvCollection(context);
    var SEnvStyleSheetList = /** @class */ (function (_super) {
        __extends(SEnvStyleSheetList, _super);
        function SEnvStyleSheetList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvStyleSheetList.prototype.item = function (index) {
            return this[index];
        };
        return SEnvStyleSheetList;
    }(_Collection));
    var SEnvDOMStringMap = /** @class */ (function () {
        function SEnvDOMStringMap() {
        }
        return SEnvDOMStringMap;
    }());
    var SEnvHTMLAllCollection = /** @class */ (function (_super) {
        __extends(SEnvHTMLAllCollection, _super);
        function SEnvHTMLAllCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvHTMLAllCollection.prototype.item = function (nameOrIndex) {
            return this.namedItem(nameOrIndex) || this[nameOrIndex];
        };
        SEnvHTMLAllCollection.prototype.namedItem = function (name) {
            return this.find(function (element) { return element.getAttribute("name") === name; });
        };
        return SEnvHTMLAllCollection;
    }(_Collection));
    var SEnvDOMTokenList = /** @class */ (function (_super) {
        __extends(SEnvDOMTokenList, _super);
        function SEnvDOMTokenList(value, _onChange) {
            var _this = _super.apply(this, value.split(" ")) || this;
            _this._onChange = _onChange;
            return _this;
        }
        SEnvDOMTokenList.prototype.add = function () {
            var token = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                token[_i] = arguments[_i];
            }
            this.push.apply(this, token);
            this._onChange(this.toString());
        };
        SEnvDOMTokenList.prototype.contains = function (token) {
            return this.indexOf(token) !== -1;
        };
        SEnvDOMTokenList.prototype.item = function (index) {
            return this[index];
        };
        SEnvDOMTokenList.prototype.remove = function () {
            var token = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                token[_i] = arguments[_i];
            }
            for (var i = token.length; i--;) {
                var i2 = this.indexOf(token[i]);
                if (i2 !== -1) {
                    this.splice(i, 1);
                }
            }
            this._onChange();
        };
        SEnvDOMTokenList.prototype.toggle = function (token, force) {
            if (this.indexOf(token) === -1) {
                this.add(token);
                return true;
            }
            else {
                this.remove(token);
                return false;
            }
        };
        SEnvDOMTokenList.prototype.toString = function () {
            return this.join(" ");
        };
        return SEnvDOMTokenList;
    }(_Collection));
    var SEnvHTMLCollection = /** @class */ (function (_super) {
        __extends(SEnvHTMLCollection, _super);
        function SEnvHTMLCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvHTMLCollection.prototype.$init = function (target) {
            this._target = target;
            this._stale = true;
            target.addEventListener(SEnvMutationEvent.MUTATION, this.__onChildMutation.bind(this));
            return this;
        };
        SEnvHTMLCollection.prototype.update = function () {
            var _this = this;
            if (this._stale) {
                this._stale = false;
                var diff = source_mutation_1.diffArray(this, Array.prototype.filter.call(this._target.childNodes, function (a) { return a.nodeType === constants_1.SEnvNodeTypes.ELEMENT; }), function (a, b) { return a === b ? 0 : -1; });
                source_mutation_1.eachArrayValueMutation(diff, {
                    insert: function (_a) {
                        var value = _a.value, index = _a.index;
                        _this.splice(index, 0, value);
                    },
                    delete: function (_a) {
                        var index = _a.index;
                        _this.splice(index, 1);
                    },
                    update: function () {
                    }
                });
            }
            return this;
        };
        SEnvHTMLCollection.prototype.namedItem = function (name) {
            return this.find(function (element) { return element.getAttribute("name") === name; });
        };
        SEnvHTMLCollection.prototype.item = function (index) {
            return this[index];
        };
        SEnvHTMLCollection.prototype.__onChildMutation = function (event) {
            if (event.target !== this._target) {
                return;
            }
            this._stale = true;
        };
        return SEnvHTMLCollection;
    }(_Collection));
    var SEnvNodeList = /** @class */ (function (_super) {
        __extends(SEnvNodeList, _super);
        function SEnvNodeList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvNodeList.prototype.item = function (index) {
            return this[index];
        };
        return SEnvNodeList;
    }(_Collection));
    var SEnvNamedNodeMap = /** @class */ (function (_super) {
        __extends(SEnvNamedNodeMap, _super);
        function SEnvNamedNodeMap() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SEnvNamedNodeMap.prototype.getNamedItem = function (name) {
            return this.find(function (attr) { return attr.name === name; });
        };
        SEnvNamedNodeMap.prototype.getNamedItemNS = function (namespaceURI, localName) {
            return null;
        };
        SEnvNamedNodeMap.prototype.item = function (index) {
            return this[index];
        };
        SEnvNamedNodeMap.prototype.removeNamedItem = function (name) {
            var attr = this.getNamedItem(name);
            if (attr) {
                this.splice(this.indexOf(attr), 1);
            }
            return attr;
        };
        SEnvNamedNodeMap.prototype.removeNamedItemNS = function (namespaceURI, localName) {
            return null;
        };
        SEnvNamedNodeMap.prototype.setNamedItem = function (arg) {
            var existing = this.getNamedItem(arg.name);
            if (existing) {
                existing.value = arg.value;
            }
            else {
                this.push(arg);
                this[arg.name] = arg;
            }
            return existing;
        };
        SEnvNamedNodeMap.prototype.setNamedItemNS = function (arg) {
            return null;
        };
        return SEnvNamedNodeMap;
    }(_Collection));
    return {
        SEnvNodeList: SEnvNodeList,
        SEnvDOMTokenList: SEnvDOMTokenList,
        SEnvNamedNodeMap: SEnvNamedNodeMap,
        SEnvDOMStringMap: SEnvDOMStringMap,
        SEnvHTMLCollection: SEnvHTMLCollection,
        SEnvStyleSheetList: SEnvStyleSheetList,
        SEnvHTMLAllCollection: SEnvHTMLAllCollection,
    };
});
//# sourceMappingURL=collections.js.map