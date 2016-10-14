import "./slider.scss";

import * as React from "react";
import * as SliderComponent from "react-slider";
import { FrontEndApplication } from "@tandem/editor/application";
import { HistorySingletonDependency } from "@tandem/history-extension/dependencies";


export class HistorySliderComponent extends React.Component<{ app: FrontEndApplication }, any> {


  onSliderChange(value) {
    var h = this.props.app.editor;
    // h.move(value);
  }

  render() {
    const history = HistorySingletonDependency.getInstance(this.props.app.dependencies);

    if (history.length < 2) {
      return null;
    }

    return <SliderComponent
      max={history.length - 1}
      value={history.position}
      onChange={this.onSliderChange.bind(this)}
      className="m-history-slider" />;
  }
}

