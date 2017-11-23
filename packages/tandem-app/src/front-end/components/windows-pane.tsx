import { hydrateTdWindowsPane, TdWindowsPaneInnerProps } from "./windows-pane.pc";
import { compose, pure } from "recompose";

export const WindowsPane = hydrateTdWindowsPane(
  compose<TdWindowsPaneInnerProps, TdWindowsPaneInnerProps>(
    pure
  ),
  {
    TdListItem: null,
    TdWindowsPaneRow: null,
    TdList: null,
    TdPane: null
  }
);