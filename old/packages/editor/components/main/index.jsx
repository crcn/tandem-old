import './index.scss';
import 'editor/scss/fonts.scss';

import React from 'react';
import CenterComponent from './center';
import SidebarComponent from './sidebar';

class MainComponent extends React.Component {

  componentDidMount() {
    this.props.app.notifier.push(this);
  }

  getChildContext() {
    return {
      app: this.props.app
    }
  }

  notify() {

    // raf now if testing
    if (this.props.app.testMode) return this.forceUpdate();

    // TODO - possibly throttle here
    if (this._running) return;
    this._running = true;
    requestAnimationFrame(() => {
      this._running = false;
      this.setState({});
    })
  }

  render() {

    var selection = this.props.app.selection;

    return <div className='m-editor'>

      { !this.props.app.settings.hideLeftSidebar ? <SidebarComponent
        {...this.props}
        position='left'
        maxWidth={400}
        query={'panes/app'} /> : void 0 }

      <CenterComponent {...this.props} />

      { !this.props.app.settings.hideRightSidebar ? <SidebarComponent
        {...this.props}
        position='right'
        query={'panes/entity/' + selection.type}
        selection={selection} /> : void 0 }

    </div>;
  }
}

MainComponent.childContextTypes = {
  app: React.PropTypes.object
}

export default MainComponent;
