"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var path = require("path");
var glob = require("glob");
var fs = require("fs");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var vscode_uri_1 = require("vscode-uri");
var javascript_1 = require("./javascript");
var languageModelCache_1 = require("../languageModelCache");
var embeddedSupport_1 = require("../embeddedSupport");
var workspace = path.resolve(__dirname, '../../../test/fixtures/');
var documentRegions = languageModelCache_1.getLanguageModelCache(10, 60, function (document) { return embeddedSupport_1.getDocumentRegions(document); });
var scriptMode = javascript_1.getJavascriptMode(documentRegions, workspace);
suite('integrated test', function () {
    var filenames = glob.sync(workspace + '/**/*.vue');
    var _loop_1 = function (filename) {
        var doc = createTextDocument(filename);
        var diagnostics = scriptMode.doValidation(doc);
        test('validate: ' + path.basename(filename), function () {
            assert(diagnostics.length === 0);
        });
        if (filename.endsWith('app.vue')) {
            var components = scriptMode.findComponents(doc);
            test('props collection', testProps.bind(null, components));
        }
    };
    for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
        var filename = filenames_1[_i];
        _loop_1(filename);
    }
});
function testProps(components) {
    assert.equal(components.length, 4, 'component number');
    var comp = components[0];
    var comp2 = components[1];
    var comp3 = components[2];
    var comp4 = components[3];
    assert.equal(comp.name, 'comp', 'component name');
    assert.equal(comp2.name, 'comp2', 'component name');
    assert.deepEqual(comp.props, [{ name: 'propname' }, { name: 'another-prop' }]);
    assert.deepEqual(comp2.props, [
        { name: 'propname', doc: 'String' },
        { name: 'weird-prop', doc: '' },
        { name: 'another-prop', doc: 'type: Number' }
    ]);
    assert.deepEqual(comp3.props, [{ name: 'inline' }]);
    assert.deepEqual(comp4.props, [{ name: 'inline', doc: 'Number' }]);
}
function createTextDocument(filename) {
    var uri = vscode_uri_1.default.file(filename).toString();
    var content = fs.readFileSync(filename, 'utf-8');
    return vscode_languageserver_types_1.TextDocument.create(uri, 'vue', 0, content);
}
//# sourceMappingURL=test.js.map