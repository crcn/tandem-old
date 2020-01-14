Example:

```html

<!-- importing a component. ID is assigned to the import tag, but using
it instantiates a new component instance -->
<import id="custom-button" src="./path/to/custom-button.pc" />

<custom-button />

<!-- styles are scoped to this file -->
<style>
  div {
    
  }
</style>

<div>
  this is a component example
  {{content}}
</div>
```

#### Limitations