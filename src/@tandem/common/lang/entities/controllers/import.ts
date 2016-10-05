import { File } from "@tandem/common/models";
import { BaseEntity } from "../index";
import { Dependencies } from "@tandem/common/dependencies";
import { BaseEntityController } from "./base";


// imports documents into the current one -- examples:
// <link rel="stylesheet" href="./index.scss" type="text/css" />
// @import ""
// import { something } from "./js-module";

// TODO:
// - [ ] expose exported docs
// - [ ] check for already imported documents

export interface IImportContext {
  dependencies: Dependencies;
}

export class EntityImportController extends BaseEntityController {

  public mimeType: string;
  public filePaths: Array<string>;

  constructor(entity: BaseEntity<any>, mimeType?: string, ...filePaths: Array<string>) {
    super(entity);
    this.mimeType  = mimeType;
    this.filePaths = filePaths;
  }

  public async evaluate(context: IImportContext) {
    // TODO

    const { dependencies } = context;

    for (const filePath of this.filePaths) {
      const file = await File.open(filePath, dependencies, this.mimeType);
      /*
      await file.load();
      this.appendChild(file.entity);
      */
    }

    /*
    const { dependencies } = context;
    for (const filePath of this.filePaths) {
      const file = await File.open()
    }
    */
  }
}