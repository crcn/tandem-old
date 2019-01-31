<p align="center">
  <img src="assets/logo.svg" width="170px">
  <h1 align="center">Tandem (Preview)</h1>
</p>

> Tandem is still very new, so expect bugs. If you'd like to contribute, feel free to reach out to hello@tandemcode.com.

[Download latest version](https://github.com/tandemcode/tandem/releases)

Tandem is a UI builder for web applications. It currently works with [React](https://reactjs.org/) - other languages & frameworks will be supported in the future. The primary goal for Tandem is to provide a faster, easier, safer, and more scalable way of creating web UIs.

![Split view](./assets/screenshots/v10.1.7.png)

### Highlights

- Designed to work with existing code (currently only React).
- Unopinionated, so you can adapt Tandem to fit your needs.
- UI files can be split out into multiple files, and organized however you want.
- Handwritten HTML & CSS can be mixed with Tandem UIs (this is helpful if you need to integrate complex code).
- Not a code replacement. Tandem only allows you to create simple HTML & CSS.
- Few abstractions. Tandem gives you transparent tooling that's based on web standards.

### Resources

- [Releases](https://github.com/tandemcode/tandem/releases)
- [Tutorial videos](https://www.youtube.com/playlist?list=PLCNS_PVbhoSXOrjiJQP7ZjZJ4YHULnB2y)
- [Integrating with existing code](./docs/integrating-with-existing-project.md)
- [Terminology & Concepts](./docs/concepts.md)
- [Goals & Non-goals](./docs/goals.md)
- [Examples](https://github.com/tandemcode/examples)
- [Development](./docs/contributing/development.md)

### How does it work?

Tandem UI files (`.pc` which stands for [Paperclip](https://github.com/tandemcode/tandem/tree/master/packages/paperclip)) contain JSON data which describes basic HTML & CSS. For example, here's a simple UI:

<img width="503" alt="screenshot 2019-01-26 19 00 44" src="https://user-images.githubusercontent.com/757408/51795690-bd890880-219c-11e9-82a1-b40098731c6c.png">

The JSON representation of this ☝️is:

```javascript
{
  "id": "74a268f34",
  "name": "module",
  "version": "0.0.6",
  "children": [
    {

      "label": "Application",
      "is": "div",
      "style": {},
      "attributes": {},
      "id": "74a268f33",
      "name": "component",
      "children": [
        {
          "id": "74a268f318",
          "label": "counter button",
          "is": "div",
          "name": "element",
          "attributes": {},
          "style": {
            "display": "inline-block",
            "padding-left": "12px",
            "padding-top": "6px",
            "padding-right": "12px",
            "padding-bottom": "6px",
            "border-top-left-radius": "4pz",
            "border-top-right-radius": "4pz",
            "border-bottom-left-radius": "4pz",
            "border-bottom-right-radius": "4pz",
            "background-image": "linear-gradient(rgba(200, 200, 200, 1), rgba(200, 200, 200, 1))"
          },
          "children": [
            {
              "id": "74a268f316",
              "name": "text",
              "label": "label",
              "value": "Click me!",
              "style": {
                "font-family": "Helvetica"
              },
              "children": [],
              "metadata": {}
            }
          ],
          "metadata": {}
        },
        {
          "id": "74a268f321",
          "name": "text",
          "label": "click count info",
          "value": "Click count: 0",
          "style": {
            "font-family": "Helvetica",
            "display": "block"
          },
          "children": [],
          "metadata": {}
        }
      ],
      "metadata": {
        "bounds": {
          "left": 0,
          "top": 0,
          "right": 190,
          "bottom": 138
        }
      },
      "variant": {}
    }
  ],
  "metadata": {}
}
```

☝️HTML & CSS is defined in this JSON structure, and it doesn't really get much more complex. For this example if we want to add behavior, we can do that be attaching a controller to this component. Here's how you do that in the UI:

![controller](https://user-images.githubusercontent.com/757408/51795768-e6f66400-219d-11e9-87fd-9b9a549ce29a.gif)

The code that goes into this controller might look something like this:

```typescript
import * as React from "react";

// The React compiler can generated TypeScript definition files from .pc files for safely
// integrating with UIs designed in Tandem.
import { BaseApplicationProps } from "./view.pc";

// Props are exported here
export type Props = {};

type State = {
  clickCount: number;
};

// This is factory for creating a controller. The Base variable is the UI designed in Tandem compiled down to React. The React class returned
// here adds behavior to the Base UI.
export default (Base: React.ComponentClass<BaseApplicationProps>) =>
  class ApplicationController extends React.PureComponent<Props, State> {
    state = {
      clickCount: 0
    };

    onCounterButtonClick = () => {
      this.setState({ clickCount: this.state.clickCount + 1 });
    };
    render() {
      // Render Base and add behavior. Behavior is added
      // by defining props that correspond with an element's label.
      // "Counter Button" for example takes "counterButtonProps".
      // "Click Count Into" for example takes "clickCountInfoProps".
      return (
        <Base
          counterButtonProps={{
            onClick: this.onCounterButtonClick
          }}
          clickCountInfoProps={{
            text: `Click count: ${this.state.clickCount}`
          }}
        />
      );
    }
  };
```

This code is specific to React & TypeScript, but Tandem is agnostic to the language or framework you use. UIs also don't contain information about the code they're integrating with, so you can re-use UIs for multiple language & framework targets.

☝️With this chunk of code, here's the behavior we get when the app is compiled:

![controller](https://user-images.githubusercontent.com/757408/51796101-a0a30400-21a1-11e9-835f-da25788c9861.gif)

For more examples, check out the [examples repository](https://github.com/tandemcode/examples).
