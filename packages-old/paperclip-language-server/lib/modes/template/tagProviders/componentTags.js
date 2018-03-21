"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
function getComponentTags(components) {
    var tags = {};
    for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
        var comp = components_1[_i];
        var compName = comp.name;
        var props = comp.props ? comp.props.map(function (s) { return common_1.genAttribute(s.name, undefined, s.doc); }) : [];
        tags[compName] = new common_1.HTMLTagSpecification('', props);
    }
    return {
        getId: function () { return 'component'; },
        priority: common_1.Priority.UserCode,
        collectTags: function (collector) { return common_1.collectTagsDefault(collector, tags); },
        collectAttributes: function (tag, collector) {
            common_1.collectAttributesDefault(tag, collector, tags, []);
        },
        collectValues: function (tag, attribute, collector) {
            common_1.collectValuesDefault(tag, attribute, collector, tags, [], {});
        }
    };
}
exports.getComponentTags = getComponentTags;
//# sourceMappingURL=componentTags.js.map