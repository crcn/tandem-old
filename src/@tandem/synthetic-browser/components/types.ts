import { ISyntheticComponent } from "./base";
import { SyntheticDOMNode } from "../dom";

export type syntheticComponentType = { new(source: SyntheticDOMNode): ISyntheticComponent };
