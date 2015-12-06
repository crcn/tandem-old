import React from 'react';
import Pane from 'component-pane';
import SidebarComponent from './sidebar';
import ToolbarComponent from './toolbar';

class MainComponent extends React.Component {
  render() {
    return <div className='m-editor'>
      <ToolbarComponent {...this.props} />
      <SidebarComponent position='left' paneType='app' {...this.props} />
      <SidebarComponent position='right' paneType='symbol' {...this.props} />
    </div>;
  }
}

export default MainComponent;
