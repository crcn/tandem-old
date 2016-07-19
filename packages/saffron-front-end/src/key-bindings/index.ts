import { FactoryFragment } from 'saffron-common/lib/fragments/index';
import { BaseActor } from 'saffron-common/lib/actors/index';

export const fragment = [
  new FactoryFragment({
    ns: 'key-bindings/zoom-in',
    factory: class ZoomInKeyBindingActor extends BaseActor {
      public bus:any;
      key = 'meta+=';
      execute() {
        this.bus.execute({ type: 'zoomIn' });
      }
    }
  }),
  new FactoryFragment({
    ns: 'key-bindings/zoom-out',
    factory: class ZoomOutKeyBindingActor extends BaseActor {
      public bus:any;
      key = 'meta+-';
      execute() {
        this.bus.execute({ type: 'zoomOut' });
      }
    }
  })
];
