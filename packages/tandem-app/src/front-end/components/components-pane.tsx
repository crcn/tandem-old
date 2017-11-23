import * as React from "react";
import { compose, pure } from "recompose";
import { hydrateTdComponentsPane, TdComponentsPaneInnerProps, hydrateTdComponentsPaneCell, TdComponentsPaneCellInnerProps, } from "./components-pane.pc";
import { Pane } from "./pane";
import { Workspace } from "front-end/state";

const ICON_SIZE = 110;

export type ComponentsPaneOuterProps = {
  workspace: Workspace
};

const enhanceComponentsPane = compose<TdComponentsPaneInnerProps, ComponentsPaneOuterProps>(
  pure,
  (Base: React.ComponentClass<TdComponentsPaneInnerProps>) => ({ workspace }: ComponentsPaneOuterProps) => <Base components={workspace.availableComponents || []} />
);

const enhanceComponentsPaneCell = compose<TdComponentsPaneCellInnerProps, TdComponentsPaneCellInnerProps>(
  pure,
  (Base: React.ComponentClass<TdComponentsPaneCellInnerProps>) => ({ label, screenshot }: TdComponentsPaneCellInnerProps) => {
    let width = screenshot && screenshot.clip.right - screenshot.clip.left;
    let height = screenshot && screenshot.clip.bottom - screenshot.clip.top;
    let scale = 1;

    if (width >= height && width > ICON_SIZE) {
      scale = ICON_SIZE / width;
    } else if (height >= width && height > ICON_SIZE) {
      scale = ICON_SIZE / height;
    }

    // const larger = Math.max(width, height);
    // const ratio = CELL_SIZE
    return <Base label={label} screenshot={screenshot} screenshotScale={scale} hovering={false} />
  }
)

export const ComponentsPane = hydrateTdComponentsPane(enhanceComponentsPane, {
  TdPane: Pane,
  TdComponentsPaneCell: hydrateTdComponentsPaneCell(enhanceComponentsPaneCell, {
    
  })
});
