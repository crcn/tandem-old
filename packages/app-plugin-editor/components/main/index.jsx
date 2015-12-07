import './index.scss';

import React from 'react';
import Pane from 'component-pane';
import SidebarComponent from './sidebar';
import ToolsComponent from './tools';

class MainComponent extends React.Component {
  render() {
    return <div className='m-editor'>
      <SidebarComponent position='left' paneType='app' {...this.props} />
      <SidebarComponent position='right' paneType='symbol' {...this.props} />
    </div>;
  }
}

export default MainComponent;
