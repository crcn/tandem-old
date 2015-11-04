import React from 'react';

var CurvesComponent = React.createClass({
  render: function() {

    var data = [
      {
        name: 'test',
        type: 'box',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        outputs: [
          { name: 'test2' }
        ]
      },
      {
        name: 'test2',
        type: 'box',
        x: 300,
        y: 300,
        width: 100,
        height: 100
      }
    ];

    return <div>Hello World!</div>;
  }
});

export default CurvesComponent;
