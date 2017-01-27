import "./index.scss";
import React = require("react");
import { flattenDeep } from "lodash";
import { BaseSyntheticBrowser, SyntheticCSSMediaRule } from "@tandem/synthetic-browser";

export class MediaQueriesComponent extends React.Component<{ activeSyntheticBrowser: BaseSyntheticBrowser }, any> {
  render() {
    const measurements = [];
    for (let i = 0; i <= 24; i++) {
      measurements.push(i * 200);
    }
  
    const { activeSyntheticBrowser } = this.props;

    if (!activeSyntheticBrowser.window) return null;

    // TODO - this should be added to a store instead of here. Okay for MVP.
    const mediaQueries =  flattenDeep(activeSyntheticBrowser.document.styleSheets.map((ss) => {
      return ss.cssRules.filter((rule) => rule instanceof SyntheticCSSMediaRule);
    }));

    const currentWidth = activeSyntheticBrowser.window.innerWidth;


    const media = [];

    return <div className="media-queries-component">
        <ul className="ruler">
          { measurements.map((m) => <li key={m}>{ m }</li>) }
        </ul>
        <div className="current-width" style={{ left: currentWidth * 0.5 }}>
        </div>
        <ul className="media" style={{ width: 25 * 100 }}>
          {
            media.map((m) => {
              return <li style={{ left: 100, width: 200 }}>
                <label className="min">100px</label>
                <label className="max">300px</label>
              </li>;
            })
          }
        </ul>
    </div>;
  }
}