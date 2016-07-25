Worker API for saffron.

entry.js:

```javascript
import { isMaster, fork } from 'sf-core/workers';


if (isMaster) {
  // initialize application here
} else {

  // start 4 workers
  for (let i = 4; i--;) fork();
}
```

any-file.js:

```javascript
import { thread } from 'sf-core/workers';

export default const slowFunction = thread(function() {
  return 'do something!';
});
```

