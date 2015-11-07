import { NoopBus, TailableBus, AcceptBus, WrapBus } from 'mesh';
import sift from 'sift';

export default {
  create: function() {
    var bus = NoopBus.create();
    bus     = TailableBus.create(bus);

    bus     = AcceptBus.create(
      sift({ action: 'tail' }),
      WrapBus.create(bus.createTail.bind(bus)),
      bus
    );

    return bus;
  }
};
