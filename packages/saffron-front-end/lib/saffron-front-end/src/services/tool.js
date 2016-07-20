"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const loggable_1 = require('saffron-common/src/decorators/loggable');
const index_1 = require('saffron-common/src/busses/index');
const base_application_service_1 = require('saffron-common/src/services/base-application-service');
const index_2 = require('saffron-common/src/fragments/index');
const sift = require('sift');
let ToolService = class ToolService extends base_application_service_1.default {
    constructor(app) {
        super(app);
        this.app.actors.push(this.toolProxyBus = new index_1.ProxyBus(undefined));
        this.setCurrentTool({
            tool: undefined
        });
    }
    load() {
        const toolFragments = this.app.fragments.queryAll('stage-tools/**');
        const tools = toolFragments.map((toolFragment) => (toolFragment.create(this.app)));
        this.app.setProperties({
            stageTools: tools
        });
        this.setCurrentTool({
            tool: tools.find(sift({ main: true })) || tools[0]
        });
    }
    setCurrentTool({ tool }) {
        this.app.setProperties({
            currentTool: this.toolProxyBus.target = tool
        });
    }
};
ToolService = __decorate([
    loggable_1.default
], ToolService);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolService;
exports.fragment = new index_2.ApplicationServiceFragment('application/services/tool', ToolService);
//# sourceMappingURL=tool.js.map