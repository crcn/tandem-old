"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var messages_1 = require("../messages");
var StringMutation = /** @class */ (function (_super) {
    __extends(StringMutation, _super);
    function StringMutation(startIndex, endIndex, value) {
        if (value === void 0) { value = ""; }
        var _this = _super.call(this, StringMutation.REPLACE) || this;
        _this.startIndex = startIndex;
        _this.endIndex = endIndex;
        _this.value = value;
        return _this;
    }
    StringMutation.prototype.paramsToString = function () {
        return [this.startIndex, this.endIndex, this.value].join(", ");
    };
    StringMutation.REPLACE = 'replace';
    return StringMutation;
}(messages_1.Mutation));
exports.StringMutation = StringMutation;
var StringEditor = /** @class */ (function () {
    function StringEditor(input) {
        this.input = input;
        this._position = 0;
        this._output = input;
    }
    StringEditor.prototype.applyMutations = function (mutations) {
        var output = this.input;
        var computedReplacements = [];
        for (var i = 0, n = mutations.length; i < n; i++) {
            var _a = mutations[i], startIndex = _a.startIndex, endIndex = _a.endIndex, value = _a.value;
            var offsetStartIndex = startIndex;
            var offsetEndIndex = endIndex;
            var invalid = false;
            var insertion = startIndex === endIndex;
            // based on all of the previous edits, calculate where this edit is
            for (var j = 0; j < i; j++) {
                var _b = mutations[j], previousStartIndex = _b.startIndex, previousEndIndex = _b.endIndex, previousNewValue = _b.value;
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
    return StringEditor;
}());
exports.StringEditor = StringEditor;
//# sourceMappingURL=editor.js.map