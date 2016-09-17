import { BaseEntityController } from "./base";
import { BaseEntity } from "../index";


// imports documents into the current one -- examples:
// <link rel="stylesheet" href="./index.scss" type="text/css" />
// @import ""
// import { something } from "./js-module";

// TODO:
// - [ ] expose exported docs
// - [ ] check for already imported documents
export class EntityImportController extends BaseEntityController {

  public mimeType: string;
  public filePaths: Array<string>;

  constructor(entity: BaseEntity<any>, mimeType: string, ...filePaths: Array<string>) {
    super(entity);
    this.mimeType  = mimeType;
    this.filePaths = filePaths;
  }

  public async evaluate(context: any) {
    // TODO
  }
}