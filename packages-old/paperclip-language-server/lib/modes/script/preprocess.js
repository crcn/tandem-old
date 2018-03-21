"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var path = require("path");
var embeddedSupport_1 = require("../embeddedSupport");
var vscode_languageserver_types_1 = require("vscode-languageserver-types");
function isVue(filename) {
    return path.extname(filename) === '.vue';
}
exports.isVue = isVue;
function parseVue(text) {
    var doc = vscode_languageserver_types_1.TextDocument.create('test://test/test.vue', 'vue', 0, text);
    var regions = embeddedSupport_1.getDocumentRegions(doc);
    var script = regions.getEmbeddedDocumentByType('script');
    return script.getText() || 'export default {};';
}
exports.parseVue = parseVue;
function isTSLike(scriptKind) {
    return scriptKind === ts.ScriptKind.TS || scriptKind === ts.ScriptKind.TSX;
}
function createUpdater() {
    var clssf = ts.createLanguageServiceSourceFile;
    var ulssf = ts.updateLanguageServiceSourceFile;
    return {
        createLanguageServiceSourceFile: function (fileName, scriptSnapshot, scriptTarget, version, setNodeParents, scriptKind) {
            var sourceFile = clssf(fileName, scriptSnapshot, scriptTarget, version, setNodeParents, scriptKind);
            // store scriptKind info on sourceFile
            var hackSourceFile = sourceFile;
            hackSourceFile.__scriptKind = scriptKind;
            if (isVue(fileName) && !isTSLike(scriptKind)) {
                modifyPaperclipSource(sourceFile);
            }
            return sourceFile;
        },
        updateLanguageServiceSourceFile: function (sourceFile, scriptSnapshot, version, textChangeRange, aggressiveChecks) {
            var hackSourceFile = sourceFile;
            var scriptKind = hackSourceFile.__scriptKind;
            sourceFile = hackSourceFile = ulssf(sourceFile, scriptSnapshot, version, textChangeRange, aggressiveChecks);
            if (isVue(sourceFile.fileName) && !isTSLike(scriptKind)) {
                modifyPaperclipSource(sourceFile);
            }
            hackSourceFile.__scriptKind = scriptKind;
            return sourceFile;
        }
    };
}
exports.createUpdater = createUpdater;
function modifyPaperclipSource(sourceFile) {
    var exportDefaultObject = sourceFile.statements.find(function (st) {
        return st.kind === ts.SyntaxKind.ExportAssignment &&
            st.expression.kind === ts.SyntaxKind.ObjectLiteralExpression;
    });
    if (exportDefaultObject) {
        // 1. add `import Vue from 'vue'
        //    (the span of the inserted statement must be (0,0) to avoid overlapping existing statements)
        var setZeroPos = getWrapperRangeSetter({ pos: 0, end: 0 });
        var vueImport = setZeroPos(ts.createImportDeclaration(undefined, undefined, setZeroPos(ts.createImportClause(ts.createIdentifier('__pcEditorBridge'), undefined)), setZeroPos(ts.createLiteral('vue-editor-bridge'))));
        var statements = sourceFile.statements;
        statements.unshift(vueImport);
        // 2. find the export default and wrap it in `__pcEditorBridge(...)` if it exists and is an object literal
        // (the span of the function construct call and *all* its members must be the same as the object literal it wraps)
        var objectLiteral = exportDefaultObject.expression;
        var setObjPos = getWrapperRangeSetter(objectLiteral);
        var vue = ts.setTextRange(ts.createIdentifier('__pcEditorBridge'), {
            pos: objectLiteral.pos,
            end: objectLiteral.pos + 1
        });
        exportDefaultObject.expression = setObjPos(ts.createCall(vue, undefined, [objectLiteral]));
        setObjPos(exportDefaultObject.expression.arguments);
    }
}
/** Create a function that calls setTextRange on synthetic wrapper nodes that need a valid range */
function getWrapperRangeSetter(wrapped) {
    return function (wrapperNode) { return ts.setTextRange(wrapperNode, wrapped); };
}
//# sourceMappingURL=preprocess.js.map