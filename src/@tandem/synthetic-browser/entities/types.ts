import { BaseSyntheticDOMNodeEntity } from "./base";
import { SyntheticDOMNode } from "../dom";

export type syntheticEntityType = { new(source: SyntheticDOMNode): BaseSyntheticDOMNodeEntity<any, any> };
