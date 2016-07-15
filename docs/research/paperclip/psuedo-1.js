var xml = `
<div>hello {name}</div>
`

var template = createElement('div', {}, [
  createText('hello'),
  createBlock(function(context) {
      return context.name;
  })
]);

var context = {};

// can be memoized as well
var view = template.create(context, {
  div: {
    create(name, attributes, children) {
      return {
        freeze() {
          document.createElement(name, attributes, children)
        }
      };
    }
  }
});
document.body.appendChild(view.element);
context.name = 'joe';
view.update();
