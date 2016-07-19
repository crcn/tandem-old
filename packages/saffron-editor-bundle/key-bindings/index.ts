import { FactoryFragment } from 'saffron-common/fragments';
import { BaseActor } from 'saffron-common/actors';

export const fragment = [
  FactoryFragment.create({
    ns: 'key-bindings/zoom-in',
    factory: class ZoomInKeyBindingActor extends BaseActor {
      key = 'meta+=';
      execute() {
        this.bus.execute({ type: 'zoomIn' });
      }
    }
  }),
  FactoryFragment.create({
    ns: 'key-bindings/zoom-out',
    factory: class ZoomOutKeyBindingActor extends BaseActor {
      key = 'meta+-';
      execute() {
        this.bus.execute({ type: 'zoomOut' });
      }
    }
  })
];
