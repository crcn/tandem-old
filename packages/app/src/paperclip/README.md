Features:

- variants
- slots
- components

Example:

```html
<module xmlns:some-import="./file.pc">
  <component id="test">
    <template>
      <text id="test" />
    </template>
    <variant name="some-variant">
      <remove-child target="test" />
    </variant>
  </component>
</module>
```

VM:

```typescript
import {  } from "paperclip";
```