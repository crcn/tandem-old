Dependency injection API

Example:

```javascript
import { inject } from "@tandem/common/decorators";
import { Dependency, Dependencies, IInjectable } from "@tandem/common/dependencies";

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
```

TODOS:

- [ ] make inject() param more flexible - ability to map values injected

```javascript
class Person {
  @inject("service", dependency => dependency.create())
  public service:Service;
}
```