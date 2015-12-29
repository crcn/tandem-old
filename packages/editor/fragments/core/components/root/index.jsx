import React from 'react';
import MainComponent from '../main';

class RootComponent extends React.Component {

  componentDidMount() {
    this.props.app.notifier.push(this);
  }

  notify() {

    // TODO - possibly throttle here
    this.forceUpdate();
  }

  render() {
    return <MainComponent {...this.props} />;
  }
}

export default RootComponent;
