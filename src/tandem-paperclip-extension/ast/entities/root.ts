import { PCFile } from "tandem-paperclip-extension/models/pc-file";
import { HTMLDocumentRootEntity } from "tandem-html-extension/ast";

export class PCDocumentRootEntity extends HTMLDocumentRootEntity {
  public document: PCFile;
}