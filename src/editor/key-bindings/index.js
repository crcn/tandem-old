import { FactoryFragment } from 'common/fragments';
import { BaseActor } from 'common/actors';

const ZOOM_INCREMENT = 0.1;
const MIN_ZOOM_LEVEL = 0.2;
const MAX_ZOOM_LEVEL = 2;

export const fragment = [
  FactoryFragment.create({
    ns: 'key-bindings/zoom-in',
    factory: class ZoomInKeyBindingActor extends BaseActor {
      key = ['meta+='];
      execute() {
        console.log(this.app.zoom);
        this.app.setProperties({
          zoom: Math.min(MAX_ZOOM_LEVEL, (this.app.zoom || 0) + ZOOM_INCREMENT)
        });
      }
    }
  }),
  FactoryFragment.create({
    ns: 'key-bindings/zoom-out',
    factory: class ZoomOutKeyBindingActor extends BaseActor {
      key = ['meta+-'];
      execute() {
        this.app.setProperties({
          zoom: Math.max(MIN_ZOOM_LEVEL, (this.app.zoom || 0) - ZOOM_INCREMENT)
        });
      }
    }
  }),
  FactoryFragment.create({
    ns: 'key-bindings/paste',
    factory: class PasteKeyBindingActor extends BaseActor {
      key = ['meta+v'];
      execute() {
        console.log('paste');
      }
    }
  }),
  FactoryFragment.create({
    ns: 'key-bindings/copy',
    factory: class CopyKeyBindingActor extends BaseActor {
      key = ['meta+c'];
      execute() {
        console.log('copy');
      }
    }
  })
];