#### Paperclip is a tiny UI language 

![VSCode Demo](https://user-images.githubusercontent.com/757408/75412579-f0965200-58f0-11ea-8043-76a0b0ec1a08.gif)

Here's a basic example of the language:

```html
<!-- list.pc -->

<!-- styles are only applied to the elements in this document -->
<style>
  ul {
    margin: 0;
    padding: 0;
  }
</style>

<!-- Parts describe you're component building blocks -->
<part id="TodoItem">
  <li>{label}</li>
</part>

<!-- "default" part is exported as the default component -->
<part id="default">
  <input type="text" placeholder="Add a new todo..." onKeyPress={onNewInputKeyPress} />
  <ul>
    {todoItems}
  </ul>
</part>

<!-- Preview elements allow you to preview your component & its various states. This -->
<preview>
  <default todoItems={<>
    <TodoItem label="clean car" />
    <TodoItem label="walk dog" />
  </>} />
</preview>
```

Assuming we're using `React` to power our UI, the code for that might look something like:

```javascript
// list.jsx

// Parts are compiled to individual components
import ListView, { TodoItem } from "./list.pc";
import React, { useState } from "react";

export default () => {
  const [todos, setTodos] = useState([
    { label: "Wash car" },
    { label: "Groceries" } 
  ]);

  const onNewInputKeyPress = (event) => {
    const label = event.target.value.trim();
    if (event.key === "Enter" && label) {
      setTodos([...todos, { label }]);
      event.target.value = "";
    }
  };

  // Use parts like regular components
  return <ListView
    onNewInputKeyPress={onNewInputKeyPress}
    todoItems={todos.map(todo => {
      return <TodoItem label={todo.label} key={todo.id}  />;
    })}
  />;
};
```

> You can check out the source code for this example here: https://github.com/crcn/paperclip/tree/master/examples/simple-todo-list

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