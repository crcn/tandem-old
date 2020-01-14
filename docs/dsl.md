template example:

```html

<!-- importing a component. ID is assigned to the import tag, but using
it instantiates a new component instance -->
<import id="custom-button" src="./path/to/custom-button.pc" />

<!-- controllers are higher-order-components that attach functionality to components -->
<controller src="./my-controller.react.tsx" target="javascript" />
<controller src="./my-controller.laravel.php" target="php" />

<custom-button />

<!-- styles are scoped to this file -->
<style>
  div {
    
  }
</style>

<div>
  this is a component example
  {{content}}
</div>
```

controller example:

```javascript
import * as React from "react";
export default Template => class TemplateController extends React.Component {
  render() {
    return <Template />;
  }
}
```

#### Limitations