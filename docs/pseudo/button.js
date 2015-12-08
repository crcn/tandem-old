// different types of outlets


var button = Symbol.create({
  type: 'button',
  id: 'login'
}, [
  Symbol.create({
    type: 'text',
    id: ''
  }),
  Symbol.create({
    id: 'state1',
    type: 'state',
    properties: {
      x: 100,
      y: 100
    }
  },[
    Symbol.create({
      type: 'input',
      source: 'login',
      prop
    })
  ])
]);

transpile(
  html,
  react
)

var runtime = button.initialize();
var refs    = runtime.context.login;

button.observe(function(message) {

});
