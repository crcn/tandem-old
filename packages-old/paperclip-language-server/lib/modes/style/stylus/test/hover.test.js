"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hover_test_util_1 = require("../../../test-util/hover-test-util");
var stylus_hover_1 = require("../stylus-hover");
var stylus = hover_test_util_1.hoverDSL({
    langId: 'stylus',
    docUri: 'test://test/test.styl',
    doHover: function (doc, pos) {
        return stylus_hover_1.stylusHover(doc, pos);
    }
});
suite('Stylus Hover', function () {
    test('property hover', function () {
        (_a = [".test\n  cu|rsor pointer"], _a.raw = [".test\n  cu|rsor pointer"], stylus(_a)).hasHoverAt('Allows control over cursor appearance in an element', 9);
        (_b = [".test\n  cu|rsor: pointer"], _b.raw = [".test\n  cu|rsor: pointer"], stylus(_b)).hasHoverAt('Allows control over cursor appearance in an element', 9);
        (_c = [".test\n  |cursor: pointer"], _c.raw = [".test\n  |cursor: pointer"], stylus(_c)).hasHoverAt('Allows control over cursor appearance in an element', 9);
        (_d = [".test\n  cursor|: pointer"], _d.raw = [".test\n  cursor|: pointer"], stylus(_d)).hasHoverAt('Allows control over cursor appearance in an element', 9);
        (_e = [".test\n  cursor: p|ointer"], _e.raw = [".test\n  cursor: p|ointer"], stylus(_e)).hasNothing();
        var _a, _b, _c, _d, _e;
    });
});
//# sourceMappingURL=hover.test.js.map