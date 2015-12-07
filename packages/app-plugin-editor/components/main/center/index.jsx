import './index.scss';

import React from 'react';
import Toolbar from './toolbar';

/**
* This is where all the visual editing happens
*/

class StageComponent extends React.Component {
  render() {
    return <div className='m-editor-center'>
      <Toolbar {...this.props} />
    </div>;
  }
}

export default StageComponent;
