#### Paperclip is a UI language designed for live development.

![VSCode Demo](https://user-images.githubusercontent.com/757408/75412579-f0965200-58f0-11ea-8043-76a0b0ec1a08.gif)

Here's a basic example of the language:

```html
<!-- 
  Additional behavior can be attached to views using the this tag.
-->

<logic src="./todos.tsx" />

<input type="text" onKeyPress={onNewInputKeyPress} />

<ul>
  {#each todos as todo}
  <li>{todo.label}</li>
  {/}
</ul>
```

Assuming we're using `React` to power our UI, the code for that might look something like:

```typescript
import React, { useState } from "react";

export default View =>
  function Todos(props) {
    const [todos, setTodos] = useState([
      { label: "wash car" },
      { label: "feed cat" }
    ]);

    const onNewInputKeyPress = event => {
      if (event.key === "Enter" && event.target.value) {
        setTodos([...todos, { label: event.target.value }]);
        event.target.value = "";
      }
    };

    return <View todos={todos} onNewInputKeyPress={onNewInputKeyPress} />;
  };
```

Then after that, all we need to do is simply use our Paperclip file:

```typescript
import React from "react";
import ReactDOM from "react-dom";
import Todos from "./todos.pc";

ReactDOM.render(document.querySelector("#app"), <Todos />);
```

## Features

- See a live preview of your UI as you're writing code.
- Compiles directly to strongly typed code (currently just React).
- Primitive behavior

## Planned Features

- Additional compile targets (PHP, Ruby, Vue, etc.).
- More UI tooling

## Motivation

TODO
