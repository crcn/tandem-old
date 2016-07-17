import './index.scss';

import React from 'react';
import RegisteredComponent from 'common/react/components/registered';

export default class PreviewComponent extends React.Component {
  render() {

    const style = {
      zoom: this.props.zoom
    };

    return (<div className='m-editor-stage-preview' style={style}>
      <div className='m-editor-stage-preview-inner'>
        <RegisteredComponent {...this.props} ns='components/preview' />
      </div>
    </div>);
  }
}
