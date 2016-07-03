var node = Div.create({
}, [
  HorizontalLayout.create({ width: '90%' }),
  Div.create({ width: '50%' }),
  Div.create({ width: '50%' })
]);

// transpiled to
<div>
  <div width='45%'>
  </div>
</div>
