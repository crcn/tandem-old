 import { IApplication } from 'sf-core/application';
 import { EntityPreviewFragment } from 'sf-front-end/fragments';

 import * as React  from 'react';


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
    (this.refs as any).container.appendChild(this.props.entity.section.toFragment());
  }
  render() {
    return (<div ref='container'>

    </div>);
  }
}


export const fragment = new EntityPreviewFragment(PreviewComponent);