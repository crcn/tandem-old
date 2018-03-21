"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var elementTags = require("element-helper-json/element-tags.json");
var elementAttributes = require("element-helper-json/element-attributes.json");
exports.elementTagProvider = getExternalTagProvider('element', elementTags, elementAttributes);
function getExternalTagProvider(id, tags, attributes) {
    function findAttributeDetail(tag, attr) {
        return attributes[attr] || attributes[tag + '/' + attr];
    }
    return {
        getId: function () { return id; },
        priority: common_1.Priority.Library,
        collectTags: function (collector) {
            for (var tagName in tags) {
                collector(tagName, tags[tagName].description || '');
            }
        },
        collectAttributes: function (tag, collector) {
            if (!tags[tag]) {
                return;
            }
            var attrs = tags[tag].attributes;
            if (!attrs) {
                return;
            }
            for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
                var attr = attrs_1[_i];
                var detail = findAttributeDetail(tag, attr);
                collector(attr, undefined, (detail && detail.description) || '');
            }
        },
        collectValues: function (tag, attr, collector) {
            if (!tags[tag]) {
                return;
            }
            var attrs = tags[tag].attributes;
            if (!attrs || attrs.indexOf(attr) < 0) {
                return;
            }
            var detail = findAttributeDetail(tag, attr);
            if (!detail || !detail.options) {
                return;
            }
            for (var _i = 0, _a = detail.options; _i < _a.length; _i++) {
                var option = _a[_i];
                collector(option);
            }
        }
    };
}
exports.getExternalTagProvider = getExternalTagProvider;
//# sourceMappingURL=externalTagProviders.js.map