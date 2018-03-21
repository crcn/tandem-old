import { hydrateTdGutter, TdGutterInnerProps } from "./gutter.pc";
import { pure, compose } from "recompose";

export const Gutter = hydrateTdGutter(
  compose<TdGutterInnerProps, any>(pure),
  {}
);
