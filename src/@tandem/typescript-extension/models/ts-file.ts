import { DocumentFile } from "@tandem/front-end/models";
// import { TSRootEntity, TSExpressionLoader, TSRootExpression } from "@tandem/typescript-extension/lang";
import { MimeTypes } from "@tandem/typescript-extension/constants";
import {
  FileFactoryDependency
} from "@tandem/common";

export class TSFile extends DocumentFile<any> {
  createExpressionLoader() {
    // return new TSExpressionLoader();
    return null;
  }
  createEntity(ast: any) {
    // return new TSRootEntity(ast);
    return null;
  }
}

export const tsFileFactoryDependency = new FileFactoryDependency(MimeTypes.TS, TSFile);