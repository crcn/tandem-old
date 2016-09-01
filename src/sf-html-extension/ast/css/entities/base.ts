import { CSSFile } from "sf-html-extension/models";
import { INodeEntity } from "sf-core/ast";

export interface ICSSEntity extends INodeEntity {
  document: CSSFile;
}

export interface ICSSRuleEntity extends ICSSEntity {
  selectedHTMLEntities: Array<INodeEntity>;
}