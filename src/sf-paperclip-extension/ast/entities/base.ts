import { IContextualEntity } from "sf-core/ast";
import { IHTMLEntity, IHTMLContainerEntity } from "sf-html-extension/ast";

export interface IPCEntity extends IContextualEntity, IHTMLEntity {
  parent: IHTMLContainerEntity;
  context: any;
  flatten(): Array<IHTMLEntity>;
}

export interface IPContainerEntity extends IPCEntity, IHTMLContainerEntity {
  parent: IHTMLContainerEntity;
  flatten(): Array<IPCEntity>;
}