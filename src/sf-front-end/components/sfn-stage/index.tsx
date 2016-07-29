import "./index.scss";

import * as React from "react";
import HeaderComponent from "./header";
import FooterComponent from "./footer";
import CanvasComponent from "./canvas";
import { ReactComponentFactoryFragment } from "sf-front-end/fragments";
import { FragmentDictionary } from "sf-core/fragments";
import { FrontEndApplication } from "sf-front-end/application";
import { Editor } from "sf-front-end/models";

export default class StageComponent extends React.Component<{ app: FrontEndApplication, fragments: FragmentDictionary }, any> {
  render() {

    const editor = this.props.app.editor;

    // entity might not have been loaded yet
    if (!editor.file) return null;
    return (<div className="m-editor-stage noselect">
      <HeaderComponent {...this.props} editor={editor} />
      <CanvasComponent {...this.props} editor={editor} />
      <FooterComponent {...this.props} editor={editor} />
    </div>);
  }
}


export const fragment = new ReactComponentFactoryFragment("components/stage/sfn", StageComponent);
