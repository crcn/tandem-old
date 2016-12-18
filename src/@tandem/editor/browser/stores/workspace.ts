import { flatten } from "lodash";
import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { SelectionChangeEvent } from "@tandem/editor/browser/messages";
import { ParallelBus, CallbackDispatcher, IDispatcher } from "@tandem/mesh";

import {
  CoreEvent,
  inject,
  IPoint,
  bindable,
  bubble,
  Metadata,
  TreeNode,
  Transform,
  Observable,
  flattenTree,
  IInjectable,
  watchProperty,
  PrivateBusProvider,
  PropertyMutation,
} from "@tandem/common";

import { ISyntheticObject } from "@tandem/sandbox";
import { 
  SyntheticBrowser,
  SyntheticDocument,
  ISyntheticBrowser,
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

  readonly type = "display";
  public cursor = null;

  constructor() {
    super();
    this._browserObserver = new CallbackDispatcher(this.onBrowserAction.bind(this));
    this.documentQuerier  = new SyntheticElementQuerier(undefined, "*");

    watchProperty(this, "browser", this.onBrowserChange.bind(this));
  }

  get document(): SyntheticDocument {
    return this.browser && this.browser.document;
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