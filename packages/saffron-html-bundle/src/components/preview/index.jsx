import * as React from 'react';

import { ReactComponentFactoryFragment } from 'saffron-common/lib/react/fragments';

export default class PreviewComponent extends React.Component<any, any> {
  componentDidMount() {
    this._update();
  }
  shouldComponentUpdate(props) {
    return this.props.entity !== props.entity;
  }
  componentWillUpdate() {
    this.props.entity.section.remove();
  }
  componentDidUpdate() {
    this._update();
  }
  _update() {
    this.refs.container.appendChild(this.props.entity.section.toFragment());
  }
  render() {
    return (<div ref='container'>

    </div>);
  }
}

export const fragment = new ReactComponentFactoryFragment({
  ns: 'components/preview',
  componentClass: PreviewComponent,
});
