import { BaseQuery } from 'common/fragment/queries';

export const ALL_FONTS        = { type: 'font' };
export const ALL_KEY_COMMANDS = { type: 'keyCommand' };

/**
 * Query for selection object when an item comes into
 * focus. A Selection class BTW is a basic array which contains
 * all the methods & properties of the entity type, and transfers properties
 * from the editor to the target entity / entities.
 */


export function createSelectionQuery(entityType) {
  return {
    type      : 'selection',
    entityType: entityType
  };
}