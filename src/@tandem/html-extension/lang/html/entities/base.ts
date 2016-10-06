import { IEntity } from "@tandem/common/lang";
import { IDOMSection } from "@tandem/html-extension/dom";

export interface IHTMLNodeEntity extends IEntity {
  section: IDOMSection;
}
export interface IMarkupElementAttributeEntity extends IEntity {
  name: string;
  value: any;
}