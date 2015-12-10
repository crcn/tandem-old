import './index.scss';

import React from 'react';
import ToolbarComponent from './toolbar';
import FooterComponent from './footer';
import StageComponent from './stage';

/**
* This is where all the visual editing happens
*/

class PreviewComponent extends React.Component {
  render() {
    return <div className='m-preview'>
      <ToolbarComponent {...this.props} />
      <StageComponent {...this.props} />
      <FooterComponent {...this.props} />
    </div>;
  }
}

export default PreviewComponent;
