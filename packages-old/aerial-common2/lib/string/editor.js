"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var struct_1 = require("../struct");
exports.REPLACE = "REPLACE";
exports.createStringMutation = function (startIndex, endIndex, value) {
    if (value === void 0) { value = ""; }
    return ({
        startIndex: startIndex,
        endIndex: endIndex,
        value: value,
        $id: struct_1.generateDefaultId(),
        $type: exports.REPLACE
    });
};
exports.editString = function (input, mutations, offsetMutations) {
    if (offsetMutations === void 0) { offsetMutations = []; }
    var output = input;
    var computedReplacements = [];
    var offsetMutationCount = offsetMutations.length;
    var allMutations = offsetMutations.concat(mutations);
    for (var i = 0, n = mutations.length; i < n; i++) {
        var _a = mutations[i], startIndex = _a.startIndex, endIndex = _a.endIndex, value = _a.value;
        var offsetStartIndex = startIndex;
        var offsetEndIndex = endIndex;
        var invalid = false;
        var insertion = startIndex === endIndex;
        var n2 = i + offsetMutationCount;
        // based on all of the previous edits, calculate where this edit is
        for (var j = 0; j < n2; j++) {
            var _b = allMutations[j], previousStartIndex = _b.startIndex, previousEndIndex = _b.endIndex, previousNewValue = _b.value;
            var prevInsertion = previousStartIndex === previousEndIndex;
            var startIndicesMatch = startIndex === previousStartIndex;
            var endIndicesMatch = endIndex === previousEndIndex;
            // input :  a b c d e f g h i
            // prev  :     ^-------^
            // ✔     :     ^
            var insertBeginning = startIndicesMatch && insertion;
            // input :  a b c d e f g h i
            // prev  :     ^-------^
            // ✔     :             ^
            var insertEnd = endIndicesMatch && insertion;
            // input :  a b c d e f g h i
            // prev  :     ^
            // ✔     :     ^-------^
            var prevInsertBeginning = startIndicesMatch && prevInsertion;
            // input :  a b c d e f g h i
            // prev  :     ^
            // ✔     :     ^-------^
            var prevInsertEnd = endIndicesMatch && prevInsertion;
            var currOrPrevInserting = insertBeginning || insertEnd || prevInsertBeginning || prevInsertEnd;
            // input :  a b c d e f g h i
            // prev  :         ^-------^ 
            // ✔     :     ^-------^
            if (previousStartIndex < endIndex && previousStartIndex > startIndex) {
                offsetEndIndex = offsetEndIndex - (endIndex - previousStartIndex);
            }
            // input :  a b c d e f g h i
            // prev  :   ^-----^
            // ✔     :       ^-------^
            if (previousEndIndex > startIndex && previousEndIndex < endIndex) {
                offsetStartIndex = offsetStartIndex + (previousEndIndex - startIndex);
            }
            // Invalid edit because previous replacement 
            // completely clobbers this one. There's nothing else to edit.
            // input :  a b c d e f g h i 
            // prev  :   ^---------^
            // ✔     :     ^---^
            // ✔     : ^-------------^
            // ✘     :   ^
            // ✘     :             ^
            // ✘     :   ^-----------^
            if (((startIndex >= previousStartIndex && endIndex <= previousEndIndex) ||
                (startIndex < previousStartIndex && endIndex >= previousEndIndex)) && !currOrPrevInserting) {
                invalid = true;
                break;
            }
            // input :  a b c d e f g h
            // prev  :     ^-----^
            // ✔     :       ^-----^
            // ✔     :           ^---^
            // ✔     :               ^-^
            // ✔     : ^-----^
            // ✘     : ^---^
            // ✘     :   ^-^
            // ✘     :     ^
            // input :  a b c d e f g h
            // prev  : ^---^
            // ✔     :   ^---^
            if (previousStartIndex <= startIndex && endIndex > previousStartIndex) {
                var prevValueLengthDelta = previousNewValue.length - (previousEndIndex - previousStartIndex);
                // shift left or right
                offsetStartIndex = Math.max(0, offsetStartIndex + prevValueLengthDelta);
                offsetEndIndex = Math.max(0, offsetEndIndex + prevValueLengthDelta);
            }
        }
        if (!invalid) {
            output = output.substr(0, offsetStartIndex) + value + output.substr(offsetEndIndex);
        }
    }
    return output;
};
//# sourceMappingURL=editor.js.map