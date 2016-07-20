import loggable from 'saffron-common/lib/decorators/loggable';
import BaseApplicationService from 'saffron-common/lib/services/base-application-service';
import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
import IApplication from 'saffron-common/lib/application/interface';

const ZOOM_INCREMENT = 0.1;
const MIN_ZOOM_LEVEL = 0.2;
const MAX_ZOOM_LEVEL = 2;

export default class PreviewService extends BaseApplicationService {

  constructor(app:IApplication) {
    super(app);
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

export const fragment = new ClassFactoryFragment('application/services/preview', PreviewService);
