import './index.scss';
import 'editor/scss/fonts.scss';

import React from 'react';
import SidebarComponent from './sidebar';
import CenterComponent from './center';

class MainComponent extends React.Component {
  render() {

    var focus = this.props.app.focus;

    return <div className='m-editor'>

      <SidebarComponent
        position='left'
        query={{ paneType: 'app' }}
        {...this.props} />
      <CenterComponent {...this.props} />

      <SidebarComponent
        position='right'
        query={{
          paneType: 'entity',
          entity: focus
        }}
        {...this.props} />
    </div>;
  }
}

export default MainComponent;
