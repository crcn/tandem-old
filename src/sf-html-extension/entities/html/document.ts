import { IHTMLEntity, IHTMLDocument } from "./base";
import { DocumentEntityFactoryDependency } from "sf-core/dependencies";
import { IEntity, IEntityEngine, IVisibleEntity, IElementEntity, findEntitiesBySource } from "sf-core/entities";
import { parse as parseCSS } from "sf-html-extension/parsers/css";
import { CSSStyleExpression, CSSStyleSheetExpression } from "sf-html-extension/parsers/css/expressions";

import {
  HTMLExpression,
  HTMLTextExpression,
  HTMLCommentExpression,
  HTMLElementExpression,
  HTMLFragmentExpression,
  HTMLAttributeExpression,
  IHTMLValueNodeExpression,
} from "../../parsers/html/expressions";

import { ContainerNode } from "sf-core/markup";

export class HTMLDocumentEntity extends ContainerNode implements IHTMLDocument {

  readonly stylesheet: CSSStyleSheetExpression = new CSSStyleSheetExpression([], null);

  cloneNode(deep?: boolean) {
    const clone = new HTMLDocumentEntity();
    if (deep)
    for (const child of this.childNodes) {
      clone.appendChild(<IHTMLEntity>child.cloneNode(true));
    }
    return clone;
  }

  _unlink(child: IHTMLEntity) {
    super._unlink(child);
    child.document = undefined;
  }

  _link(child: IHTMLEntity) {
    super._unlink(child);
    child.document = this;
  }
}

export const htmlDocumentDependency  = new DocumentEntityFactoryDependency(HTMLDocumentEntity);
