import {
  IEntity,
  IContainerEntity
} from "./base";

import {
  diff,
  patch,
  IContainerNode,
  IDiffableNode,
  ContainerNode
} from "../markup";

import {
  Dependencies,
  EntityFactoryDependency
} from "../dependencies";

/**
 *  Creates entities based on the source expression provided
 * in the load() method below -- it's essentially a runtime engine.
 */

export class EntityEngine {
  private _entity: IEntity;

  /**
   * @param {Dependencies} dependencies dependencies that contain all entity classes
   */

  constructor(readonly dependencies: Dependencies) { }

  async load(source: IDiffableNode): Promise<IEntity> {

    const newEntity = await this._loadAll(source);

    // TODO - async diffing using workers here
    // TODO - check entity constructor against new entity
    if (this._entity && this._entity.constructor === newEntity.constructor) {
      const changes = diff(this._entity, newEntity);
      patch(this._entity, changes, node => node);
    } else {
      this._entity = newEntity;
    }

    return this._entity;
  }

  private async _loadAll(source: IDiffableNode) {
    const entityFactory = EntityFactoryDependency.find(source.nodeName, this.dependencies);

    if (entityFactory == null) {
      throw new Error(`Unable to find entity factory for "${source.nodeName}".`);
    }

    const entity = entityFactory.create(source);

    // TODO - engine making too much of an assumption about what the entity is -- it
    // can be anything so long as it represents an expression, or some other source object, and
    // is NOT limited to the markup API. The following code needs to be more generic.
    for (const childExpression of toArray(await entity.render())) {
      (<IContainerEntity>entity).appendChild(await this._loadAll(childExpression));
    }

    return entity;
  }
}

function toArray(value) {
  return Array.isArray(value) ? <Array<any>>value : value == null ? [] : [value];
}
