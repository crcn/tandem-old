"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Note: cannot items more than 10 for lexical order
// smaller enum value means higher priority
var Priority;
(function (Priority) {
    Priority[Priority["UserCode"] = 0] = "UserCode";
    Priority[Priority["Library"] = 1] = "Library";
    Priority[Priority["Framework"] = 2] = "Framework";
    Priority[Priority["Platform"] = 3] = "Platform";
})(Priority = exports.Priority || (exports.Priority = {}));
var HTMLTagSpecification = /** @class */ (function () {
    function HTMLTagSpecification(label, attributes) {
        if (attributes === void 0) { attributes = []; }
        this.label = label;
        this.attributes = attributes;
    }
    return HTMLTagSpecification;
}());
exports.HTMLTagSpecification = HTMLTagSpecification;
function collectTagsDefault(collector, tagSet) {
    for (var tag in tagSet) {
        collector(tag, tagSet[tag].label);
    }
}
exports.collectTagsDefault = collectTagsDefault;
function collectAttributesDefault(tag, collector, tagSet, globalAttributes) {
    if (tag) {
        var tags = tagSet[tag];
        if (tags) {
            var attributes = tags.attributes;
            for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
                var attr = attributes_1[_i];
                collector(attr.label, attr.type, attr.documentation);
            }
        }
    }
    globalAttributes.forEach(function (attr) {
        collector(attr.label, attr.type, attr.documentation);
    });
}
exports.collectAttributesDefault = collectAttributesDefault;
function collectValuesDefault(tag, attribute, collector, tagSet, globalAttributes, valueSets) {
    function processAttributes(attributes) {
        for (var _i = 0, attributes_2 = attributes; _i < attributes_2.length; _i++) {
            var attr = attributes_2[_i];
            var label = attr.label;
            if (label !== attribute || !attr.type) {
                continue;
            }
            var typeInfo = attr.type;
            if (typeInfo === 'v') {
                collector(attribute);
            }
            else {
                var values = valueSets[typeInfo];
                if (values) {
                    values.forEach(collector);
                }
            }
        }
    }
    if (tag) {
        var tags = tagSet[tag];
        if (tags) {
            var attributes = tags.attributes;
            if (attributes) {
                processAttributes(attributes);
            }
        }
    }
    processAttributes(globalAttributes);
    // TODO: add custom tag support
    // if (customTags) {
    //   var customTagAttributes = customTags[tag];
    //   if (customTagAttributes) {
    //     processAttributes(customTagAttributes);
    //   }
    // }
}
exports.collectValuesDefault = collectValuesDefault;
function genAttribute(label, type, documentation) {
    return { label: label, type: type, documentation: documentation };
}
exports.genAttribute = genAttribute;
//# sourceMappingURL=common.js.map