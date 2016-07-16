import loggable from 'common/logger/mixins/loggable';

import { Service } from 'common/services';
import { FactoryFragment } from 'common/fragments';

const ZOOM_INCREMENT = 0.1;
const MIN_ZOOM_LEVEL = 0.2;
const MAX_ZOOM_LEVEL = 2;

@loggable
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

export const fragment = FactoryFragment.create({
  ns      : 'application/services/preview',
  factory : PreviewService
});
