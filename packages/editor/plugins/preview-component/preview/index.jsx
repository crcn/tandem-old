import './index.scss';

import React from 'react';
import Toolbar from './toolbar';
import Stage from './stage';

/**
* This is where all the visual editing happens
*/

class PreviewComponent extends React.Component {
  render() {
    return <div className='m-preview'>
      <Toolbar {...this.props} />
      <Stage {...this.props} />
    </div>;
  }
}

export default PreviewComponent;
