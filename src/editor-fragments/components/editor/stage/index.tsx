import './index.scss';
import * as React from 'react';

import BaseApplication from 'common/application/base';
import PreviewLayerComponent from './preview-layer/index';
import ToolsLayerComponent from './tools-layer/index';

export default class StageComponent extends React.Component<{app:BaseApplication}, {}> {
  render() {
    return <div className='m-editor-stage'>
      <PreviewLayerComponent app={this.props.app} />
      <ToolsLayerComponent />
    </div>;
  }
}