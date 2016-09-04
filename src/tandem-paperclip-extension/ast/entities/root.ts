import { PCFile } from "tandem-paperclip-extension/models/pc-file";
import { IContextualEntity } from "tandem-common/ast";
import { HTMLDocumentRootEntity } from "tandem-html-extension/ast";

export class PCDocumentRootEntity extends HTMLDocumentRootEntity implements IContextualEntity {
  public document: PCFile;
  get context() {
    return this.document.context;
  }
}