"use strict";
const base_application_service_1 = require('saffron-common/src/services/base-application-service');
const index_1 = require('saffron-common/src/fragments/index');
const ZOOM_INCREMENT = 0.1;
const MIN_ZOOM_LEVEL = 0.2;
const MAX_ZOOM_LEVEL = 2;
class PreviewService extends base_application_service_1.default {
    constructor(app) {
        super(app);
        this.app.zoom = 1;
    }
    zoomIn() {
        this.zoom({ delta: ZOOM_INCREMENT });
    }
    zoom({ delta }) {
        this.app.setProperties({
            zoom: Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, (this.app.zoom || 1) + delta))
        });
    }
    zoomOut() {
        this.zoom({ delta: -ZOOM_INCREMENT });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PreviewService;
exports.fragment = new index_1.ApplicationServiceFragment('application/services/preview', PreviewService);
//# sourceMappingURL=preview.js.map