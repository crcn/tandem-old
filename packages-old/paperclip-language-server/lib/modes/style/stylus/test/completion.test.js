"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var completion_test_util_1 = require("../../../test-util/completion-test-util");
var completion_item_1 = require("../completion-item");
var setup = {
    langId: 'stylus',
    docUri: 'test://test/test.styl',
    doComplete: function (doc, pos) {
        return completion_item_1.provideCompletionItems(doc, pos);
    }
};
var stylus = completion_test_util_1.testDSL(setup);
suite('Stylus Completion', function () {
    test('basic property', function () {
        (_a = ["back|"], _a.raw = ["back|"], stylus(_a)).has('background');
        (_b = [".back|"], _b.raw = [".back|"], stylus(_b)).hasNo('background');
        (_c = ["\n    .background\n      back|"], _c.raw = ["\n    .background\n      back|"], stylus(_c)).has('background');
        var _a, _b, _c;
    });
    test('variable', function () {
        (_a = ["\n    test-var = red\n    .test-selector\n      color te|"], _a.raw = ["\n    test-var = red\n    .test-selector\n      color te|"], stylus(_a)).has('test-var');
        (_b = ["\n    .test-selector\n      test-var = red\n      color test-var\n    .another-var\n      hehe te|"], _b.raw = ["\n    .test-selector\n      test-var = red\n      color test-var\n    .another-var\n      hehe te|"], stylus(_b)).hasNo('test-var');
        (_c = ["\n    test-var = red\n    .test-selector\n      te|"], _c.raw = ["\n    test-var = red\n    .test-selector\n      te|"], stylus(_c)).hasNo('test-var');
        (_d = ["\n    test-func(n)\n      background n\n    .test-selector\n      te|"], _d.raw = ["\n    test-func(n)\n      background n\n    .test-selector\n      te|"], stylus(_d)).has('test-func');
        var _a, _b, _c, _d;
    });
});
//# sourceMappingURL=completion.test.js.map