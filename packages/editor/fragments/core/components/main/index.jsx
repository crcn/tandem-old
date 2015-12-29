import './index.scss';
import 'editor/scss/fonts.scss';

import React from 'react';
import CenterComponent from './center';
import SidebarComponent from './sidebar';

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
          componentType: 'pane',
          paneType: 'entity',
          entity: focus
        }}
        entity={focus}
        {...this.props} />

    </div>;
  }
}

export default MainComponent;
