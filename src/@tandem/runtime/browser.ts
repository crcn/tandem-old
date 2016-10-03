import * as sift from "sift";
// import { Sandbox } from "@tandem/sandbox";
import { DOMRenderer } from "./renderer";
import { EnvironmentKind } from "./environment";
import { renderSyntheticJSX } from "./synthetic";
import { WrapBus, AcceptBus } from "mesh";
// import { SyntheticWindow } from "@tandem/synthetic-dom";
import { ModuleImporterAction } from "./actions";
import { SyntheticNodeComponentFactory } from "./dependencies";
import { Dependencies, MainBusDependency } from "@tandem/common/dependencies";
import { IFileSystem, FileSystem, CachedFileSystem } from "./file-system";
import { SymbolTable, JSRootSymbolTable, SyntheticValueObject, SyntheticLocation } from "./synthetic";
import { SyntheticDocument, NativeFunction, BaseSyntheticNodeComponent } from "./synthetic";
import { BrokerBus, IActor, Action, Observable, PropertyChangeAction, bindable } from "@tandem/common";

export class Browser extends Observable {

  private _bus: BrokerBus;
  private _fileChangeObserver: IActor;
  private _fileSystem: IFileSystem;
  // private _importer: ModuleImporter;
  // private _window: SyntheticWindow;
  private _currentFileName: string;
  private _location: SyntheticLocation;
  // private _sandbox: Sandbox;
  private _documentComponent: BaseSyntheticNodeComponent<any>;

  readonly renderer: DOMRenderer;

  constructor(private _dependencies: Dependencies) {
    super();
    this._bus = new BrokerBus();

    // this._fileSystem     = new CachedFileSystem(new FileSystem(_dependencies));

    // todo only have one instance here
    // this._window.get<SyntheticDocument>("document").observe(new WrapBus(this.onDocumentChange.bind(this)));

    // TODO - renderer should be separate from Browser
    // instance to support other devices
    this.renderer = new DOMRenderer(this);
  }


  get location(): SyntheticLocation {
    return this._location;
  }

  @bindable()
  get documentComponent(): BaseSyntheticNodeComponent<any> {
    return this._documentComponent;
  }

  async open(fileName: string) {
    // this._sandbox = new Sandbox(this._dependencies);
  }

}
