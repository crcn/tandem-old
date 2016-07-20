"use strict";
// components
const index_1 = require('./components/preview/index');
const index_2 = require('./components/origin-stage-tool/index');
// html entities
const root_1 = require('./entities/html/root');
const text_1 = require('./entities/html/text');
const group_1 = require('./entities/html/group');
const block_1 = require('./entities/html/block');
const element_1 = require('./entities/html/element');
const attribute_1 = require('./entities/html/attribute');
// css entities
const style_1 = require('./entities/css/style');
// entity controllers
const import_1 = require('./entity-controllers/import');
const repeat_1 = require('./entity-controllers/repeat');
const template_1 = require('./entity-controllers/template');
// selection
const display_collection_1 = require('./selection/display-collection');
exports.fragment = [
    // components
    index_1.fragment,
    index_2.fragment,
    // entities
    root_1.fragment,
    text_1.fragment,
    group_1.fragment,
    block_1.fragment,
    element_1.fragment,
    attribute_1.fragment,
    style_1.fragment,
    // entity controllers
    import_1.fragment,
    repeat_1.fragment,
    template_1.fragment,
    // selection
    display_collection_1.fragment
];
//# sourceMappingURL=index.js.map