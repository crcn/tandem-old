Simple drag & drop component

```javascript
<Draggable model={modelData}>
    <Component />
</Draggable>

<Droppable onDrop={(event) => event.target.model}>
    <Component />
</Droppable>
```

#### Features

- highlight droppable components when items are dragged
