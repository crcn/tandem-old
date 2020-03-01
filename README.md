#### Paperclip is a tool for building UIs quickly ⚡️

![VSCode Demo](https://user-images.githubusercontent.com/757408/75412579-f0965200-58f0-11ea-8043-76a0b0ec1a08.gif)

#### What is it exactly?

Paperclip provides a UI language that runs while you're writing in it, so you can see what you're building in realtime. Here's an example:

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

#### Why use Paperclip?

Slow.

#### What does the language look like?

Here's how you might use the template file in React code:


> You can check out the source code for this example here: https://github.com/crcn/paperclip/tree/master/examples/counter

## Features

- See a live preview of your UI as you're writing code
- Compiles directly to strongly typed code (currently just React)

## Motivation

Development speed. I find that a lot of my time is spent

## Resources

- [Getting Started](./documentation/Getting&20Started)
- [Syntax](./documentation/Syntax)
- [Integrations](./documentation/Integrations)
- [Contributing](./documentation/Contributing)