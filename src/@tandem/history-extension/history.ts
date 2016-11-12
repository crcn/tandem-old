import { WrapBus } from "mesh";
import { FrontEndApplication } from "@tandem/editor/browser";
import { SandboxModuleAction } from "@tandem/sandbox";
import { SyntheticBrowser } from "@tandem/synthetic-browser";
import {
  inject,
  Action,
  IInjectable,
  PropertyChangeAction,
} from "@tandem/common";

class History {

  private _position: number;
  private _states: any[];
  private _currentState: any;

  constructor(private onStateChange: (item: any) => any) {
    this.clear();
  }

  get length() {
    return this._states.length;
  }

  clear() {
    this._states = [];
    this._position = 0;
  }

  push(item: any) {
    this._states.splice(this._position + 1, Infinity, item);
    this._position = this.length - 1;
  }

  getState() {
    const mergedState = {};

    for(let i = 0, n = this._position + 1; i < n; i++) {
      const state = this._states[i];

      // TODO - diff content here
      for (const key in state) {
        mergedState[key] = state[key];
      }
    }

    return mergedState;
  }

  get position() {
    return this._position;
  }

  set position(value: number) {
    this._position = Math.max(0, Math.min(value, this.length - 1));
    this.onStateChange(this.getState());
  }
}

// TODO - possibly make this adaptable to a DB collection
// TODO separate this into manager & history instance - manager interfaces with app
export class ModuleHistory implements IInjectable {

  static readonly DEPENDENCY_ID = "history";
  private _history: History;
  private _settingState: boolean;
  private _shouldSetStateAgain: boolean;
  private _mtime: number = Date.now();

  constructor(
    private _app: any
  ) {
    this._history = new History(this.setHistoryState.bind(this));
  }

  private get browser() {
    return this._app.workspace.browser;
  }

  private get bus() {
    return this._app.bus;
  }

  public initialize() {
    this._app.workspace.browser.observe(new WrapBus(this.onAction.bind(this)));
    this._app.bus.register(new WrapBus(this.onAction.bind(this)));
    this.reset();
  }

  get length() {
    return this._history.length;
  }

  get position() {
    return this._history.position;
  }


  set position(value: number) {
    this._history.position = value;
  }

  $didInject() { }

  protected onAction(action: Action) {

    // target may be comming from an embedded browser instance
    // i
    // } else if (action.type === UpdateTemporaryFileContentAction.UPDATE_TEMP_FILE_CONTENT) {
    //   const contentAction = (<UpdateTemporaryFileContentAction>action);
    //   if (contentAction.mtime > this._mtime) {
    //     this._history.push({
    //       [contentAction.path]: {
    //         mtime: this._mtime = contentAction.mtime,
    //         content: contentAction.content
    //       }
    //     });
    //   }
    // }
  }

  protected reset() {
    // const data = {};
    // const now = this._mtime = Date.now();
    // if (!this.browser.documentEntity) return;

    // this.browser.documentEntity.querySelectorAll("*").forEach((entity) => {
    //   const module = entity.module;
    //   if (module) {
    //     data[module.filePath] = {
    //       content: module.content,
    //       mtime: now
    //     };
    //   }
    // });


    // this._history.clear();
    // this._history.push(data);
  }

  private async setHistoryState(data: any) {
    if (this._settingState) return this._shouldSetStateAgain = true;
    this._settingState = true;

    for (const filePath in data) {
      // await UpdateTemporaryFileContentAction.execute({ path: filePath, content: data[filePath].content, mtime: data[filePath].mtime }, this.bus);
    }

    this._settingState = false;
    if (this._shouldSetStateAgain) {
      this._shouldSetStateAgain = false;
      this.setHistoryState(this._history.getState());
    }
  }
}