import * as sift from "sift";
import { IHistoryItem } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { loggable, filterAction } from "sf-core/decorators";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { UpdateAction, UPDATE, PostDBAction } from "sf-core/actions";

@loggable()
export default class HistoryService extends BaseApplicationService<FrontEndApplication> {

  private _position: number = 0;
  private _history: Array<IHistoryItem> = [];

  @filterAction(sift({ type: UPDATE }))
  update(action: UpdateAction) {
    this._addHistoryItem({
      use: () => {
        this.bus.execute(PostDBAction.createFromDBAction(new UpdateAction(action.collectionName, action.data, action.query), action.data));
      }
    });
  }

  undo() {
    if (!this._history.length) return;
    this._history[this._position = Math.max(Math.min(this._position - 1, this._history.length - 2), 0)].use();
  }

  redo() {
    if (!this._history.length) return;
    this._history[this._position = Math.min(this._position + 1, this._history.length - 1)].use();
  }

  private _addHistoryItem(item: IHistoryItem) {
    this._history.splice(this._position++, this._history.length, item);
  }
}

export const dependency = new ApplicationServiceDependency("history", HistoryService);