import { SyntheticHTMLElement } from "./element";
import { SyntheticHTMLDocument } from "./document";

export type syntheticElementClassType = { new(tagName: string, ownerDocument: SyntheticHTMLDocument): SyntheticHTMLElement };
