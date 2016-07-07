import './index.scss';

import React from 'react';
import RegisteredComponent from 'common/react/components/registered';
import StageToolsComponent from './tools';

export default class StageComponent extends React.Component {
  render() {
    return <div className='m-editor-stage'>
      <RegisteredComponent {...this.props} ns='components/preview' />
      <StageToolsComponent {...this.props} />
    </div>;
  };
}
