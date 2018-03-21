"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aerial_common2_1 = require("aerial-common2");
var events_1 = require("../events");
exports.getSEnvNamedNodeMapClass = aerial_common2_1.weakMemo(function (context) {
    var SEnvEventTarget = events_1.getSEnvEventTargetClass(context);
    return /** @class */ (function () {
        function SEnvNamedNodeMap() {
        }
        SEnvNamedNodeMap.prototype.getNamedItem = function (name) {
            return null;
        };
        SEnvNamedNodeMap.prototype.getNamedItemNS = function (namespaceURI, localName) {
            return null;
        };
        SEnvNamedNodeMap.prototype.item = function (index) {
            return null;
        };
        SEnvNamedNodeMap.prototype.removeNamedItem = function (name) {
            return null;
        };
        SEnvNamedNodeMap.prototype.removeNamedItemNS = function (namespaceURI, localName) {
            return null;
        };
        SEnvNamedNodeMap.prototype.setNamedItem = function (arg) {
            return null;
        };
        SEnvNamedNodeMap.prototype.setNamedItemNS = function (arg) {
            return null;
        };
        return SEnvNamedNodeMap;
    }());
});
//# sourceMappingURL=named-node-map.js.map