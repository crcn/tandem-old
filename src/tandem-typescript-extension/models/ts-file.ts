import { DocumentFile } from "tandem-front-end/models";
import { TSRootEntity, TSExpressionLoader, TSRootExpression } from "tandem-typescript-extension/lang";
import { MimeTypes } from "tandem-typescript-extension/constants";
import {
  FileFactoryDependency
} from "tandem-common";

export class TSFile extends DocumentFile<TSRootEntity> {
  createExpressionLoader() {
    return new TSExpressionLoader();
  }
  createEntity(ast: TSRootExpression) {
    return new TSRootEntity(ast);
  }
}

export const tsFileFactoryDependency = new FileFactoryDependency(MimeTypes.TS, TSFile);