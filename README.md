<p align="center">
  <img src="assets/logo.svg" width="170px">
  <h1 align="center">Tandem (Preview)</h1>
</p>

Tandem is a web component builder that's designed to work with many different languages & frameworks (currently works with React apps, more support is planned after [Alpha](https://github.com/tandemcode/tandem/projects/10)). The tooling is inspired by Sketch, Figma, & VSCode, and are based on web standards.

![Split view](./assets/screenshots/v10.1.7.png)

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




### Highlights

- [Tandem was used to build itself as a litmus test](https://github.com/tandemcode/tandem/tree/master/packages/front-end/src/components). 
- Can be used with your existing codebase (currently only React). 
- Unopinionated, so you can adapt Tandem to fit your needs.
- UI files can be organized with the code files they're associated with. 
- Handwritten HTML & CSS can be mixed with Tandem UIs (this is helpful if you need to integrate complex code). 
- Not a code replacement. Tandem only allows you to create simple HTML & CSS.
- Few abstractions. Tandem gives you transparent tooling that's based on web standards.

## Resources

- [Releases](https://github.com/tandemcode/tandem/releases)
- [Tutorial videos](https://www.youtube.com/playlist?list=PLCNS_PVbhoSXOrjiJQP7ZjZJ4YHULnB2y)
- [Terminology & Concepts](./docs/concepts.md)
- [Goals & Non-goals](./docs/goals.md)
- [Examples](https://github.com/tandemcode/examples)
- Contributing
  - [Development](./docs/contributing/development.md)
