import './index.scss';

import * as React from 'react';
import RegisteredComponent from 'saffron-front-end/src/components/registered';

export default class PreviewComponent extends React.Component<any, any> {
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
