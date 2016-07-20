"use strict";
const base_1 = require('./base');
class BaseApplicationService extends base_1.default {
    constructor(app) {
        super();
        this.app = app;
    }
    get bus() {
        return this.app.bus;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseApplicationService;
;
//# sourceMappingURL=base-application-service.js.map