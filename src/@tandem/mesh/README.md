Temporary directory for the updated version of [Mesh](http://mesh.js.org/).

Mesh is a utility belt library for complex data flows. Here until the lib matures
a bit before moving over to the main repository.


TODOS:

- [ ] use [Streams](https://streams.spec.whatwg.org/) spec.
- [ ] replace Action terminology for Message terminolgy
- [ ] replace `execute(action)` for `dispatch(message)`
- [ ] `IDispatcher` should define `dispatch(message)` method
- [ ] `Observable` class
- [ ] add duplex streams


#### Features

- [WhatWG stream spec implementation](https://streams.spec.whatwg.org/#byob-reader-class)


Basic example:

```typescript

import { ParallelBus, Message, DuplexStream, CallbackDispatcher } from "@tandem/mesh";

const dispatcher = new CallbackDispatcher<Message, DuplexStream<any, any>>((message) => {
  return new DuplexStream((input, output) => {
  });
});


const { input, output } = dispatcher.dispatch({ text: "hello world" });
```