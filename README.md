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

## What is Paperclip exactly?

Paperclip just covers basic HTML, CSS, and syntax for defining _dumb_ components. Here's an example:

```html
<!-- todo-list.pc -->

<!--
Styles are scoped to this file, so you don't have to worry about them leaking out.
-->

<style>
  * {
    font-family: Helvetica;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  
  li[done] {
    text-decoration: line-through;
  }
</style>

<!-- Parts are building blocks that are individually used in application code (more information below). -->
<part id="TodoItem">

  <!-- You can assign attribute bindings. -->
  <li {done}>
    <input type="checkbox" checked={done} onClick={onDoneClick}>

    <!-- You can also define slots where text & elements are inserted into. -->
    {label}
  </li>
</part>

<part id="TodoList">
  <h1>Todos:</h1>
  <input type="text" onKeyPress={onNewTodoKeyPress} placeholder="Add a new todo..." >
  <ul>
    {todoItems}
  </ul>
</part>

<!-- Preview is a special tag for development that allows you to see how all of your parts look when put together in their varying states. -->
<preview>
  <TodoList todoItems={<>
    <TodoItem label="Feed cat" done />
    <TodoItem label="Take out trash" />
    <TodoItem label="Walk dog" done />
  </>} />
</preview>
```

Here's what you see in VS Code as your typing away:

![Simple todo preview](https://user-images.githubusercontent.com/757408/75791302-ff866580-5d31-11ea-8da9-1c43631f0626.gif)


## How do I use Paperclip with code?


Templates compile directly to highly optimized code. Using our list example above, here's how you might use it in React code:

```javascript

// <part /> elements are exposed as React components.
import { TodoList, TodoItem } from "./list.pc";
import React, { useState } from "react";

export default () => {
  const [todos, setTodos] = useState([
    { label: "Clean car" },
    { label: "Eat food", done: true },
    { label: "Sell car" }
  ]);

  const onNewInputKeyPress = (event) => {
    if (event.key === "Enter" && value) {
      setTodos([...todos, { label: event.target.value }]);
      event.target.value = "";
    }
  };

  const onDoneClick = (todo: Todo) => {
    setTodos(
      todos.map(oldTodo => {
        return oldTodo.id === todo.id
          ? {
              ...oldTodo,
              done: !oldTodo.done
            }
          : oldTodo;
      })
    );
  };

  // The attribute bindings & slots that were defined are
  // exposed as props for each <part /> component.
  return (
    <TodoList
      onNewTodoKeyPress={onNewInputKeyPress}
      todoItems={todos.map(todo => {
        return (
          <TodoItem
            done={todo.done}
            onDoneClick={() => onDoneClick(todo)}
            label={todo.label}
            key={todo.id}
          />
        );
      })}
    />
  );
};
```

> The code for this example is also here: https://github.com/crcn/paperclip/tree/master/examples/simple-todo-list

> More compiler targets are planned for other languages and frameworks. React is just a starting point ✌🏻.

## Strongly Typed 

Templates compile down to strongly typed code. For example, here:

```typescript
import {ReactNode, ReactHTML, Factory, InputHTMLAttributes, ClassAttributes} from "react";

type ElementProps = InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>;

export declare const styled: (tag: keyof ReactHTML | Factory<ElementProps>, defaultProps?: ElementProps) => Factory<ElementProps>;

type TodoItemProps = {
  done: String | boolean | Number | Object | ReactNode,
  onDoneClick: Function,
  label: String | boolean | Number | Object | ReactNode,
};

export const TodoItem: Factory<TodoItemProps>;

type TodoListProps = {
  onNewTodoKeyPress: Function,
  todoItems: String | boolean | Number | Object | ReactNode,
};

export const TodoList: Factory<TodoListProps>;

type Props = {
  done: String | boolean | Number | Object | ReactNode,
  onDoneClick: Function,
  label: String | boolean | Number | Object | ReactNode,
  onNewTodoKeyPress: Function,
  todoItems: String | boolean | Number | Object | ReactNode,
};

declare const View: Factory<Props>;
export default View;
```


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
