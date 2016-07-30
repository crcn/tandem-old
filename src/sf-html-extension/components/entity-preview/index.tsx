import { IApplication } from "sf-core/application";
import { EntityPreviewDependency } from "sf-front-end/dependencies";
import * as React  from "react";

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
    (this.refs as any).container.appendChild(this.props.entity.section.toDependency());
  }
  render() {
    return (<div ref="container">

    </div>);
  }
}

export const dependency = new EntityPreviewDependency(PreviewComponent);
