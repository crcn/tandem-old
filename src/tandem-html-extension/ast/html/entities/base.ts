import { IEntity } from "tandem-common/ast";
import { IDOMSection } from "tandem-html-extension/dom";

export interface IHTMLNodeEntity extends IEntity {
  section: IDOMSection;
}
export interface IHTMLElementAttributeEntity extends IEntity {
  name: string;
  value: any;
}