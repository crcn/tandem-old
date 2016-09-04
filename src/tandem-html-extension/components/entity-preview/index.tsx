import * as React  from "react";
import { IApplication } from "tandem-common/application";
import { HTMLDocumentRootEntity } from "tandem-html-extension/ast";
import { EntityPreviewDependency } from "tandem-front-end/dependencies";

export default class PreviewComponent extends React.Component<{ entity: HTMLDocumentRootEntity }, any> {
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
    return (<div ref="container">

    </div>);
  }
}

export const dependency = new EntityPreviewDependency(PreviewComponent);
