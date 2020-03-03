<!--

Notes:

- need to express that it's lightweight
-->

#### Build UIs in realtime ⚡️

<!-- No more juggling between the coding & debugging in the browser. Paperclip provides tooling that allows  -->

Paperclip is a template language that's designed for visual development. See what you're creating in realtime, directly within VS Code.

<!-- Tooling is provided that brings a realtime preview of your application directly into your code editor. -->

<!-- Paperclip is a template language that runs while you're writing in it, so you can see a preview of exactly what you're creating in realtime. -->

<!-- No more wasted time juggling between the browser & code! -->


<!-- Paperclip code runs while you're writing it, so you never have to leave the IDE. UI files also compile down directly to React code. -->

<!-- Write your UIs and see a live preview of them directly within your IDE. Paperclip templates also compile to React code, so you can use them in your React app.  -->

<!-- Paperclip runs while you're writing it, so you never have to leave the IDE. UI files also compile down directly to React code.  -->

<!-- Paperclip code runs while you're writing it, so you can build features more quickly. UIs also compile down to application code, so you can use Paperclip in your existing codebase (currently React). -->


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

### What is Paperclip example?

Paperclip is a _tiny_ DSL that just covers basic HTML, CSS, and syntax around defining _dumb_ components. For example:

```html
<style>
  * {
    font-family: Helvetica;
  }
  
  li[completed] {
    text-decoration: linethrough;
  }
</style>

<part id="TodoItem">
  <li {completed}>
    <input type="checkmark" checked={completed}>
    {label}
  </li>
</part>

<part id="TodoList">
  <h1>Todos:</h1>
  <input type="text" onKeyPress={onNewTodoKeyPress}>
  <ul>
    {todoItems}
  </ul>
</part>

<preview>
  <TodoList todoItems={<>
    <TodoItem label="Feed cat" completed />
  </>} />
</preview>
```


> <part /> Elements allow you to slice up your UI to use in app code.

Behavior of the UI might look something like this:

```javascript
// Import the parts into the component file to build them back up.
import React, { useState } from "react";
import { TodoList, TodoItem } from "./list.pc";

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

> This is Vanilla JavaScript. Paperclip's React compiler also allows you to generate typed definition files so that you have more safety around using the templates.

### Doesn't HMR exist? Why do I need this?

<!-- Developer tooling and efficiency is important, and Paperclip aims to eliminate the bottleneck around coding  -->

Maybe you don't! But personally I find the whole process of switching between the browser & code to be _terribly_ inneficient, especially as projects grow. That 5 seconds you're waiting on the browser to reload really adds up over time. 

Paperclip was designed to give you an _instant_ preview of your UIs as you're writing them, and maintain that level of performance as your project scales. So, if you feel bottlenecked by using the browser to write HTML & CSS, then give Paperclip a shot!

<!-- 
The ethos of Paperclip is to optimize the feedback loop around writing UI code, and debugging it.  -->

<!-- Paperclip was created to shorten the gap between writing code & seeing the result. -->


<!-- So, Paperclip was designed to live in an environment that's decoupled from application code, so won't get weighed down as the application codebase grows.  -->

<!-- I've found that developer tooling doesn't scale as projects grow, and the process of switching between my code editor & web browser for debugging UIs to be  -->

## Features

- Live preview of your app 🏎
- Integrates with React (more frameworks & languages are planned).
- `d.ts` file generation for type safety.
- Some visual 

## Planned features

- [Visual regression testing](https://github.com/crcn/paperclip/issues/752)
- [Cross-browser rendering](https://github.com/crcn/paperclip/issues/753)

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
