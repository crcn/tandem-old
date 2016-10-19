import { SyntheticLocation } from "./location";
import { SyntheticRendererAction, SyntheticBrowserAction } from "./actions";
import { SyntheticDocument, SyntheticWindow, SyntheticDOMNode } from "./dom";
import { ISyntheticDocumentRenderer, SyntheticDOMRenderer, TetherRenderer } from "./renderers";
import {
  Action,
  IActor,
  bindable,
  Injector,
  BubbleBus,
  Observable,
  TypeWrapBus,
  ChangeAction,
  findTreeNode,
  watchProperty,
  Dependencies,
  HTML_MIME_TYPE,
  MainBusDependency,
  MimeTypeDependency,
  PropertyChangeAction,
  waitForPropertyChange,
} from "@tandem/common";

import {
  BaseDOMNodeEntity,
  DefaultSyntheticDOMEntity,
} from "./entities";

import {
  Bundler,
  Sandbox,
  Bundle,
  Sandbox2,
  SandboxAction,
  BundlerDependency,
  IModuleResolveOptions,
} from "@tandem/sandbox";

import {
  SyntheticDOMCasterDependency,
  SyntheticDOMElementClassDependency,
  SyntheticDOMNodeEntityClassDependency,
} from "./dependencies";

import { WrapBus } from "mesh";

export class SyntheticBrowser extends Observable {

  private _window: SyntheticWindow;
  private _sandbox: Sandbox;
  private _sandbox2: Sandbox2;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;
  private _documentEntity: BaseDOMNodeEntity<any, any>;
  private _documentEntityObserver: IActor;
  private _entry: Bundle;
  private _bundler: Bundler;

  constructor(private _dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, readonly parent?: SyntheticBrowser) {
    super();
    this._renderer = renderer || new SyntheticDOMRenderer();
    this._bundler = BundlerDependency.getInstance(this._dependencies);
    this._renderer.observe(new BubbleBus(this));
    this._sandbox  = new Sandbox(_dependencies, this.createSandboxGlobals.bind(this), this.getResolveOptions.bind(this));
    this._sandbox2 = new Sandbox2(_dependencies, this.createSandboxGlobals2.bind(this));
    watchProperty(this._sandbox2, "exports", this.onSandboxExportsChange.bind(this));
    // TODO - bind global to window prop
    this._documentEntityObserver = new BubbleBus(this);
    this._sandbox.observe(new WrapBus(this.onSandboxAction.bind(this)));
  }

  get sandbox(): Sandbox {
    return this._sandbox;
  }

  get dependencies(): Dependencies {
    return this._dependencies;
  }

  @bindable()
  get window(): SyntheticWindow {
    return this._window;
  }

  get renderer(): ISyntheticDocumentRenderer {
    return this._renderer;
  }

  get location(): SyntheticLocation {
    return this._location;
  }

  async open(url: string) {
    this._entry = await this._bundler.bundle(url);
    this._sandbox2.open(this._entry);
    // this._bundle = new Bundle(url, this._dependencies, {
    //   extensions: MimeTypeDependency.findAll(this._dependencies).map((dep) => "." + dep.fileExtension),
    //   directories: []
    // });

    this._location = new SyntheticLocation(url);
    await new Promise(async (resolve) => {
      const openedObserver = {
        execute: (action) => {
          if (action.type === SyntheticBrowserAction.LOADED && action.target === this) {
            resolve();
            this.unobserve(openedObserver);
          }
        }
      };
      this.observe(openedObserver);
      await this._sandbox.open(HTML_MIME_TYPE, url);
    });
    this.notify(new SyntheticBrowserAction(SyntheticBrowserAction.OPENED));
  }

  get document() {
    return this._window && this._window.document;
  }

  get documentEntity() {
    return this._documentEntity;
  }

  get bodyEntity() {
    return findTreeNode(this.documentEntity, (entity) => entity.source === this.document.body);
  }

  protected createSandboxGlobals(): SyntheticWindow {
    const oldWindow = this._window;
    const window = this._window = new SyntheticWindow(this, this._renderer, this._location);
    this._registerElementClasses(window.document);
    this.notify(new PropertyChangeAction("window", window, oldWindow));
    return window;
  }

  protected createSandboxGlobals2(): SyntheticWindow {
    const window = new SyntheticWindow(this, this._renderer, this._location);
    this._registerElementClasses(window.document);
    return window;
  }

  protected getResolveOptions(): IModuleResolveOptions {

    const extensions  = [];
    const directories = [];

    if (this.window) {
      const windowResolve = this.window.resolve;
      extensions.push(...windowResolve.extensions);
      directories.push(...windowResolve.directories);
    }

    if (this.parent) {
      const parentResolve = this.parent.getResolveOptions();
      extensions.push(...parentResolve.extensions);
      directories.push(...parentResolve.directories);
    }

    return {
      extensions: extensions,
      directories: directories
    };
  }

  private _registerElementClasses(document: SyntheticDocument) {
    for (const dependency of SyntheticDOMElementClassDependency.findAll(this._dependencies)) {
      document.registerElementNS(dependency.xmlns, dependency.tagName, dependency.value);
    }
  }

  protected onSandboxAction(action: Action) {
    if (action.type === SandboxAction.OPENED_MAIN_ENTRY) {
      this.onSandboxLoaded(action);
    }
    this.notify(action);
  }

  protected async onSandboxLoaded(action: SandboxAction) {
    const window = this._sandbox.global as SyntheticWindow;
    const mainExports = this._sandbox.mainExports;

    let exportsElement: SyntheticDOMNode;

    if (mainExports) {

      // if the main exports is a dom node, then add it to the document body
      if (mainExports.nodeType) {
        exportsElement = mainExports;
      } else {
        // otherwise try to cast the main exports as a DOM node. Note that this is async since the caster
        // may make async calls such as importing libraries. the React caster for instance imports the react-dom library.
        exportsElement = await SyntheticDOMCasterDependency.castAsDOMNode(mainExports, this, this._dependencies);
      }
    }

    if (exportsElement) {
      window.document.body.appendChild(exportsElement);
    }

    const documentEntity = this._documentEntity;

    if (documentEntity) {
      documentEntity.unobserve(this._documentEntityObserver);
    }

    // remove entity for now to prevent re-renders
    this._renderer.entity = undefined;

    this._documentEntity = SyntheticDOMNodeEntityClassDependency.reuse(window.document, this._documentEntity, this._dependencies);
    this._documentEntity.observe(this._documentEntityObserver);
    this._documentEntity.evaluate();

    // set entity now - should cause a re-render
    this._renderer.entity = this._documentEntity;

    if (this._documentEntity !== documentEntity) {
      this.notify(new PropertyChangeAction("documentEntity", this._documentEntity, documentEntity));
    }

    this.notify(new SyntheticBrowserAction(SyntheticBrowserAction.LOADED));
  }

  private onSandboxExportsChange(exports: any) {
    console.log("sandbox2 exports", exports);
  }
}
