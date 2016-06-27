import './index.scss';

import * as React from 'react';
import Resizer from './resizer';

/**
 * Stage component is the view that displays the preview of the current project,
 * and also provides handling tools for manipulating preview elements.
 */

class Stage extends React.Component<{}, {}> {
  render() {

    var target = {
      get boundingRect() {
        return {
          width: 100,
          height: 100,
          x: 100,
          y: 100
        };
      }
    };

    return <div className='m-stage'> 
      <Resizer target={target} />
    </div>;
  }
}

export default Stage;