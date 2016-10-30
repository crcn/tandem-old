import "./slider.scss";

import * as React from "react";
import * as SliderComponent from "react-slider";
import { FrontEndApplication } from "@tandem/editor/browser";
// import { HistorySingletonProvider } from "@tandem/history-extension/providers";


export class HistorySliderComponent extends React.Component<{ app: FrontEndApplication }, any> {

  get history(): any {
    return {};
    // return HistorySingletonProvider.getInstance(this.props.app.injector);
  }

  onSliderChange(value) {
    var h = this.props.app.workspace;
    // h.move(value);

    this.history.position = value;
  }

  render() {
    const history = this.history;

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

