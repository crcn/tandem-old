#### Paperclip is a UI 

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
  <default todoItems={[
    <TodoItem label="clean car" />,
    <TodoItem label="walk dog" />
  ]} />
</preview>
```

Assuming we're using `React` to power our UI, the code for that might look something like:

```typescript
// list.tsx


import ListView, { TodoItem } from "./list.pc";
import React, { useState } from "react";

export default () => {
  const [todos, setTodos] = useState([
    createTodo("Wash car"),
    createTodo("Groceries"),
  ]);

  const onNewInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    if (event.key === "Enter" && value) {
      setTodos([...todos, createTodo(value)]);
      target.value = "";
    }
  };

  return <ListView
    onNewInputKeyPress={onNewInputKeyPress}
    todoItems={todos.map(todo => {
      return <TodoItem label={todo.label} key={todo.id}  />;
    })}
  />;
};

let _idCount = 0;
const createTodo = (label: string) => ({
  label,
  id: _idCount++
});
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