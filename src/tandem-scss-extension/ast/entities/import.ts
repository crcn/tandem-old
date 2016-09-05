import * as path from "path";
import { SCSSFile } from "tandem-scss-extension/models";
import { MimeTypes } from "tandem-scss-extension/constants";
import { CSSATRuleExpression } from "tandem-html-extension";
import {
  File,
  BaseEntity,
  watchProperty,
  FileFactoryDependency,
  EntityFactoryDependency,
} from "tandem-common";

export class SCSSImportEntity extends BaseEntity<CSSATRuleExpression> {

  private _file: SCSSFile;

  updateFromSource() {
    super.updateFromSource();
  }

  patch(entity: SCSSImportEntity) {
    super.patch(entity);
    entity._file.dispose();
  }

  async load() {
    await super.load();
    const absolutePath = path.join(
      path.dirname((<File>this.source.source).path),
      this.source.params.replace(/['"]/g, "")
    );


    const file: SCSSFile = this._file = await File.open(absolutePath, this._dependencies, MimeTypes.SCSS) as SCSSFile;
    file.sync();

    await file.load();

    this.appendChild(file.entity);

    watchProperty(file, "content", () => {
      console.log("update imported content");
    });
  }

  cloneLeaf() {
    return new SCSSImportEntity(this.source);
  }
}

export const scssImportEntityFactoryDependency = new EntityFactoryDependency(CSSATRuleExpression, SCSSImportEntity, "import");