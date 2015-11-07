import React from 'react';
import Line from '../line';
import Stage from '../stage';
import Obj from '../project/object';

var MainComponent = React.createClass({
  componentDidMount: function() {

    this.props.bus.execute({ action: 'tail' }).pipeTo({
      write: () => {
        this.forceUpdate();
      },
      abort: function() { },
      close: function() { }
    });

  },
  render: function() {

    var points = [
      { x: 10, y: 0    },
      { x: 10, y: 100  },
      { x: 110, y: 100 }
    ];

    var currentTarget = this.props.currentTarget;


    return <Stage>

      {
        (currentTarget.children || []).map((child, i) => {
          return <Obj target={child} key={i} />
        })
      }

    </Stage>;
  }
});

export default MainComponent;
