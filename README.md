<!--

Notes:

- need to express that it's lightweight
-->

#### Paperclip is a language for building UIs in realtime ⚡️

Paperclip code runs while you're writing it, so you can build features more quickly. UIs also compile down to application code, so you can use Paperclip in your existing codebase (currently React).


<!-- _See_ UIs that you're creating in realtime, directly within your code editor. Designed to integrate with your existing codebase (currently just React for now). -->

<!--
Templates are also designed to compile down to your application framework of choice (currently only React).
-->

<!-- 
_See_ UIs that you're creating in realtime, directly within your code editor. Paperclip comes with primitive UI behavior that allows you to setup the _bones_ UI 

-->

<!-- Paperclip comes with a runtime for VSCode that shows you a preview of UIs as  -->

<!-- A slim, ultra efficient way to stylize your web applications.  -->

<!--  that runs _while_ you write in it, and compiles down to application code in the framework of your choice. -->

![VSCode Demo](https://user-images.githubusercontent.com/757408/75412579-f0965200-58f0-11ea-8043-76a0b0ec1a08.gif)


Paperclip's syntax allows yo for _slicing up_ your UIs to use in your application code. For example:

Paperclip's syntax provides you with a lightweight approach to creating _most_ of your UIs, and slicing them up to use in your application code. Here's an example:

```html
<!-- styles are scoped to this file -->
<style>
  * {
    font-family: Helvetica;
    font-size: 12px;
  }

  #new-todo-input {
    margin-bottom: 4px;
    border-radius: 4px;
    border: 1px solid rgb(119, 119, 119);
  }
</style>

<!-- Parts describe you're component building blocks -->
<part id="TodoItem">
  <li>{label}</li>
</part>

<part id="TodoList">
  <input id="new-todo-input" type="text" placeholder="Add a new todo..." onKeyPress={onNewInputKeyPress} />
  <ul class="todo-items">
    {todoItems}
  </ul>
</part>

<!-- preview's allow you to see how everything is put together. -->
<preview>
  <TodoList todoItems={<>
    <TodoItem label="clean car" />
    <TodoItem label="walk dog" />
  </>} />
</preview>
```

Assuming you're building a `React` application, here's how you might use the paperclip file:

```javascript
// Import the parts into the component file to build them back up.
import { TodoList, TodoItem } from "./list.pc";
import React, { useState } from "react";

export default () => {
  const [todos, setTodos] = useState([
    { label: "Wash car" },
    { label: "Groceries" },
  ]);

  const onNewInputKeyPress = (event) => {
    const label = event.target.value.trim();
    if (event.key === "Enter" && value) {
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

### What is Paperclip exactly?

## Features


## Resources

- [Getting Started](./documentation/Getting&20Started)
- [Syntax](./documentation/Syntax)
- [Integrations](./documentation/Integrations)
- [Contributing](./documentation/Contributing)

<!-- ### What makes Paperclip special?

Paperclip's syntax allows you to express _most_ of you user interface in a "dumb" way. -->


<!-- The current process around developing UIs is incredibly slow, especially as codebases scale. Paperclip was created -->


<!--UI development is a bit slow & inneficient, especially as projects scale, and code complexity kicks in. So I developed Paperclip to be a lightweight, and fast alternative for creating UIs that helps get the job done faster. 

The template language is limited -->

<!--

Points:

- lightwight
- bones of the UI

-->
