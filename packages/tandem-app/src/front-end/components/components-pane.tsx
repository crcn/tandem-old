import { compose, pure } from "recompose";
import { hydrateTdComponentsPane, TdComponentsPaneProps } from "./components-pane.pc";
import { Pane } from "./pane";

const enhancer = compose<TdComponentsPaneProps, TdComponentsPaneProps>(pure);

export const ComponentsPane = hydrateTdComponentsPane(enhancer, {
  TdPane: Pane
});
