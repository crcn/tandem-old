import './index.scss';
import 'scss/fonts.scss';

import React from 'react';
import Pane from 'component-pane';
import SidebarComponent from './sidebar';
import CenterComponent from './center';

class MainComponent extends React.Component {
  render() {
    return <div className='m-editor'>
      <SidebarComponent position='left' paneType='app' {...this.props} />
      <CenterComponent />
      <SidebarComponent position='right' paneType='symbol' {...this.props} />
    </div>;
  }
}

export default MainComponent;
