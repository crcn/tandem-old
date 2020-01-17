template example:

```html

<!-- can import components that affect global state such as styles -->
<import src="./global.pc" />

<!-- importing a component. ID is assigned to the import tag, but using
it instantiates a new component instance -->
<import id="custom-button" src="./path/to/custom-button.pc" />

<!-- JSON files can also be imported as context -->
<!-- { primaryColor: "#FF6600" } -->
<import id="theme" src="theme.json" /> 

<!-- import JSON files without ID to add them to _this_ context -->
<import src="./path/to/context.json" />

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

  /* global explicit via :global(*) */
  :global(*) {
    box-sizing: content-box;
  }
</style>

<!-- dynamically binding to attributes -->
<div style={{style}}>
  this is a component example

  <!-- slot example -->
  {{content}}
</div>

<!-- spread prop to elements -->
<span  {{...boundAttributes}}> 
</span>

<!-- properties passed into this component -->
<span  {{...this.props}}> 
</span>

<!-- logic in templates using builtin JS evaluator -->
{{#if age > 10}}
  show something
{{/else if age > 5}}
  show something else
{{/else}}
  nothing else
{{/}}

{{#each items as value, k}} 
  Repeat some value
{{/each}}

<!-- listener example -->
<span onClick={{handler}}>
</span>

<span class="some class {{moreClasses}}">
</span>

<!-- passing component as prop -->
<some-component someProp={{ <div>
    something something
  </div>
}} />
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
  - lambdas (see mustache)
- look into i18n
- ability to call funcitons with fallback
  - possibly use components for this
- look into extending preview with modules
  - would be nice for example to preview i18n strings
  - possibly using additional JS layer after evaluated VDOM tree
- look into animations

#### DX problems

- inline JS is super helpful. E.g: https://svelte.dev/docs#if
  - especially for default values (e.g: )
- should support global CSS

#### Features

- Mini JS evaluator
- type inferencing

### i18n exmaple

intl component:

```html

<!-- default text is children -->
{{this.children}}
```

```html
<intl id="greeting" values={{{name: "John"}}}>
  Hello!
</intl>
```
intl-logic.js:

```javascript

import {translate} from "some-i18n-library";

const translations = {
  en: {
    greeting: "Hello!"
  },
  es: {
    greeting: "Hola!"
  }
};

export default Template => class extends React.Component {
  render() {
    const {id, values, children} = props;
    const {locale} = this.context;
    const translation = translate(translations[locale][id], values);
    return translation || children;
  }
}
```

#### Compiler

config example:

```javascript
{

  // path to root directories
  "rootDirs": ["node_modules", "src/components"],

  // target framework - expect `paperclip-[target]-compiler`
  // target determines extension
  "target": "react",

  // glob for PC files
  "filesGlob": ["./**/*.pc"],

  // out directory. If omitted, out files are in directory where source files are
  "outDir": "lib"
}
```

> Config wouldn't be necessary to use in VSCode. Though functionality may be limited. 

CLI examples:

```
paperclip --config path/to/config.json
```




```html
<text id="message">
  Hello!
</text>
```

```javascript
{
  en: {
    message: "hello"
  },
  es: {
    message: "Hola"
  }
}
```


Pane.pc:

```html
<style>
  #header {}
</style>
<div>
  <div id="header">
    {{header}}
  </div>
  <div id="content">
    {{content}}
  </div>
</div>
```

app.pc:

```html
<import id="pane" src="./pane.pc" />

<pane header={{"something"}} content={{<div>hello world</div>}} />
```