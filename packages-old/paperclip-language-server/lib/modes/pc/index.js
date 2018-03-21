"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scaffoldCompletion_1 = require("./scaffoldCompletion");
function getVueMode() {
    return {
        getId: function () {
            return 'vue';
        },
        doComplete: function (document, position) {
            return scaffoldCompletion_1.doScaffoldComplete();
        },
        onDocumentRemoved: function () { },
        dispose: function () { }
    };
}
exports.getVueMode = getVueMode;
//# sourceMappingURL=index.js.map