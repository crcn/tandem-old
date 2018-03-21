"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
function toDiagnostic(error) {
    var line = error.line - 1;
    var column = error.column - 1;
    var endLine = error.endLine ? error.endLine - 1 : line;
    var endColumn = error.endColumn ? error.endColumn - 1 : column;
    return {
        range: vscode_languageserver_types_1.Range.create(line, column, endLine, endColumn),
        message: error.message,
        source: 'vue-language-server',
        severity: error.severity === 1 ? vscode_languageserver_types_1.DiagnosticSeverity.Warning : vscode_languageserver_types_1.DiagnosticSeverity.Error
    };
}
function doValidation(document, engine) {
    var rawText = document.getText();
    // skip checking on empty template
    if (rawText.replace(/\s/g, '') === '') {
        return [];
    }
    // TODO: replace the last 11 consecutive spaces
    var text = rawText.replace(/ {10}/, '<template>').replace(/\s{11}$/, '</template>');
    var report = engine.executeOnText(text, document.uri);
    return report.results[0] ? report.results[0].messages.map(toDiagnostic) : [];
}
exports.doValidation = doValidation;
// export function createLintEngine() {
//   return new CLIEngine({
//     useEslintrc: false,
//     ...configs.base,
//     ...configs.recommended
//   });
// }
//# sourceMappingURL=htmlValidation.js.map