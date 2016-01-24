import { BaseQuery } from 'common/fragment/queries';
import { toArray } from 'common/utils/object';

export const ALL_FONTS        = 'fonts';
export const ALL_KEY_COMMANDS = 'keyCommands';

/**
 * Query for selection object when an item comes into
 * focus. A Selection class BTW is a basic array which contains
 * all the methods & properties of the entity type, and transfers properties
 * from the editor to the target entity / entities.
 */


export function createSelectionQuery(items) {
  return 'selection/' + (items.length ? items[0].type : void 0);
}
