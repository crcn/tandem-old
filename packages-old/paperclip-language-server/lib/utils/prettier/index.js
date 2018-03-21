"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
var strings_1 = require("../strings");
function prettierify(code, filePath, range, initialIndent, formatParams, prettierVSCodeConfig, parser) {
    try {
        var prettier = require('prettier');
        var prettierOptions = getPrettierOptions(prettierVSCodeConfig, parser, filePath);
        var prettierifiedCode = prettier.format(code, prettierOptions);
        return [toReplaceTextedit(prettierifiedCode, range, formatParams, initialIndent)];
    }
    catch (e) {
        console.log('Prettier format failed');
        console.error(e);
        return [];
    }
}
exports.prettierify = prettierify;
function prettierEslintify(code, filePath, range, initialIndent, formatParams, prettierVSCodeConfig, parser) {
    try {
        var prettierEslint = require('prettier-eslint');
        var prettierOptions = getPrettierOptions(prettierVSCodeConfig, parser, filePath);
        var prettierifiedCode = prettierEslint({
            text: code,
            fallbackPrettierOptions: prettierOptions
        });
        return [toReplaceTextedit(prettierifiedCode, range, formatParams, initialIndent)];
    }
    catch (e) {
        console.log('Prettier-Eslint format failed');
        console.error(e);
        return [];
    }
}
exports.prettierEslintify = prettierEslintify;
function getPrettierOptions(prettierVSCodeConfig, parser, filePath) {
    var trailingComma = prettierVSCodeConfig.trailingComma;
    if (trailingComma === true) {
        trailingComma = 'es5';
    }
    else if (trailingComma === false) {
        trailingComma = 'none';
    }
    var prettierOptions = {
        printWidth: prettierVSCodeConfig.printWidth,
        tabWidth: prettierVSCodeConfig.tabWidth,
        singleQuote: prettierVSCodeConfig.singleQuote,
        trailingComma: trailingComma,
        bracketSpacing: prettierVSCodeConfig.bracketSpacing,
        jsxBracketSameLine: prettierVSCodeConfig.jsxBracketSameLine,
        parser: parser,
        semi: prettierVSCodeConfig.semi,
        useTabs: prettierVSCodeConfig.useTabs
    };
    var prettier = require('prettier');
    var prettierrcOptions = prettier.resolveConfig.sync(filePath, { useCache: false });
    if (!prettierrcOptions) {
        return prettierOptions;
    }
    else {
        return _.assign(prettierOptions, prettierrcOptions);
    }
}
function toReplaceTextedit(prettierifiedCode, range, formatParams, initialIndent) {
    if (initialIndent) {
        // Prettier adds newline at the end
        var formattedCode = '\n' + strings_1.indentSection(prettierifiedCode, formatParams);
        return vscode_languageserver_types_1.TextEdit.replace(range, formattedCode);
    }
    else {
        return vscode_languageserver_types_1.TextEdit.replace(range, '\n' + prettierifiedCode);
    }
}
//# sourceMappingURL=index.js.map