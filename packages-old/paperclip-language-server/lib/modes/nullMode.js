"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NULL_HOVER = {
    contents: []
};
exports.NULL_SIGNATURE = {
    signatures: [],
    activeSignature: 0,
    activeParameter: 0
};
exports.NULL_COMPLETION = {
    isIncomplete: false,
    items: [],
    label: ''
};
exports.nullMode = {
    getId: function () { return ''; },
    onDocumentRemoved: function () { },
    dispose: function () { },
    doHover: function () { return exports.NULL_HOVER; },
    doComplete: function () { return exports.NULL_COMPLETION; },
    doSignatureHelp: function () { return exports.NULL_SIGNATURE; },
    findReferences: function () { return []; }
};
//# sourceMappingURL=nullMode.js.map