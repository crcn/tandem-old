import { hydrateTdGutter, TdGutterProps } from "./gutter.pc";
import { pure, compose } from "recompose";

export const Gutter = hydrateTdGutter(
  compose<TdGutterProps, TdGutterProps>(pure),
  {}
);
