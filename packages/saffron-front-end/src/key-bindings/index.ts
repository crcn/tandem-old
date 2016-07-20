import { ClassFactoryFragment } from 'saffron-common/lib/fragments/index';
import { BaseActor } from 'saffron-common/lib/actors/index';

export const fragment = [
  new ClassFactoryFragment('key-bindings/zoom-in', class ZoomInKeyBindingActor extends BaseActor {
      public bus:any;
      key = 'meta+=';
      execute() {
        this.bus.execute({ type: 'zoomIn' });
      }
    }
  }),
  new ClassFactoryFragment('key-bindings/zoom-out', class ZoomOutKeyBindingActor extends BaseActor {
      public bus:any;
      key = 'meta+-';
      execute() {
        this.bus.execute({ type: 'zoomOut' });
      }
    }
  })
];
