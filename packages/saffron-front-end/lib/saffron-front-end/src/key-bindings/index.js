"use strict";
const index_1 = require('saffron-common/src/fragments/index');
const index_2 = require('saffron-common/src/actors/index');
exports.fragment = [
    new index_1.ClassFactoryFragment('key-bindings/zoom-in', class ZoomInKeyBindingActor extends index_2.BaseActor {
        constructor(...args) {
            super(...args);
            this.key = 'meta+=';
        }
        execute() {
            this.bus.execute({ type: 'zoomIn' });
        }
    }
    ),
    new index_1.ClassFactoryFragment('key-bindings/zoom-out', class ZoomOutKeyBindingActor extends index_2.BaseActor {
        constructor(...args) {
            super(...args);
            this.key = 'meta+-';
        }
        execute() {
            this.bus.execute({ type: 'zoomOut' });
        }
    }
    )
];
//# sourceMappingURL=index.js.map