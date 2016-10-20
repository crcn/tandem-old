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
  Dependencies,
  bindProperty,
  watchProperty,
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
  BundlerDependency,
  IModuleResolveOptions,
} from "@tandem/sandbox";

import {
  SyntheticDOMCasterDependency,
  SyntheticDOMElementClassDependency,
  SyntheticDOMNodeEntityClassDependency,
} from "./dependencies";

import { WrapBus } from "mesh";

export interface ISyntheticBrowser {
  open(url: string);
}

export class SyntheticBrowser extends Observable implements ISyntheticBrowser {

  private _sandbox2: Sandbox2;
  private _location: SyntheticLocation;
  private _renderer: ISyntheticDocumentRenderer;
  private _documentEntity: BaseDOMNodeEntity<any, any>;
  private _documentEntityObserver: IActor;
  private _entry: Bundle;
  private _bundler: Bundler;
  private _url: string;

  @bindable()
  readonly window: SyntheticWindow;

  constructor(private _dependencies: Dependencies, renderer?: ISyntheticDocumentRenderer, readonly parent?: SyntheticBrowser) {
    super();
    this._renderer = renderer || new SyntheticDOMRenderer();
    this._bundler = BundlerDependency.getInstance(this._dependencies);
    this._renderer.observe(new BubbleBus(this));
    this._sandbox2 = new Sandbox2(_dependencies, this.createSandboxGlobals.bind(this));
    watchProperty(this._sandbox2, "exports", this.onSandboxExportsChange.bind(this));
    bindProperty(this._sandbox2, "global", this, "window");
    this._documentEntityObserver = new BubbleBus(this);
  }

  get sandbox(): Sandbox2 {
    return this._sandbox2;
  }

  get dependencies(): Dependencies {
    return this._dependencies;
  }

  get renderer(): ISyntheticDocumentRenderer {
    return this._renderer;
  }

  get location(): SyntheticLocation {
    return this._location;
  }

  async open(url: string) {
    if (this._url && this._url === url) {
      return;
    }
    this._url = url;
    this._location = new SyntheticLocation(url);
    this._entry = await this._bundler.bundle(url);
    this._sandbox2.open(this._entry);
  }

  get document() {
    return this.window && this.window.document;
  }

  get documentEntity() {
    return this._documentEntity;
  }

  get bodyEntity() {
    return this.documentEntity && findTreeNode(this.documentEntity, (entity) => entity.source === this.document.body);
  }

  protected createSandboxGlobals(): SyntheticWindow {
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

  private onSandboxExportsChange(exports: any) {
    const window = this._sandbox2.global as SyntheticWindow;

    let exportsElement: SyntheticDOMNode;

    if (exports.nodeType) {
      exportsElement = exports;
    } else {
      console.warn(`Exported Sandbox object is not a synthetic DOM node.`);
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
}
