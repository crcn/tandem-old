import React from 'react';
import MainComponent from 'editor/components/main';
import { CallbackNotifier } from 'common/notifiers';

class RootComponent extends React.Component {

  componentDidMount() {
    this.props.app.notifier.push(CallbackNotifier.create(() => {
      this.forceUpdate();
    }));
  }

  render() {
    return <MainComponent {...this.props} />;
  }
}

export default RootComponent;
