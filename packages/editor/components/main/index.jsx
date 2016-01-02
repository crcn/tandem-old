import './index.scss';
import 'editor/scss/fonts.scss';

import React from 'react';
import CenterComponent from './center';
import SidebarComponent from './sidebar';

class MainComponent extends React.Component {

  componentDidMount() {
    this.props.app.notifier.push(this);
  }

  notify() {
    // TODO - possibly throttle here
    this.forceUpdate();
  }

  render() {

    var focus = this.props.app.focus;

    return <div className='m-editor'>

      <SidebarComponent
        {...this.props}
        position='left'
        query={{ paneType: 'app' }} />
      <CenterComponent {...this.props} />

      <SidebarComponent
        {...this.props}
        position='right'
        query={{
          componentType: 'pane',
          paneType: 'entity',
          entity: focus
        }}
        entity={focus} />

    </div>;
  }
}

export default MainComponent;
