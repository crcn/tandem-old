import { BaseDOMNodeEntity } from "./base";
import { SyntheticDOMNode } from "../dom";

export type entityType = { new(source: SyntheticDOMNode): BaseDOMNodeEntity<any, any> };
