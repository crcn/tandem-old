import { IActor } from "@tandem/common/actors";
import {
  Dependencies,
  MainBusDependency,
  MimeTypeDependency,
  FileFactoryDependency,
  MAIN_BUS_NS,
  DEPENDENCIES_NS
} from "@tandem/common/dependencies";
import { IDisposable } from "@tandem/common/object";

import { bindable, inject } from "@tandem/common/decorators";
import { Observable, watchProperty } from "@tandem/common/observable";
import {
  WatchFileAction,
  ReadFileAction,
  UpdateTemporaryFileContentAction,
  IFileModelActionResponseData
} from "@tandem/common/actions";

export class File extends Observable {

  @bindable()
  public path: string;

  @bindable()
  public mtime: number;

  @bindable()
  public content: string;

  readonly type: string;

  private _watcher: IDisposable;

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;

  @inject(MAIN_BUS_NS)
  protected _bus: IActor;

  constructor(data: IFileModelActionResponseData) {
    super();
    this.updateFromSourceData(data);
  }

  dispose() {
    if (this._watcher) {
      this._watcher.dispose();
      this._watcher = undefined;
    }
  }

  async save() {
    this.mtime = Date.now();
    await UpdateTemporaryFileContentAction.execute(this, this._bus);
  }

  static async open(path: string, dependencies: Dependencies, mimeType?: string): Promise<File> {
    const bus = MainBusDependency.getInstance(dependencies);
    const data = await ReadFileAction.execute(path, bus);
    const fileFactory = FileFactoryDependency.find(mimeType || MimeTypeDependency.lookup(path, dependencies), dependencies) || FileFactoryDependency.find("file", dependencies);
    return fileFactory.create(data);
  }

  protected updateFromSourceData(data: IFileModelActionResponseData) {
    Object.assign(this, data);
  }

  protected onFileDataChange(data: IFileModelActionResponseData) {
    this.updateFromSourceData(data);
  }

  sync() {
    this._watcher = WatchFileAction.execute(this.path, this._bus, this.onFileDataChange.bind(this));
  }
}

export const fileModelDependency = new FileFactoryDependency("file", File);