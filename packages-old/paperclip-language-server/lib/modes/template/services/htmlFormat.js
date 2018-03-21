"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var js_beautify_1 = require("js-beautify");
var templateHead = '<template>';
var templateTail = '</template>';
function htmlFormat(document, currRange, formattingOptions, config) {
    var _a = getValueAndRange(document, currRange), value = _a.value, range = _a.range;
    defaultHtmlOptions.indent_with_tabs = !formattingOptions.insertSpaces;
    defaultHtmlOptions.indent_size = formattingOptions.tabSize;
    var htmlFormattingOptions = _.assign(defaultHtmlOptions, config.tandem.paperclip.format.defaultFormatterOptions['js-beautify-html'], { end_with_newline: false });
    var beautifiedHtml = js_beautify_1.html(templateHead + value + templateTail, htmlFormattingOptions);
    var wrappedHtml = beautifiedHtml.substring(templateHead.length, beautifiedHtml.length - templateTail.length);
    return [
        {
            range: range,
            newText: wrappedHtml
        }
    ];
}
exports.htmlFormat = htmlFormat;
function getValueAndRange(document, currRange) {
    var value = document.getText();
    var range = currRange;
    if (currRange) {
        var startOffset = document.offsetAt(currRange.start);
        var endOffset = document.offsetAt(currRange.end);
        value = value.substring(startOffset, endOffset);
    }
    else {
        range = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(0, 0), document.positionAt(value.length));
    }
    return { value: value, range: range };
}
var defaultHtmlOptions = {
    brace_style: 'collapse',
    end_with_newline: false,
    indent_char: ' ',
    indent_handlebars: false,
    indent_inner_html: false,
    indent_scripts: 'keep',
    indent_size: 2,
    indent_with_tabs: false,
    max_preserve_newlines: 1,
    preserve_newlines: true,
    unformatted: [
        'area',
        'base',
        'br',
        'col',
        'embed',
        'hr',
        'img',
        'input',
        'keygen',
        'link',
        'menuitem',
        'meta',
        'param',
        'source',
        'track',
        'wbr'
    ],
    wrap_line_length: 0,
    wrap_attributes: 'auto'
    // Wrap attributes to new lines [auto|force|force-aligned|force-expand-multiline] ["auto"]
};
//# sourceMappingURL=htmlFormat.js.map