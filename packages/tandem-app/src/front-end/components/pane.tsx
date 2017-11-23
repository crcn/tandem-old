import { compose, pure } from "recompose";
import { hydrateTdPane, TdPaneInnerProps } from "./pane.pc";

const enhance = compose<TdPaneInnerProps, TdPaneInnerProps>(pure);

export const Pane = hydrateTdPane(enhance, {

});
