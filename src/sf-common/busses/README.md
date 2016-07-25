Busses (from [mesh](//mesh.js.org)) are `IActors` that control the flow of Actions. They're
synonmyous to the `Mediator` pattern, but are a) more robust, and b) less opinionated. Here's an example:

```javascript
import { Action } from 'sf-core/actions';
import { ParallelBus, BufferedBus } from 'mesh';
import ProxyBus from './proxy';

let proxy:ProxyBus = new ProxyBus();

const bus = new ParallelBus([
  new BufferedBus(void 0, 'a'),
  new BufferedBus(void 0, 'b'),
  proxy
]);

const response = bus.execute(new Action('ping'));

// response is waiting for Proxy...
response.readAll().then(function([a, b, c]) {

});

proxy.target = new BufferedBus(void 0, 'c'); // target set - finish response
```
