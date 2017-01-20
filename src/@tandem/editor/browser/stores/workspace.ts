import { flatten } from "lodash";
import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { Project } from "@tandem/editor/common";
import { IEditorBrowserConfig } from "@tandem/editor/browser/config";
import { ParallelBus, CallbackDispatcher, IDispatcher, ChannelBus, readAllChunks, TransformStream, filterFamilyMessage, FilterBus } from "@tandem/mesh";
import { SelectionChangeEvent, OpenProjectEnvironmentChannelRequest, EditorFamilyType } from "@tandem/editor/browser/messages";

import {
  inject,
  IPoint,
  bubble,
  Kernel,
  bindable,
  Metadata,
  TreeNode,
  Mutation,
  Transform,
  CoreEvent,
  BrokerBus,
  Observable,
  flattenTree,
  IInjectable,
  BoundingRect,
  serialize,
  deserialize,
  watchProperty,
  KernelProvider,
  PropertyWatcher,
  PropertyMutation,
  PrivateBusProvider,
  ApplicationConfigurationProvider,
} from "@tandem/common";

import { ISyntheticObject, ApplyFileEditRequest } from "@tandem/sandbox";
import { 
  BaseRenderer,
  SyntheticBrowser,
  SyntheticDocument,
  ISyntheticBrowser,
  SyntheticDOMRenderer,
  BaseDecoratorRenderer,
  RemoteSyntheticBrowser,
  SyntheticElementQuerier,
} from "@tandem/synthetic-browser";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Workspace extends Observable {

  readonly metadata = new Metadata(this);

  private _zoom: number = 1;
  public translate: IPoint = { left: 0, top: 0 };
  private _browserObserver: IDispatcher<any, any>;

  @inject(PrivateBusProvider.ID)
  private _bus: IDispatcher<any, any>;

  @inject(KernelProvider.ID)
  private _kernel: Kernel;

  @inject(KernelProvider.ID)
  private _envKernel: Kernel;

  get envKernel() {
    return this._envKernel;
  }

  /**
   */

  @bindable(true)
  public showStageTools: boolean = true;
  

  /**
   * workspace canvas transform. TODO - may need to move this to WorkspaceCanvas object, or similar
   *
   * @type {Transform}
   */

  public transform: Transform = new Transform();

  /**
   *
   * @type {ISyntheticObject[]}
   */

  @bindable(true)
  @bubble()
  public selection: any[] = [];

  /**
   * The currently active synthetic browser of this workspace
   *
   * @type {ISyntheticBrowser}
   */

  @bindable(true)
  @bubble()
  public browser: ISyntheticBrowser;

  /**
   * singleton document querier for the editor so that view components
   * aren't calling the expensive querySelector function individually
   */

  readonly documentQuerier: SyntheticElementQuerier<any>;

  readonly envKernelWatcher: PropertyWatcher<Workspace, Kernel>;

  readonly type = "display";
  public cursor = null;

  constructor(readonly project: Project) {
    super();
    this._browserObserver = new CallbackDispatcher(this.onBrowserAction.bind(this));
    this.documentQuerier  = new SyntheticElementQuerier(undefined, "*");
    watchProperty(this, "browser", this.onBrowserChange.bind(this));
    this.envKernelWatcher = new PropertyWatcher<Workspace, Kernel>(this, "envKernel");
  }

  get document(): SyntheticDocument {
    return this.browser && this.browser.document;
  }

  async openBrowser() {
    const envBus = new BrokerBus(undefined, ChannelBus.createFromStream(EditorFamilyType.BROWSER, this._bus.dispatch(new OpenProjectEnvironmentChannelRequest(this.project._id)), undefined));

    const envKernel = this._envKernel = new Kernel(
      this._kernel,
      new PrivateBusProvider(envBus)
    );

    this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, "envKernel", envKernel).toEvent());

    // TODO - create a new pipeline for communicating with worker
    if (this.browser) return this.browser;
    const browser = this.browser = new RemoteSyntheticBrowser(envKernel, new CanvasRenderer(this, this._envKernel.inject(new SyntheticDOMRenderer())));

    return await browser.open({ uri: this.project.sourceUri });
  }

  /**
   * selects items for editing
   *
   * @param {(ISyntheticObject|ISyntheticObject[])} items to select
   * @param {boolean} [keepPreviousSelection=false] TRUE to keep the previous selection (shift click)
   * @param {boolean} [toggle=false] TRUE to toggle off the items if they're already selected
   */

  select(item: any|any[], keepPreviousSelection: boolean = false, toggle: boolean = false) {
    const items = Array.isArray(item) ? item : [item];

    const prevSelection = this.selection;
    const newSelection = [];

    if (keepPreviousSelection) {
      newSelection.push(...prevSelection);
    } else {
      newSelection.push(...prevSelection.filter((item) => !!~items.indexOf(item)));
    }

    for (const item of items) {
      const i = newSelection.indexOf(item);
      if (~i) {
        if (toggle) {
          newSelection.splice(i, 1);
        }
      } else {
        newSelection.push(item);
      }
    }

    this.selection = newSelection;

    if (this._bus) {
      this._bus.dispatch(new SelectionChangeEvent(this.selection));
    }
  }

  public toggleStageTools() {
    this.showStageTools = !this.showStageTools;
  }

  get zoom() { return this.transform.scale; }
  set zoom(value: number) {
    const oldZoom = this.transform.scale;

    this.transform.scale = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, value)
    );

    this.notify(new PropertyMutation(PropertyMutation.PROPERTY_CHANGE, this, "zoom", this.zoom, oldZoom).toEvent(true));
  }

  async applyFileMutations(mutations: Mutation<any>[]) {
    return PrivateBusProvider.getInstance(this._envKernel).dispatch(new ApplyFileEditRequest(mutations));
  }

  private onBrowserChange(newBrowser: ISyntheticBrowser) {
    if (this.browser) this.browser.unobserve(this._browserObserver);
    newBrowser.observe(this._browserObserver);
    this.updatePropertiesFromBrowser();
  }

  private onBrowserAction(message: CoreEvent) {
    this.updatePropertiesFromBrowser();
  }

  private updatePropertiesFromBrowser() {
    this.documentQuerier.target = this.browser && this.browser.document;
  }
}


/**
 * Offset the transform skewing that happens with the editor
 */

class CanvasRenderer extends BaseDecoratorRenderer {
  private _rects: any;

  constructor(readonly workspace: Workspace, _renderer: BaseRenderer) {
    super(_renderer);
    this._rects = {};
  }

  getBoundingRect(uid: string) {
    return this._rects[uid] || BoundingRect.zeros();
  }

  protected onTargetRendererSetRectangles() {
    const offsetRects = {};
    const { transform } = this.workspace;
    const rects = (<BaseRenderer>this._renderer).$rects;
    for (const uid in rects) {
      offsetRects[uid] = (<BoundingRect>rects[uid]).move({
        left: -transform.left,
        top: -transform.top
      }).zoom(1 / transform.scale);
    }
    this._rects = offsetRects;
  }
}