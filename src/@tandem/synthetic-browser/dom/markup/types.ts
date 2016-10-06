import { SyntheticMarkupElement } from "./element";
import { SyntheticDocument } from "../document";

export type syntheticElementClassType = { new(tagName: string, ownerDocument: SyntheticDocument): SyntheticMarkupElement };
