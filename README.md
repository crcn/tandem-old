#### Paperclip is a tool for building UIs quickly ⚡️

![VSCode Demo](https://user-images.githubusercontent.com/757408/75412579-f0965200-58f0-11ea-8043-76a0b0ec1a08.gif)

#### What is it exactly?

Paperclip provides a UI language that runs while you're writing in it, so you can see what you're building in realtime. It's designed to be lean & limited in features, so 

#### Why?

UI de

#### What does the language look like?

```html
<style>
  span {
    font-family: Comic Sans MS;
    cursor: pointer;
  }
</style>

<span {onClick}>Count: {currentCount}</span>
```

Here's how you might use the template file in React code:

```javascript
import BaseCounter from "./counter.pc";
import React, { useState } from "react";

export default () => {
  const [currentCount, setCount] = useState(0);
  const onClick = () => setCount(currentCount + 1);
  return <BaseCounter onClick={onClick} currentCount={currentCount} />
};
```

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