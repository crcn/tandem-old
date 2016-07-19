import loggable from 'saffron-common/lib/logger/mixins/loggable';

import { Service } from 'saffron-common/lib/services/index';
import { FactoryFragment } from 'saffron-common/lib/fragments/index';

const ZOOM_INCREMENT = 0.1;
const MIN_ZOOM_LEVEL = 0.2;
const MAX_ZOOM_LEVEL = 2;

export default class PreviewService extends Service {

  constructor(properties) {
    super(properties);
    this.app.zoom = 1;
  }

  zoomIn() {
    this.zoom({ delta: ZOOM_INCREMENT });
  }

  zoom({ delta }) {
    this.app.setProperties({
      zoom: Math.max(
        MIN_ZOOM_LEVEL,
        Math.min(
          MAX_ZOOM_LEVEL,
          (this.app.zoom || 1) + delta
        )
      )
    });
  }

  zoomOut() {
    this.zoom({ delta: -ZOOM_INCREMENT });
  }
}

export const fragment = new FactoryFragment({
  ns      : 'application/services/preview',
  factory : PreviewService
});
