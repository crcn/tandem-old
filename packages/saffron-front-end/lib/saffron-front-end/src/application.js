"use strict";
const base_1 = require('saffron-common/src/application/base');
const fragments_1 = require('./fragments');
class BrowserApplication extends base_1.default {
    _registerFragments() {
        super._registerFragments();
        this.fragments.register(...fragments_1.default);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BrowserApplication;
//# sourceMappingURL=application.js.map