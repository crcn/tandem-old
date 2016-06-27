import './index.scss';
import * as React from 'react';

/**
 * provides a set of handles that allows the user to dynamically
 * resize the preview elements 
 */

class Resizer extends React.Component <{
  target:any 
}, {}> {
  render() {

    const target = this.props.target;
    const rect   = target.boundingRect;

    console.log(rect);
    
    return <div id='m-resizer'>

    </div>;
  }
}

export default Resizer;