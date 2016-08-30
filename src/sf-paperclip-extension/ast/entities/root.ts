import { PCFile } from "sf-paperclip-extension/models/pc-file";
import { IContextualEntity } from "sf-core/ast";
import { HTMLDocumentRootEntity } from "sf-html-extension/ast";

export class PCDocumentRootEntity extends HTMLDocumentRootEntity implements IContextualEntity {
  public document: PCFile;
  get context() {
    return this.document.context;
  }
}