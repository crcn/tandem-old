import {
  toArray
} from "sf-common/utils/array";

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

  public get entity() {
    return this._entity;
  }

  async load(source: IDiffableNode): Promise<IEntity> {

    const newEntity = await this._loadAll(source);

    // TODO - async diffing using workers here
    // TODO - check entity constructor against new entity
    if (this._entity && this._entity.constructor === newEntity.constructor) {
      const changes = diff(this._entity, newEntity);
      patch(this._entity, changes, node => node);

      // necessary to update the source expressions so that on save(),
      // the source expressions are properly stringified back into the source string.
      updateSources(this._entity, newEntity);
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

    const childSources = entityFactory.mapSourceChildren ? await entityFactory.mapSourceChildren(source) : [];

    for (const childExpression of childSources) {
      (<IContainerEntity>entity).appendChild(await this._loadAll(childExpression));
    }

    return entity;
  }
}

function updateSources(toEntity: IEntity, fromEntity: IEntity) {
  toEntity.source = fromEntity.source;
  if (toEntity["childNodes"]) {
    for (let i = (<IContainerEntity>fromEntity).childNodes.length; i--; ) {
      updateSources(<IEntity>(<IContainerEntity>toEntity).childNodes[i], <IEntity>(<IContainerEntity>fromEntity).childNodes[i]);
    }
  }
}