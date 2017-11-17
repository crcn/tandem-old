import { compose, pure } from "recompose";
import { TdComponentsPaneEnhancer, TdComponentsPaneProps } from "./components-pane.pc";

export const enhanceTdComponentsPane: TdComponentsPaneEnhancer = compose<TdComponentsPaneProps, TdComponentsPaneProps>(pure);

