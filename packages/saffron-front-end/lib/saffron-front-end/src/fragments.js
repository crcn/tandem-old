"use strict";
require('./scss/modules/all.scss');
require('./scss/fonts.scss');
// components
const index_1 = require('./components/root/index');
const index_2 = require('./components/sfn-stage/index');
const index_3 = require('./components/selector-tool/index');
const index_4 = require('./components/drag-select-tool/index');
const index_5 = require('./components/selectable-tool/index');
// entities
const string_1 = require('./entities/string');
const reference_1 = require('./entities/reference');
// tools
const text_1 = require('./tools/text');
const pointer_1 = require('./tools/pointer');
// models
const sfn_file_1 = require('./models/sfn-file');
// services
const tool_1 = require('./services/tool');
const back_end_1 = require('./services/back-end');
const preview_1 = require('./services/preview');
const project_1 = require('./services/project');
const selector_1 = require('./services/selector');
const clipboard_1 = require('./services/clipboard');
const key_binding_1 = require('./services/key-binding');
const root_component_renderer_1 = require('./services/root-component-renderer');
// key bindings
const index_6 = require('./key-bindings/index');
// bundles 
const index_7 = require('./bundles/html/index');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    // components
    index_1.fragment,
    index_2.fragment,
    index_3.fragment,
    index_4.fragment,
    index_5.fragment,
    // entities
    string_1.fragment,
    reference_1.fragment,
    // tools
    text_1.fragment,
    pointer_1.fragment,
    // models
    sfn_file_1.fragment,
    // key bindings
    index_6.fragment,
    // services
    tool_1.fragment,
    back_end_1.fragment,
    project_1.fragment,
    preview_1.fragment,
    selector_1.fragment,
    clipboard_1.fragment,
    key_binding_1.fragment,
    root_component_renderer_1.fragment,
    // bundles
    index_7.fragment
];
//# sourceMappingURL=fragments.js.map