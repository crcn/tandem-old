Dependency injection package.

```javascript
import { Registry, Fragment } from 'common/registry';

var registry = Registry.create();
var fragment = registry.register(Fragment.create({ type: 'component', label: 'My component label' }, componentFactory));

registry.register(Fragment.create({ type: 'pane', target: entry }, componentEditorFactory));

var entry = registry.find({ type: 'component' });
var item = entry.factory.create();
```


#### TODOS

- [ ] ability to dispose an entry
