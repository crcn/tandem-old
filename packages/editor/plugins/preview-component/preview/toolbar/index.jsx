import './index.scss'
import React from 'react';
import sift from 'sift';
import ToolComponent from './tool';

class ToolsComponent extends React.Component {
  render() {

    // TODO - these can be added as entries as well
    return <div className='m-editor-toolbar'>
      <ul className='m-toolbar-tools'>
        {
          this.props.app.plugins.filter(sift({
            type: 'previewTool'
          })).map((entry) => {
            return <ToolComponent entry={entry} key={entry.id} preview={this.props.app.preview} />;
          })
        }
      </ul>
    </div>
  }
}

export default ToolsComponent;
