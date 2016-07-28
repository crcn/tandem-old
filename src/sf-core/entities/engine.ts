import {
  IEntity,
  ElementEntity,
  ValueNodeEntity,
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
  FragmentDictionary,
  EntityFactoryFragment
} from "../fragments";

const defaultEntityFactory = new EntityFactoryFragment(undefined, ElementEntity);

export class RootEntity extends ContainerNode implements IEntity {
  constructor(readonly engine:EntityEngine) {
    super();
  }

  render() {
    return undefined;
  }

  cloneNode(deep?: boolean) {
    const clone = new RootEntity(this.engine);
    if (deep) {
      this.addChildNodesToClonedNode(clone);
    }
    return clone;
  }
}

/**
 *  Creates entities based on the source expression provided
 * in the load() method below -- it's essentially a runtime engine.
 */

export class EntityEngine {
  private _entity: IEntity;

  /**
   * @param {FragmentDictionary} fragments fragments that contain all entity classes
   */

  constructor(readonly fragments: FragmentDictionary) { }

  async load(source: IDiffableNode): Promise<IEntity> {

    const newEntity = new RootEntity(this);
    newEntity.appendChild(await this._loadAll(source));

    // TODO - async diffing using workers here
    // TODO - check entity constructor against new entity
    if (this._entity) {
      const changes = diff(this._entity, newEntity);
      patch(this._entity, changes, node => node);
    } else {
      this._entity = newEntity;
    }

    return this._entity;
  }

  private async _loadAll(source: IDiffableNode) {
    const entityFactory = EntityFactoryFragment.find(source.nodeName, this.fragments) || defaultEntityFactory;
    const entity = entityFactory.create(source);
    for (const childExpression of toArray(await entity.render())) {
      (<IContainerEntity>entity).appendChild(await this._loadAll(childExpression));
    }
    return entity;
  }
}

function toArray(value) {
  return Array.isArray(value) ? <Array<any>>value : value == null ? [] : [value];
}