import { DISPOSE } from "sf-core/actions";
import { MetadataKeys } from "sf-front-end/constants";
import { loggable, bindable } from "sf-core/decorators";
import { FrontEndApplication } from "sf-front-end/application";
import { BaseApplicationService } from "sf-core/services";
import { SelectionFactoryDependency } from "sf-front-end/dependencies";
import { SelectSourceAtOffsetAction } from "sf-front-end/actions";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { IEntity, removeEntitySources } from "sf-core/ast";
import { SELECT_SOURCE_AT_OFFSET, SELECT, SELECT_ALL, REMOVE_SELECTION, SelectAction } from "sf-front-end/actions";

@loggable()
export default class SelectorService extends BaseApplicationService<FrontEndApplication> {

  [SELECT_SOURCE_AT_OFFSET](action: SelectSourceAtOffsetAction) {

    const allEntities = <Array<IEntity>>this.app.workspace.file.entity.flatten();

    const selection = [];
    for (const entity of allEntities) {
      if (entity["display"]) {

        const position = entity.source.position;

        // since the source can be anything -- even binary format,
        // we'll need to verify here that the source does indeed have a position
        // property
        if (position) {
          for (const cursor of action.data) {
            if (
              (cursor.start >= position.start && cursor.start <= position.end) ||
              (cursor.end   >= position.start && cursor.end <= position.end) ||
              (cursor.start <= position.start && cursor.end >= position.end)
            ) {

              const parentIndex = selection.indexOf(entity.parent);

              if (parentIndex > -1) {
                selection.splice(parentIndex, 1);
              }

              selection.push(entity);
            }
          }
        }
      }
    }

    this[SELECT]({
      items: selection,
      toggle: false,
      keepPreviousSelection: false
    });
  }

  /**
   */

  async [REMOVE_SELECTION]() {
    await removeEntitySources(...this.app.workspace.selection);
    this.bus.execute(new SelectAction());
  }

  /**
   */

  [SELECT]({ items, toggle, keepPreviousSelection }) {
    const app = this.app;

    if (!items.length) {
      return app.workspace.selection = [];
    }

    const prevSelection = app.workspace.selection;

    const type = items[0].type;

    const newSelectionDependency = SelectionFactoryDependency.find(type, this.app.dependencies);
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

    // parents and children cannot be selected. For now - deselect
    // parent entities that appear in the selection
    newSelection.concat().forEach((entity: IEntity) => {
      let i;
      if (entity.parent && (i = newSelection.indexOf(entity.parent)) !== -1) {
        newSelection.splice(i, 1);
      }
    });

    app.workspace.selection = newSelection;
  }

  [SELECT_ALL]() {

    // TODO - select call based on focused entity
    this[SELECT]({
      items: (<any>this.app.workspace.file.entity).children,
      keepPreviousSelection: false,
      toggle: false
    });
  }
}

export const dependency = new ApplicationServiceDependency("selector", SelectorService);