"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var embeddedSupport_1 = require("../embeddedSupport");
var defaultTemplate = "\n<div class=\"example\">{{ msg }}</div>\n";
var defaultScript = "\nexport default {\n  data () {\n    return {\n      msg: 'Hello world!'\n    }\n  }\n}";
var defaultStyle = "\n.example {\n  color: red;\n}\n";
function getAllRegions(doc) {
    var startPos = doc.positionAt(0);
    var endPos = doc.positionAt(doc.getText().length);
    return embeddedSupport_1.getDocumentRegions(doc).getLanguageRanges(vscode_languageserver_types_1.Range.create(startPos, endPos));
}
function genAttr(lang) {
    return lang ? " lang=\"" + lang + "\"" : '';
}
function getLangId(block, lang) {
    var mapping = {
        template: 'paperclip',
        script: 'javascript',
        style: 'css'
    };
    return lang || mapping[block];
}
function testcase(description) {
    var contents = {
        template: defaultTemplate,
        script: defaultScript,
        style: defaultStyle
    };
    var langMap = {
        template: '',
        script: '',
        style: ''
    };
    function setBlock(block, str, lang) {
        if (lang === void 0) { lang = ''; }
        contents[block] = str;
        langMap[block] = lang;
    }
    function activeBlocks() {
        return Object.keys(contents).filter(function (b) { return contents[b] !== undefined; });
    }
    function generateContent() {
        var content = '';
        for (var _i = 0, _a = activeBlocks(); _i < _a.length; _i++) {
            var block = _a[_i];
            var startTag = block + genAttr(langMap[block]);
            content += "<" + startTag + ">" + '\n' + contents[block] + '\n' + ("</" + block + ">") + '\n';
        }
        return content;
    }
    return {
        template: function (str, lang) {
            if (lang === void 0) { lang = ''; }
            setBlock('template', str, lang);
            return this;
        },
        style: function (str, lang) {
            if (lang === void 0) { lang = ''; }
            setBlock('style', str, lang);
            return this;
        },
        script: function (str, lang) {
            if (lang === void 0) { lang = ''; }
            setBlock('script', str, lang);
            return this;
        },
        run: function () {
            var content = generateContent();
            var offset = content.indexOf('|');
            if (offset >= 0) {
                content = content.substr(0, offset) + content.substr(offset + 1);
            }
            var doc = vscode_languageserver_types_1.TextDocument.create('test://test/test.vue', 'vue', 0, content);
            test(description, function () {
                var ranges = getAllRegions(doc);
                var blocks = activeBlocks();
                assert.equal(ranges.length, blocks.length * 2 + 1, 'block number mismatch');
                for (var i = 0, l = blocks.length; i < l; i++) {
                    assert.equal(ranges[2 * i].languageId, 'vue', 'block separator mismatch');
                    var langId = getLangId(blocks[i], langMap[blocks[i]]);
                    assert.equal(ranges[2 * i + 1].languageId, langId, 'block lang mismatch');
                }
                if (offset >= 0) {
                    var pos = doc.positionAt(offset);
                    var language = embeddedSupport_1.getDocumentRegions(doc).getLanguageAtPosition(pos);
                    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
                        var block = blocks_1[_i];
                        var content_1 = contents[block];
                        if (content_1 && content_1.indexOf('|') >= 0) {
                            assert.equal(language, getLangId(block, langMap[block]));
                            return;
                        }
                    }
                    assert(false, 'fail to match langauge id');
                }
            });
        }
    };
}
suite('Embedded Support', function () {
    testcase('basic').run();
    testcase('nested template')
        .template("<div><template></template></div>")
        .run();
    testcase('position')
        .template("<div|></div>")
        .run();
    testcase('ill position1')
        .template("<|")
        .run();
    testcase('ill position2')
        .template("<div |")
        .run();
    testcase('ill position3')
        .template("<div class=\"\"|")
        .run();
    testcase('ill position4')
        .template("<div>|")
        .run();
    testcase('ill position5')
        .template("|")
        .run();
    testcase('empty block')
        .style(" ")
        .run();
    testcase('lang')
        .template(".test", 'pug')
        .style('. test { color: red}', 'sass')
        .run();
    testcase('lang attribute')
        .template("<editor lang=\"javascript\"></editor>")
        .run();
    testcase('ill formed template')
        .template("<div><template><span</template></div>")
        .run();
    testcase('ill formed template2')
        .template("<div><template> <span </template></div>")
        .run();
    testcase('ill formed template3')
        .template("<")
        .run();
    testcase('ill formed template4')
        .template("<div class=")
        .run();
    testcase('ill formed template5')
        .template("<div class=></div>")
        .run();
    testcase('ill formed template6')
        .template("<div class=\"\"</div>")
        .run();
    testcase('ill formed template7')
        .template("<div><")
        .run();
    testcase('ill formed template8')
        .template("<div></")
        .run();
    testcase('ill formed template9')
        .script('')
        .style('')
        .template("<div></d")
        .run();
    testcase('ill formed template10')
        .template("<div><template>")
        .run();
    test('oneline style', function () {
        var content = "\n<style lang=\"scss\"></style>\n<script>export default {}</script>\n";
        var doc = vscode_languageserver_types_1.TextDocument.create('test://test/test.vue', 'vue', 0, content);
        var ranges = getAllRegions(doc);
        assert.equal(ranges.length, 3);
        assert.equal(ranges[1].languageId, 'javascript');
    });
});
//# sourceMappingURL=region.test.js.map