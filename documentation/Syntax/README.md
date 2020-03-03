Here's a kitchen sink example of most syntaxes:

```html

<!-- you can import components from other files -->
<import id="my-button" src="./button.pc">

<!-- all styles are scoped to this file -->
<style>
  div {
    color: red;
  }
</style>

<!-- attribute binding -->
<div onMouseDown={onMouseDown}>
</div>

<!-- shorthand binding. Equivalent to onClick={onClick} -->
<div {onClick}>
  Here's a child
</div>

<!-- all of someProps properties are applied as attributes to this div -->
<div {...someProps}>
</div>

<!-- a bunch of nodes that you can re-use -->
<part id="message">
  <span>Hello {children}!</span>
</part>

<!-- renders as "Hello World!" -->
<message>
  World
</message>

<!-- Renders a preview of this component -->
<preview>
  <message>
    Some message
  </message>
  <message>
    Another message
  </message>
</preview>
```

# Syntax

## slots

Slots are areas of your template where you can add nodes. For example:

```html
<!-- hello.pc -->
Hello {message}!
```

If you're using React & Webpack, you can import this template like so:

```javascript
import HelloView from "./hello.pc";
export function Hello() {
  // return <HelloView message="World" />
  return <HelloView message={<strong>World</strong>} />;
}
```

## Attribute bindings

Example:

```html
<style>
  div[variant=red] {
    color: red;
  }
  div[variant=blue] {
    color: blue;
  }
</style>

<div variant={variant}> 
  Some text
</div>

<preview>
  <self variant="red" />
  <self variant="blue" />
</preview>
```

<!-- #### spreads -->
#### shorthand

To make things easier, you can shorten how you bind to attributes. For example:

```html
<div {onClick}></div>
```

☝🏻 This is equivalent to:

```html
<div onClick={onClick}></div>
```

## `<import />`

> For a good example of this, check out the [React TodoMVC example](./../examples/react-todomvc).

`<import />` allows you to import templates & CSS into your component files. 

#### Importing components

Suppose you have a simple todo item:

```html
<!-- todo-item.pc -->

<li>{label}</li>
```

You can import that item like so:

```html
<!-- todo-list.pc -->
<import id="todo-item" src="./todo-item.pc">

<ul>
  {todoItems}
</ul>

<preview>
  <self>  
    <todo-item label="wash car" />
    <todo-item label="feed dog" />
  </self>
</preview>
```

TODO:

- Using different parts
- When to use parts in previews
- importing CSS

#### Using different parts

#### Importing CSS

- how this works
- when this is useful

## `<part />`

Parts allow you to split your UI into chunks to use in app code. For example:

```html
<!-- todo-item.pc -->
<part id="LabelInput">
  <input type="text" onChange={onChange} />
</part>

<part id="TodoLabel">
  <div>
    <input type="checkbox" checked={completed}>
    <label onClick={onLabelClick}>{label}</label>
  </div>
</part>

<part id="default">
  <li>
    {children}
  </li>
</part>
```

In your app code, you might have something like:

```javascript
// todo-item.tsx
import TodoItem, {TodoLabel, LabelInput} from "./todo-item.pc";
import {useState} from "react";
export ({item, onChange}) => {
  const [editing, setEditing] = useState(false);
  const onBlur = () = setEditing(false);
  const onLabelClick = () => setEditing(true);

  return <TodoItem>
    {editing ? <LabelInput onChange={onChange} onBlur={onBlur} /> : <TodoLabel onLabelClick={onLabelClick} label={label} completed={item.completed} />}
  </TodoItem>
}
```

#### `no-compile` parameter

The `no-compile` parameter for `part` elements tells the compiler to omit it. 

#### `id="default"`

Assigning `<part id="default">...</part>` makes the part the _default_ export. For example:

```html
<!-- hello.pc -->
<part id="default">
  Hello {message}!
</part>
```

Can be used in other components as:

```html
<!-- app.pc -->
<import id="hello" src="./hello.pc">

<!-- Render: Hello World! -->
<hello message="World" />
```

#### Importing other parts 

## `<preview />`

This is where you setup your components to see what they look like.

```html

<part id="label-input">
  <input {onKeyPress} {onBlur} default-value={label} type="text" class="edit" autofocus="autofocus">
</part>

<part id="todo-label">
  <div class="view">
    <input type="checkbox" class="toggle" onChange={onCheckChange} checked={completed}>
    <label onClick={onLabelClick}>{label}</label> 
    <button class="destroy"></button>
  </div> 
</part>

<part id="default">
  <li class="todo" {completed}>
    {children}
  </li>
</part>

<!-- variant previews -->
<part no-compile id="default-preview">
  <default {completed}>
    <todo-label {label} {completed} />
  </default>
</part>

<part no-compile id="editing-preview">
  <default {completed}>
    <label-input />
  </default>
</part>

<!-- main preview -->
<preview>
  <div class="app">
    <ul>
      <default-preview label="something" completed />
      <default-preview label="something else" />
      <default-preview label="to be continued" />
      <edting-preview />
    </ul>
  </div>
</preview>
```

### `<self />`

Renders the `root` children. 

```html

<part id="bolder">
  <strong>{children}</strong>
</part>

Hello {message}!

<preview>

  <!-- renders: Hello <strong>World!</strong>! -->
  <self message={<bolder>World</bolder>} /> 
</preview>
```

### Fragments (`<></>`)

Fragments are useful if you're looking to render a collection of elements in a slot. For example:

```html
<part id="default">
  {listItems}
</part>

<preview>
  <default listItems={<>
    <li>feed fish</li>
    <li>feed cat</li>
    <li>feed me</li>
  </>} />
</preview>
```