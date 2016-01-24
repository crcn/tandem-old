import './index.scss';

import React from 'react';
import RegisterComponent from 'common/components/registered';

/**
* This is where all the visual editing happens
*/

class CenterComponent extends React.Component {
  render() {
    return <div className='m-editor-center'>
      <RegisterComponent {...this.props} queryOne={'preview'} />
    </div>;
  }
}

export default CenterComponent;
