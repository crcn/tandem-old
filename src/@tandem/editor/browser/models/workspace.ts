import { flatten } from "lodash";
import { KeyBinding } from "@tandem/editor/browser/key-bindings";
import { SelectionChangeAction } from "@tandem/editor/browser/actions";
import { ParallelBus, WrapBus } from "mesh";

import {
  IActor,
  Action,
  inject,
  IPoint,
  bindable,
  bubble,
  Metadata,
  TreeNode,
  Transform,
  PrivateBusProvider,
  Observable,
  flattenTree,
  IInjectable,
  watchProperty,
  PropertyChangeAction,
} from "@tandem/common";

import { ISyntheticObject } from "@tandem/sandbox";
import { 
  ISyntheticBrowser,
  SyntheticBrowser,
  SyntheticDocument,
  SyntheticElementQuerier,
} from "@tandem/synthetic-browser";

export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 6400 / 100;

export class Workspace extends Observable {

  readonly metadata = new Metadata(this);

  private _zoom: number = 1;
  public translate: IPoint = { left: 0, top: 0 };
  private _browserObserver: IActor;

  @inject(PrivateBusProvider.ID)
  private _bus: IActor;

  /**
   * workspace canvas transform. TODO - may need to move this to WorkspaceCanvas object, or similar
   *
   * @type {Transform}
   */

  public transform: Transform = new Transform();

  /**
   * Selected objects by the user -- allows them to perform mutations
   * on synthetic objects.
   *
   * @type {ISyntheticObject[]}
   */

  @bindable(true)
  @bubble()
  public selection: ISyntheticObject[] = [];

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
    this._browserObserver = new WrapBus(this.onBrowserAction.bind(this));
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

  select(item: ISyntheticObject|ISyntheticObject[], keepPreviousSelection: boolean = false, toggle: boolean = false) {
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
      this._bus.execute(new SelectionChangeAction(this.selection));
    }
  }


  get zoom() { return this.transform.scale; }
  set zoom(value: number) {
    const oldZoom = this.transform.scale;

    this.transform.scale = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, value)
    );

    this.notify(new PropertyChangeAction("zoom", this.zoom, oldZoom, true));
  }

  private onBrowserChange(newBrowser: ISyntheticBrowser) {
    if (this.browser) this.browser.unobserve(this._browserObserver);
    newBrowser.observe(this._browserObserver);
    this.updatePropertiesFromBrowser();
  }

  private onBrowserAction(action: Action) {
    this.updatePropertiesFromBrowser();
  }

  private updatePropertiesFromBrowser() {
    this.documentQuerier.target = this.browser && this.browser.document;
  }
}