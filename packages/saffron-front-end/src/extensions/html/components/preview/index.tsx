import * as React from 'react';

import { ReactComponentFactoryFragment } from 'saffron-front-end/src/fragments/index';

export default class PreviewComponent extends React.Component<any, any> {
  componentDidMount() {
    this._update();
  }
  shouldComponentUpdate(props) {
    return this.props.entity !== props.entity;
  }
  componentWillUpdate() {
    this.props.entity.symbolTable.getValue('currentSection').remove();
  }
  componentDidUpdate() {
    this._update();
  }
  _update() {
    (this.refs as any).container.appendChild(this.props.entity.symbolTable.getValue('currentSection').toFragment());
  }
  render() {
    return (<div ref='container'>

    </div>);
  }
}

export const fragment = new ReactComponentFactoryFragment('components/preview', PreviewComponent);
