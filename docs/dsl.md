KS:

```javascript
const module = {
  type: "module",
  version: "0.0.1",
  imports: [],
  declarations: [
    {
      type: "component-declaration",
      bounds: {
        left: 0,
        top: 0,
        width: 100,
        height: 100
      },
      component: {
        id: "component1"
        type: "component",
        label: "Test Component"
        variants: [
          {
            label: "Variant 1",
            id: "variant1"
          }
        ],
        template: {
          type: "element",
          name: "div",
          attributes: {},
          children: [
            {
              type: "element",
              componentId: "component1",
              variant: [],
              overrides: {
                variant1: {
                  component1: {
                    style: {}
                    href: "http://google.com",
                    variant: ["a", "b"]
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      type: "element-declaration"
      bounds: {
        left: 0,
        top: 0,
        width: 100,
        height: 100
      },
      element: {
        type: "element",
        name: "component1"
      }
    }
  ]
};
```
