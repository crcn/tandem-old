import './index.scss';
import * as React from 'react';
import ToolbarComponent from './toolbar/index';

export default class StageEditorHeaderComponent extends React.Component<any, any> {
  render() {
    return (<div className='m-editor-stage-header'>
      <ToolbarComponent {...this.props} />
    </div>);
  }
}
