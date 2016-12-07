import "./index.scss";

import React =  require("react");
import { ReactComponentFactoryProvider } from "@tandem/editor/browser/providers";
import { Workspace } from "@tandem/editor/browser/stores";

export class GridStageToolComponent extends React.Component<{ workspace: Workspace }, any> {
  render() {

    const { workspace } = this.props;

    if (workspace.zoom <= 12) return null;

    const size = 20000;
    const gridSize = 1;
    const paths = [

      // horizontal
      [[0, 0], [gridSize, 0]],

      // vertical
      [[0, 0], [0, gridSize]]
    ];

    return (<div className="m-grid-tool" style={{left: -size / 2, top: -size / 2 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

        <defs>
          <pattern id="grid" width={gridSize / size} height={gridSize / size}>
            <g stroke="#d8d8d8">
              {
                paths.map(([[sx, sy], [ex, ey]], i) => {
                  return <path strokeWidth={1 / workspace.zoom} key={i} d={`M${sx},${sy} L${ex},${ey}`}></path>;
                })
              }
            </g>
          </pattern>
        </defs>
        <rect fill="url(#grid)" width={size} height={size} />
      </svg>
    </div>);
  }
}


