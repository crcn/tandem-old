import './index.scss';
import React from 'react';
import RegisteredComponent from 'common/react/components/registered';
import ToolbarComponent from './toolbar';

export default class StageEditorHeaderComponent extends React.Component {
  render() {
    return <div className='m-editor-stage-header'>
      <ToolbarComponent {...this.props} />
    </div>
  }
}
