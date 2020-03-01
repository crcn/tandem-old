#### Paperclip is a tool for building UIs quickly ⚡️

![VSCode Demo](https://user-images.githubusercontent.com/757408/75412579-f0965200-58f0-11ea-8043-76a0b0ec1a08.gif)

#### What is it exactly?

Paperclip provides a UI language that runs while you're writing in it, so you can see what you're building in _realtime_. Here's an example:

```html
<style>
  span {
    font-family: Comic Sans MS;
    cursor: pointer;
  }
</style>

<span {onClick}>Count: {currentCount}</span>
```

Paperclip UIs compile down to vanilla code - no runtime necessary. Currently React is the only option, here's example:

```javascript
import BaseCounter from "./counter.pc";
import React, { useState } from "react";

export default () => {
  const [currentCount, setCount] = useState(0);
  const onClick = () => setCount(currentCount + 1);
  return <BaseCounter onClick={onClick} currentCount={currentCount} />
};
```

## Features

- See a live preview of your UI as you're writing code
- Compiles directly to strongly typed code (currently just React)

## Resources

- [Getting Started](./documentation/Getting&20Started)
- [Syntax](./documentation/Syntax)
- [Integrations](./documentation/Integrations)
- [Contributing](./documentation/Contributing)