import * as React from "react";
import { compose, pure } from "recompose";
import { hydrateTdComponentsPane, TdComponentsPaneProps, hydrateTdComponentsPaneCell, TdComponentsPaneCellProps, } from "./components-pane.pc";
import { Pane } from "./pane";

const ICON_SIZE = 110;

const enhanceComponentsPane = compose<TdComponentsPaneProps, TdComponentsPaneProps>(pure);
const enhanceComponentsPaneCell = compose<TdComponentsPaneCellProps, TdComponentsPaneCellProps>(
  pure,
  (Base: React.ComponentClass<TdComponentsPaneCellProps>) => ({ label, screenshot }: TdComponentsPaneCellProps) => {
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
  TdComponentsPaneCell: hydrateTdComponentsPaneCell(enhanceComponentsPaneCell, {})
});
