import * as sift from "sift";
import { IHistoryItem } from "tandem-front-end/models";
import { FrontEndApplication } from "tandem-front-end/application";
import { UndoAction, RedoAction } from "tandem-front-end/actions";
import {
  loggable,
  PostDSAction,
  filterAction,
  DSUpdateAction,
  BaseApplicationService,
  ApplicationServiceDependency,
} from "tandem-common";

@loggable()
export default class HistoryService extends BaseApplicationService<FrontEndApplication> {

  private _position: number = 0;
  private _history: Array<IHistoryItem> = [];

  [PostDSAction.DS_DID_UPDATE](action: DSUpdateAction) {
    this._addHistoryItem({
      use: () => {
        this.bus.execute(PostDSAction.createFromDSAction(new DSUpdateAction(action.collectionName, action.data, action.query), action.data));
      }
    });
  }

  [UndoAction.UNDO]() {
    if (!this._history.length) return;
    this._history[this._position = Math.max(Math.min(this._position - 1, this._history.length - 2), 0)].use();
  }

  [RedoAction.REDO]() {
    if (!this._history.length) return;
    this._history[this._position = Math.min(this._position + 1, this._history.length - 1)].use();
  }

  private _addHistoryItem(item: IHistoryItem) {
    this._history.splice(this._position++, this._history.length, item);
  }
}

export const dependency = new ApplicationServiceDependency("history", HistoryService);