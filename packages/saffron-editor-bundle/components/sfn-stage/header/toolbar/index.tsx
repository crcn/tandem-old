import './index.scss';
import * as React from 'react';
import ToolComponent from './tool';

class ToolsComponent extends React.Component<any, any> {
  render() {

    // TODO - these can be added as entries as well
    return (<div className='m-editor-toolbar'>
      <ul className='m-toolbar-tools'>
        {
          this
            .props
            .app
            .stageTools
            .filter((stageTool) => !!stageTool.icon).map((stageTool) => (
              <ToolComponent {...this.props} tool={stageTool} key={stageTool.name} />)
            )
        }
      </ul>
    </div>);
  }
}

export default ToolsComponent;
