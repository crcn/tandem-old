import { PCFile } from "tandem-paperclip-extension/models/pc-file";
import { HTMLDocumentRootEntity } from "tandem-html-extension/lang";

export class PCDocumentRootEntity extends HTMLDocumentRootEntity {
  public document: PCFile;
}