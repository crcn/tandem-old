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
- Only supports primitive behavior.

## Planned Features

- Additional compile targets (PHP, Ruby, Vue, etc.)
- Visual regression testing tools
- More UI tooling
  - Browser-like style inspector that writes to code
- State charts
- Browserling / Browserstack integration for live development preview
- A11y

## Motivation

Speed & Safety around visual 

## Getting Started

- download vscode extension
- alternative if vscode extension doesn't exist 
  - HMR + Webpack

## Syntax