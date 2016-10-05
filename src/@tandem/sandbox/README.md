```javascript
import { Sandbox } from "@tandem/sandbox";
import { Dependencies } from "@tandem/dependencies";

const deps = new Dependencies(
  new SandboxEnvironmentDependency("sass")
);

const sandbox = new Sandbox(deps);
const module = await sandbox.import("./my-module.scss");
```

### Features

- import dependencies based on the environment
- hot reloading