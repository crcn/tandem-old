"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function format(languageModes, document, formatRange, formattingOptions) {
    var embeddedModeRanges = languageModes.getModesInRange(document, formatRange);
    var embeddedEdits = [];
    embeddedModeRanges.forEach(function (range) {
        if (range.mode && range.mode.format) {
            var edits = range.mode.format(document, range, formattingOptions);
            for (var _i = 0, edits_1 = edits; _i < edits_1.length; _i++) {
                var edit = edits_1[_i];
                embeddedEdits.push(edit);
            }
        }
    });
    return embeddedEdits;
}
exports.format = format;
//# sourceMappingURL=formatting.js.map