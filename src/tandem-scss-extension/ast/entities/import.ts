import * as path from "path";
import { SCSSFile } from "tandem-scss-extension/models";
import { MimeTypes } from "tandem-scss-extension/constants";
import { CSSATRuleExpression } from "tandem-html-extension";
import { parseSCSS } from "tandem-scss-extension/ast";
import {
  File,
  BubbleBus,
  BaseEntity,
  EntityAction,
  watchProperty,
  ReadFileAction,
  WatchFileAction,
  FileFactoryDependency,
  EntityFactoryDependency,
} from "tandem-common";

export class SCSSImportEntity extends BaseEntity<CSSATRuleExpression> {

  private _file: SCSSFile;

  get href() {
    return path.join(
      path.dirname((<File>this.source.source).path),
      this.source.params.replace(/['"]/g, "")
    );
  }

  async load() {
    await super.load();
    const absolutePath = this.href;

    const file: SCSSFile = this._file = await File.open(absolutePath, this.dependencies, MimeTypes.SCSS) as SCSSFile;
    file.observe(new BubbleBus(this));
    file.sync();

    file.imported = true;

    await file.load();

    this.appendChild(file.entity);
  }

  dispose() {
    super.dispose();
    this._file.dispose();
  }

  cloneLeaf() {
    return new SCSSImportEntity(this.source);
  }
}

export const scssImportEntityFactoryDependency = new EntityFactoryDependency(CSSATRuleExpression, SCSSImportEntity, "import");