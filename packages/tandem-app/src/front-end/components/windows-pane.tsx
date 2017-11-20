import { hydrateTdWindowsPane, TdWindowsPaneProps } from "./windows-pane.pc";
import { compose, pure } from "recompose";

export const WindowsPane = hydrateTdWindowsPane(
  compose<TdWindowsPaneProps, TdWindowsPaneProps>(
    pure
  ),
  {
    TdListItem: null,
    TdWindowsPaneRow: null,
    TdList: null,
    TdPane: null
  }
);