Temporary directory for the updated version of [Mesh](http://mesh.js.org/).

Mesh is a utility belt library for complex data flows. Here until the lib matures
a bit before moving over to the main repository.



## Terminology

#### Dispatcher

Responsible for dispatching a message to one or many listeners. Examples include `Observables`, and `Busses`.

#### Message

The object that is sent to the dispatcher handlers

#### Request


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