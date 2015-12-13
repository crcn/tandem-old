Dependency injection package.

```javascript
import { Registry, Plugin } from 'common/registry';

var registry = Registry.create();
var plugin = registry.register(Plugin.create({ type: 'component', label: 'My component label' }, componentFactory));

registry.register(Plugin.create({ type: 'pane', target: entry }, componentEditorFactory));

var entry = registry.find({ type: 'component' });
var item = entry.factory.create();
```


#### TODOS

- [ ] ability to dispose an entry
