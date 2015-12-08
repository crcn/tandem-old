var symbol = Node.create({
  type: 'component',
  properties: {
    x: 0,
    y: 0
  }
}, [
  Node.create({
    type: 'state',
    properties: {
      x: 100,
      y: 100
    }
  })
]);

var symbol = Symbol.create({
  type: 'context'
}, [
  Symbol.create({
    type: 'textComponent'
  }, [
    Symbol.create({
      type: 'assign',
      to: 'label',
      from: 'label'
    })
  ])
]);

// change from some other input
symbol.observe(function(message, state) {
  symbol.output();
});

// trigger change
symbol.input({
  label: 'Hello'
}, function(message, state) {
  // state.view
});

var symbol = Symbol.create({
  type: 'symbolTable'
}, [
  Symbol.create()
]);

var symbol = Symbol.create({
  registry : registry,
  entryId  : 'componentId'
});

var o = symbol.output();
console.log(o.view);

var callSymbol = Symbol.create({
  method: function() {

  },
  notifier: function(message) {
    callSymbol.output();
  }
});

callSymbol.input()




symbol.notifier.push(function() {
  var outputs = symbol.update();
});

// transpiled
