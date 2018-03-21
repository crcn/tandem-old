"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWordAtText(text, offset, wordDefinition) {
    var lineStart = offset;
    while (lineStart > 0 && !isNewlineCharacter(text.charCodeAt(lineStart - 1))) {
        lineStart--;
    }
    var offsetInLine = offset - lineStart;
    var lineText = text.substr(lineStart);
    // make a copy of the regex as to not keep the state
    var flags = wordDefinition.ignoreCase ? 'gi' : 'g';
    wordDefinition = new RegExp(wordDefinition.source, flags);
    var match = wordDefinition.exec(lineText);
    while (match && match.index + match[0].length < offsetInLine) {
        match = wordDefinition.exec(lineText);
    }
    if (match && match.index <= offsetInLine) {
        return { start: match.index + lineStart, length: match[0].length };
    }
    return { start: offset, length: 0 };
}
exports.getWordAtText = getWordAtText;
function removeQuotes(str) {
    return str.replace(/["']/g, '');
}
exports.removeQuotes = removeQuotes;
var CR = '\r'.charCodeAt(0);
var NL = '\n'.charCodeAt(0);
function isNewlineCharacter(charCode) {
    return charCode === CR || charCode === NL;
}
var nonEmptyLineRE = /^(?!$)/gm;
/**
 *  wrap text in section tags like <template>, <style>
 *  add leading and trailing newline and optional indentation
 */
function indentSection(text, options) {
    var initialIndent = generateIndent(options);
    return text.replace(nonEmptyLineRE, initialIndent);
}
exports.indentSection = indentSection;
function generateIndent(options) {
    if (options.insertSpaces) {
        return ' '.repeat(options.tabSize);
    }
    else {
        return '\t';
    }
}
//# sourceMappingURL=strings.js.map