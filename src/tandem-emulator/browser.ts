import * as sift from "sift";
import { ModuleImporter } from "./importer";
import { EnvironmentKind } from "./environment";
import { SyntheticDocument } from "./dom";
import { WrapBus, AcceptBus } from "mesh";
import { ModuleImporterAction } from "./actions";
import { BrokerBus, IActor, Action } from "tandem-common";
import { Dependencies, MainBusDependency } from "tandem-common/dependencies";
import { SymbolTable, SyntheticValueObject } from "./synthetic";
import { IFileSystem, FileSystem, CachedFileSystem } from "./file-system";

export class Browser {

  private _bus: BrokerBus;
  private _fileChangeObserver: IActor;
  private _fileSystem: IFileSystem;
  private _importer: ModuleImporter;
  private _currentFileName: string;

  constructor(private _dependencies: Dependencies) {
    this._bus = new BrokerBus();
    this._fileSystem     = new CachedFileSystem(new FileSystem(_dependencies));
  }

  async open(fileName: string) {

    if (this._importer) {
      this._importer.dispose();
    }

    this._currentFileName = fileName;
    const window = new SymbolTable();
    window.set("window", window);
    window.set("document", new SyntheticDocument());
    window.set("console", new SyntheticValueObject(console));
    this._importer = new ModuleImporter(this._fileSystem, this._dependencies, window);
    await this._importer.require(EnvironmentKind.DOM, fileName);
    this._importer.observe(new WrapBus(this.onImportedFileChange.bind(this)));

    return window;
  }

  protected onImportedFileChange(action: Action) {

    // re-open the doc
    this.open(this._currentFileName);
  }
}