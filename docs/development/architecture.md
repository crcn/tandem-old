#### Kernel

The kernel acts as a container that provides dependencies for the entire application. Here's a simple use case:

```typescript
import { Kernel, Provider } from "@tandem/common";

class MySingletonProvider extends Provider<any> {
  static readonly NS = "mySingletonNamespace":
  constructor(name: string, readonly value: any) {
    super(MySingletonProvider.getId(name), value);
  }
  static readonly getId(name: string) {
    return [this.NS, name].join("/");
  }
}

const kernel = new Kernel(
  new MySingletonProvider("singleton1", "some value 1")
  new MySingletonProvider("singleton2", "some value 2")
);

const allSingletons = kernel.queryAll("/**"); // returns *all* providers in the kernel
const mySingletons  = kernel.queryAll(MySingletonProvider.getId("**")); // queries for only MySingletonProvider instances

const mySingleton1 = kernel.query(MySingletonProvider.getId("singleton1"));

console.log(mySingleton1.value); // some value 1
```

Providers act as the building blocks that compose *most* of the desktop application. They provide everything from UI components, dependency graph strategies,
file system strategies, singletons, models, and other features. 

MORE TODO HERE
