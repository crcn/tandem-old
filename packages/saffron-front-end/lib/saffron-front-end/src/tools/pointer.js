"use strict";
const base_application_service_1 = require('saffron-common/src/services/base-application-service');
const index_1 = require('saffron-front-end/src/actions/index');
const index_2 = require('saffron-common/src/fragments/index');
class PointerTool extends base_application_service_1.default {
    constructor(...args) {
        super(...args);
        this.name = 'pointer';
        this.main = true;
        this.icon = 'cursor';
    }
    stageCanvasMouseDown() {
        this.bus.execute(new index_1.SelectAction());
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PointerTool;
exports.fragment = new index_2.ApplicationServiceFragment('stage-tools/pointer', PointerTool, 99);
//# sourceMappingURL=pointer.js.map