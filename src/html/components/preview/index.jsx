import React from 'react';
import DOMComponent from 'common/react/components/dom';

import { ReactComponentFactoryFragment } from 'common/react/fragments';

export default class PreviewComponent extends React.Component {
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

export const fragment = ReactComponentFactoryFragment.create({
  ns: 'components/preview',
  componentClass: PreviewComponent
});
