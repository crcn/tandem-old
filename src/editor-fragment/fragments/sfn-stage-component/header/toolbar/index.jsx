import './index.scss'
import React from 'react';
import ToolComponent from './tool';

class ToolsComponent extends React.Component {
  render() {

    // TODO - these can be added as entries as well
    return <div className='m-editor-toolbar'>
      <ul className='m-toolbar-tools'>
        {
          this
          .props
          .app
          .fragmentDictionary
          .queryAll('preview/tools/**').filter((fragment) => !!fragment.icon).
            map((fragment) => {
            return <ToolComponent {...this.props} fragment={fragment} key={fragment.ns} />;
          })
        }
      </ul>
    </div>
  }
}

export default ToolsComponent;
