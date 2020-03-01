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

## Syntax

### slots

Slots are areas of your template where you can add nodes. For example:

```html
Hello {message}!
```

Combinding the `<preview />`, and `<self />` tags, you might have something like:

```html
Hello {message}!

<preview>
  <self message="World" />
</preview>
```

### attribute bindings

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

Shorthand bindings are an easier of defining props that share the same name:

```html
<div {onClick}></div>
```

### <part />

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

### <import />

Imports a component into the template:


### <preview />


### <self />