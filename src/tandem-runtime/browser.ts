import * as sift from "sift";
import { DOMRenderer } from "./renderer";
import { ModuleImporter } from "./importer";
import { EnvironmentKind } from "./environment";
import { renderSyntheticJSX } from "./synthetic";
import { WrapBus, AcceptBus } from "mesh";
import { ModuleImporterAction } from "./actions";
import { SyntheticNodeComponentFactory } from "./dependencies";
import { Dependencies, MainBusDependency } from "tandem-common/dependencies";
import { IFileSystem, FileSystem, CachedFileSystem } from "./file-system";
import { SymbolTable, JSRootSymbolTable, SyntheticValueObject, SyntheticLocation } from "./synthetic";
import { SyntheticDocument, NativeFunction, BaseSyntheticNodeComponent } from "./synthetic";
import { BrokerBus, IActor, Action, Observable, PropertyChangeAction, bindable } from "tandem-common";

export class Browser extends Observable {

  private _bus: BrokerBus;
  private _fileChangeObserver: IActor;
  private _fileSystem: IFileSystem;
  private _importer: ModuleImporter;
  private _window: SymbolTable;
  private _currentFileName: string;
  private _location: SyntheticLocation;
  private _documentComponent: BaseSyntheticNodeComponent<any>;

  readonly renderer: DOMRenderer;

  constructor(private _dependencies: Dependencies) {
    super();
    this._bus = new BrokerBus();
    this._fileSystem     = new CachedFileSystem(new FileSystem(_dependencies));
    this._window = this.createWindow();
    // todo only have one instance here
    // this._window.get<SyntheticDocument>("document").observe(new WrapBus(this.onDocumentChange.bind(this)));

    // TODO - renderer should be separate from Browser
    // instance to support other devices
    this.renderer = new DOMRenderer(this);
  }

  get window(): SymbolTable {
    return this._window;
  }

  get location(): SyntheticLocation {
    return this._location;
  }

  @bindable()
  get documentComponent(): BaseSyntheticNodeComponent<any> {
    return this._documentComponent;
  }

  async open(fileName: string) {

    this._location = new SyntheticLocation(fileName, this);

    if (this._importer) {
      this._importer.dispose();
    }

    this._currentFileName = fileName;

    const window = this.createWindow();

    this._importer = new ModuleImporter(this._fileSystem, this._dependencies);
    this._importer.observe(new WrapBus(this.onImportedFileChange.bind(this)));
    this._importer.context = window;
    window.set("location", this._location);

    // TODO - this needs to be defined as a module instead of a global
    window.set("renderJSX", renderSyntheticJSX);

    // since evaluation happens as the user is modifying the docuent, errors will
    // definitely occur -- don't like that break other things
    try {
      await this._importer.require(EnvironmentKind.DOM, fileName);
    } catch (e) {

      // TODO - do something with this
      console.error(e.stack);
      return;
    }

    // patch the window memory to maintain existing references
    this._window.patch(window);
    await this.loadDocument();
  }

  protected createWindow(): SymbolTable {
    const window = new JSRootSymbolTable();
    window.set("window", window);
    window.set("document", new SyntheticDocument(this._location));
    window.set("console", new SyntheticValueObject(console));
    window.set("setTimeout", new NativeFunction(setTimeout.bind(global)));
    window.set("setInterval", new NativeFunction(setInterval.bind(global)));
    window.set("clearTimeout", new NativeFunction(clearTimeout.bind(global)));
    window.set("clearinterval", new NativeFunction(clearInterval.bind(global)));
    return window;
  }

  protected onImportedFileChange(action: Action) {

    // small fix to let other change watchers to bust caches
    setTimeout(this.reopen, 0);
  }

  /**
   * Loads the document based on the synthetic nodes added during initial
   * evaluation. This gets reloaded whenever the synthetic DOM updates
   */

  protected async loadDocument() {
    const oldDocumentComponent = this._documentComponent;
    const componentDocument = this._documentComponent = SyntheticNodeComponentFactory.create(this.window.get<SyntheticDocument>("document"), this._dependencies);
    await componentDocument.load(this.window);
    this.notify(new PropertyChangeAction("documentComponent", this._documentComponent, oldDocumentComponent));
  }

  private _reopening: boolean;
  private _shouldReopenAgain: boolean;
  private reopen = async () => {
    if (this._reopening) {
      this._shouldReopenAgain = true;
      return;
    }
    this._reopening = true;
    await this.open(this._currentFileName);
    this._reopening = false;
    if (this._shouldReopenAgain) {
      this._shouldReopenAgain = false;
      this.reopen();
    }
  }
}
