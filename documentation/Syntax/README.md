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
### <import />
### <preview />
### <self />