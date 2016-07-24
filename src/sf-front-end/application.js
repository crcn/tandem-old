"use strict";
const index_1 = require('saffron-common/src/index');
const index_2 = require('saffron-html-extension/index');
class FrontEnndApplication extends index_1.BaseApplication {
    _registerFragments() {
        super._registerFragments();
        this.fragments.register(index_2.fragment);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FrontEnndApplication;
//# sourceMappingURL=application.js.map