Dependency injection API

Example:

```javascript
import { inject } from "sf-core/decorators";
import { Dependency, Dependencies, IInjectable } from "sf-core/dependencies";

/**
 * Main application entry point
 */

class Application {
  constructor(readonly config:any) { }
}

class SomeService implements IInjectable {

  @inject("application")
  readonly app:Application;

  public started: boolean;

  didInject() {
    console.log(this.app.config); // { port: 8080 }
    const server = new Server();
    server.listen(this.app.config.port);
    this.started = true;
  }
}

const dependencies = new Dependencies(
  new Dependency<Application>("application", new Application()),
  new ClassFactoryDependency<SomeService>("someService", SomeService)
);

const classFactoryDependency = dependencies.query<ClassFactoryDependency<SomeService>>("someService");

const service:SomeService = classFactoryDependency.create();

// didInject triggered - server started
console.log(service.started); // true
```