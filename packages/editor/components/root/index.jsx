import React from 'react';
import MainComponent from 'editor/components/main';

class RootComponent extends React.Component {

  componentDidMount() {
    this.props.app.notifier.push(this);
  }

  notify() {
    // if (this._timer != void 0) return;
    this.forceUpdate();
    // this._timer = setTimeout(() => {
    //   console.log('okup');
    //   this.forceUpdate();
    // }, 1);
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  render() {
    // this._timer = void 0;
    return <MainComponent {...this.props} />;
  }
}

export default RootComponent;
