"use strict";
const index_1 = require('saffron-common/src/fragments/index');
const base_application_service_1 = require('saffron-common/src/services/base-application-service');
class TextTool extends base_application_service_1.default {
    constructor(...args) {
        super(...args);
        this.name = 'text';
        this.cursor = 'text';
        this.icon = 'text';
    }
    execute() {
    }
}
exports.TextTool = TextTool;
exports.fragment = new index_1.ApplicationServiceFragment('stage-tools/text', TextTool);
//# sourceMappingURL=text.js.map