Webpack loader for paperclip

TODOS:

- [ ] scan for compilers `paperclip-react-compiler`, `paperclip-paperclip-compiler`

## Example

Webpack config: 

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.pc$/,
        use: [
          // paperclip-loader
          {
            loader: 'paperclip-loader',
            options: {
              target: "react"
            }
          }
        ]
      }
    ]
  }
};
```

Template:

```html

<!-- public props -->
<property id="initialCount" scope="public" />

<!-- internal props -->
<property id="onClick" scope="internal" />
<property id="currentCount" scope="internal" />

<logic src="./component.tsx" target="react" />

{{currentCount}} <div {{onClick}} />
```

Component.tsx: 

```typescript
import * as React from "react";
import {PublicProps, InternalProps} from "./component.pc";
export default (Template: React.ComponentClass<InternalProps>) => class extends React.Component<PublicProps> {
  let state = { currentCount: this.props.count };
  render() {
    return <Template 
      currentCount={this.state.currentCount} 
      onClick={{this.onClick}} 
    />;
  }
}
```