


//
var symbol = Symbol.create({
  type: 'fetch',
  url: 'http://url.com'
});

// just runs a fetch - on finish dispatch notification
var runtime = symbol.run({
  notifier: function(message) {
    // { id: symbolId, output: [1, 2, 3] }
  }
});


var s = Symbol.create({
  type: 'assign'
}, [
  Symbol.create({
    type: 'variable',
    name: 'test'
  }),
  Symbol.create({
    type: 'fetch',
    url: 'http://url.com'
  })
])


var runtime = s.run({
  notifier: function(message) {
  }
});
