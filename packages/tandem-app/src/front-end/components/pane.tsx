import { compose, pure } from "recompose";
import { hydrateTdPane, TdPaneProps } from "./pane.pc";

const enhance = compose<TdPaneProps, TdPaneProps>(pure);

export const Pane = hydrateTdPane(enhance, {

});
