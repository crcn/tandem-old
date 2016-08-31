import * as sift from "sift";
import { UNDO, REDO } from "sf-front-end/actions";
import { IHistoryItem } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { loggable, filterAction } from "sf-core/decorators";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { DSUpdateAction, DS_UPDATE, PostDSAction } from "sf-core/actions";

@loggable()
export default class HistoryService extends BaseApplicationService<FrontEndApplication> {

  private _position: number = 0;
  private _history: Array<IHistoryItem> = [];

  [DS_UPDATE](action: DSUpdateAction) {
    this._addHistoryItem({
      use: () => {
        this.bus.execute(PostDSAction.createFromDSAction(new DSUpdateAction(action.collectionName, action.data, action.query), action.data));
      }
    });
  }

  [UNDO]() {
    if (!this._history.length) return;
    this._history[this._position = Math.max(Math.min(this._position - 1, this._history.length - 2), 0)].use();
  }

  [REDO]() {
    if (!this._history.length) return;
    this._history[this._position = Math.min(this._position + 1, this._history.length - 1)].use();
  }

  private _addHistoryItem(item: IHistoryItem) {
    this._history.splice(this._position++, this._history.length, item);
  }
}

export const dependency = new ApplicationServiceDependency("history", HistoryService);