import './index.scss'
import React from 'react';

class ToolsComponent extends React.Component {
  render() {
    return <div className='m-editor-toolbar'>
      <ul className='m-toolbar-tools'>

        <li className='s s-puzzle'></li>
        <li className='s s-shapes'></li>
        <li className='s s-cursor'></li>
        <li className='s s-text'></li>
      </ul>
    </div>
  }
}

export default ToolsComponent;
