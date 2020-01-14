template example:

```html

<!-- importing a component. ID is assigned to the import tag, but using
it instantiates a new component instance -->
<import id="custom-button" src="./path/to/custom-button.pc" />

<!-- JSON files can also be imported as context -->
<import id="theme" src="./path/to/theme.json" />

<!-- controllers are higher-order-components that attach functionality to components -->
<logic src="./my-controller.react.tsx" target="javascript" />
<logic src="./my-controller.laravel.php" target="php" />

<custom-button />

<!-- styles are scoped to this file -->
<style>
  div {

    /* styles can use block syntax */
    color: {{theme.primaryColor}};
  }
</style>

<!-- dynamically binding to attributes -->
<div style={{style}}>
  this is a component example

  <!-- slot example -->
  {{content}}
</div>

<!-- spread prop to elements -->
<span  {{boundAttributes}}> 
</span>

{{#if something}}
  show something
{{/else}}
  show something else
{{/}}

{{#repeat items as k, value}} 
  Repeat some value
{{/repeat}}

<!-- listener example -->
<span onClick={{handler}}>
</span>

<!-- -->
<span class="some class {{moreClasses}}">
</span>
```

controller (logic) example:

```javascript
import * as React from "react";
export default Template => class TemplateController extends React.Component {
  render() {
    return <Template />;
  }
}
```

Additionally, `.pc` files may have a corresponding `.[COMPONENT_NAME].tdc` (Tandem component file) which contains info to help visualize the component. Here's an example file:

```javascript
{

  // 2 previews - one for mobile & one for desktop
  "previews": [
    {
      platform: "mobile",

      // dummy data for visualizing template states
      context: {
        content: "something"
      }
    },

    {
      platform: "desktop",

      // dummy data for visualizing template states
      context: {
        content: "something"
      }
    }
  ]
}
```

#### Features

- Slots
- dynamic attributes

#### Limitations

- template

#### TODO

- Examples
  - VueJS
  - Svelte
  - Larabel
  - Ruby
  - Python
