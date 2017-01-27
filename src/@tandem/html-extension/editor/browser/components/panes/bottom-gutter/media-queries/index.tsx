import "./index.scss";
import React = require("react");
import { flattenDeep } from "lodash";
import { SyntheticSourceLink } from "@tandem/editor/browser/components";
import { 
  parseCSSMedia,
  BaseSyntheticBrowser, 
  SyntheticCSSMediaRule, 
  CSSMediaFeatureExpression,
  CSSMediaQueryListExpression,
} from "@tandem/synthetic-browser";


class CSSMediaModel {
  readonly media: CSSMediaQueryListExpression;
  constructor(readonly target: SyntheticCSSMediaRule) {
    this.media = parseCSSMedia(target.media[0]);
  }

  getRawPropertyValue(name: string): string {
    let found: CSSMediaFeatureExpression;

    this.media.items.forEach((item) => {
      item.features.forEach((feature) => {
        if (feature.name === name) found = feature;
      })
    });

    return found && found.value;
  }

  getPropertyValue(name: string): string|number {
    const value = this.getRawPropertyValue(name);
    return /width|height/.test(name) && value ? this.parseFeatureValue(value) : value;
  }

  private parseFeatureValue(value: string): number {
    return Number(value.match(/[\-\d\.]+/));
  }
}

// TODO - ui around height constraints

export class MediaQueriesComponent extends React.Component<{ activeSyntheticBrowser: BaseSyntheticBrowser }, any> {
  render() {
    const measurements = [];
    for (let i = 0; i <= 24; i++) {
      measurements.push(i * 200);
    }
  
    const { activeSyntheticBrowser } = this.props;

    if (!activeSyntheticBrowser.window) return null;

    // TODO - this should be added to a store instead of here. Okay for MVP.
    const mediaQueryModels =  flattenDeep(activeSyntheticBrowser.document.styleSheets.map((ss) => {
      return ss.cssRules.filter((rule) => rule instanceof SyntheticCSSMediaRule);
    })).map((target) => new CSSMediaModel(target as SyntheticCSSMediaRule));

    const currentWidth = activeSyntheticBrowser.window.innerWidth;

    const MAX_WIDTH = 25 * 100;

    return <div className="media-queries-component">
        <ul className="ruler">
          { measurements.map((m) => <li key={m}>{ m }</li>) }
        </ul>
        <div className="current-width" style={{ left: currentWidth * 0.5 }}>
        </div>
        <ul className="media" style={{ width: MAX_WIDTH }}>
          {
            mediaQueryModels.map((m) => {
              
              const minWidth  = m.getPropertyValue("min-width");
              const minHeight = m.getPropertyValue("min-height");
              const width     = m.getPropertyValue("width");
              const height    = m.getPropertyValue("height");
              const maxWidth  = m.getPropertyValue("max-width");
              const maxHeight  = m.getPropertyValue("max-height");

              const left = Number(width || minWidth || 0);

              return <li key={m.target.uid} style={{ left: left * 0.5, width: maxWidth ? (Number(maxWidth) - left) * 0.5 : MAX_WIDTH - left * 0.5 }}>
                <SyntheticSourceLink target={m.target}>
                  <div className="item">
                    <label className="min">{ m.getRawPropertyValue("min-width") }</label>
                    <label className="max">{ m.getRawPropertyValue("max-width") }</label>
                  </div>
                </SyntheticSourceLink>
              </li>;
            })
          }
        </ul>
    </div>;
  }
}