Dependency injection package

```javascript
import { Registry, Entry } from 'registry';

var registry = Registry.create();
var entry = registry.register(Entry.create({ type: 'component', label: 'My component label' }, componentFactory));

registry.register(Entry.create({ type: 'pane', target: entry }, componentEditorFactory));


var entry = registry.findOne({ type: 'component' });
var item = entry.factory.create();
```
