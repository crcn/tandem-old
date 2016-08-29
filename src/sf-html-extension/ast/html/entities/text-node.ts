import { decode } from "ent";
import { HTMLTextExpression } from "sf-html-extension/ast";
import { HTMLValueNodeEntity } from "./value-node";
import { EntityFactoryDependency } from "sf-core/dependencies";

export class HTMLTextEntity extends HTMLValueNodeEntity<HTMLTextExpression> {
  createDOMNode(nodeValue: any) {
    return document.createTextNode(decode(nodeValue));
  }
}

export const htmlTextDependency             = new EntityFactoryDependency("#text", HTMLTextEntity);
