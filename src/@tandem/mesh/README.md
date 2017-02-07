## Mesh is a messsage routing library based on the [stream standard](https://streams.spec.whatwg.org/).

**This library will eventually be moved [here](https://github.com/crcn/mesh.js) after it becomes a bit more stable.**

This library is intented to be more of a utility belt (like underscore, or lodash) for creating your *own* messaging routers. The docs here (still WIP) also serve as a guide to help you come up with messaging APIs, and patterns that are consistent across your codebase. 

#### Motivation

Mesh was created to normalize how an application sends & receives messages throughout the application, and to other connected services over protocols such as HTTP, TCP, websockets, and others. 

Mesh routers are also built to be composable - you can combine, mix & match them to create data flows according to your application needs. For instance, suppose you're using this library to handle HTTP requests:

```typescript
import { IBus, DuplexStream } from "@tandem/mesh";

class HTTPRequest {
  
  constructor(readonly pathname: string, readonly ipAddress: string) {
  
  }
}

class RouterBus implements IBus {
  private _routes: {
    [Identifier: string]: IBus
  };
  constructor() {
    this._routes = {};
  }
  register(pathname: string, bus: IBus) {
    this._routes[pathname] = bus;
  }
  dispatch(request: HTTPRequest) {
     const route = this._routes[request.pathname);
     return route ? route.dispatch(request) : throw new Error(`Route "${request.pathname}" does not exist.`);
  }
}


const httpBus = new HTTPRouteBus();
httpBus.register("/home", {
  dispatch(request: HTTPRequest) {
    return new DuplexStream((req, res) => {
      res.write("hello world");
      res.close();
    })
  }
});
```

> This is a *start* to an http router. There's still a ton of implementation that's required
For this code to be used in production.

You can easily add a data throttling layer:

```typescript
class ThrottleBus implements IBus {
   private _requests: {
    [Identifier: string]: number
   }
   constructor(readonly targetBus: IBus, readonly ttl: number) {
      this._requests = {};
   }
   
   dispatch(request: HTTPRequest) {
      const prevRequest = this._requests[request.ipAddress];
      if (prevRequest && prevRequest + this.ttl > Date.now()) {
        return throwEnhanceCalmError("Too many requests. Try again later.");
      }
      this._requests[request.ipAddress] = Date.now();
      return this.targetBus.dispatch(request);
   }
}

const httpBus = new HTTPRouteBus();

// 
let mainBus = new ThrottleBus(httpBus, 100);
```

> Some missing things here, but shows composability of messaging routers.

This was added with very little modification to the application code. Suppose we want to pass the HTTP request over to a different application entirely:


TODO with socket.io bus, or sock bus.



#### Kitchen sink example

```typescript
import { CallbackBus } from "mesh";


```


#### new CallbackBus()

#### new 


