import * as path from "path";
import { SassFile } from "@tandem/sass-extension/models";
import { MimeTypes } from "@tandem/sass-extension/constants";
import { CSSATRuleExpression } from "@tandem/html-extension";
import {
  File,
  BubbleBus,
  BaseEntity,
  Dependency,
  EntityAction,
  Dependencies,
  watchProperty,
  ReadFileAction,
  WatchFileAction,
  FileFactoryDependency,
  EntityFactoryDependency,
} from "@tandem/common";

// TODO - move all of this logic to EntityImportController

export class SassImportEntity extends BaseEntity<CSSATRuleExpression> {

  private _file: SassFile;

  get href() {
    return path.join(
      path.dirname((<File>this.source.source).path),
      this.source.params.replace(/['"]/g, "")
    );
  }
  async load() {
    await super.load();
    const absolutePath = this.href;

    const file: SassFile = this._file = await File.open(absolutePath, this.dependencies, MimeTypes.Sass) as SassFile;
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
    return new SassImportEntity(this.source);
  }
}

export const sassImportEntityFactoryDependency = new EntityFactoryDependency(CSSATRuleExpression, SassImportEntity, "import");