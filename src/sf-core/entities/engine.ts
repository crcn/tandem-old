import { toArray } from "sf-core/utils/array";
import { IEntity, IContainerEntity, IEntityEngine } from "./base";

import {
  diff,
  patch,
  ContainerNode,
  IDiffableNode,
  IContainerNode,
} from "../markup";

import {
  Dependencies,
  EntityFactoryDependency,
  DocumentEntityFactoryDependency
} from "../dependencies";

/**
 *  Creates entities based on the source expression provided
 * in the load() method below -- it's essentially a runtime engine.
 */

export class EntityEngine implements IEntityEngine {

  private _root: IContainerNode;
  private _entity: IEntity;
  private _source: any;

  /**
   * @param {Dependencies} dependencies dependencies that contain all entity classes
   */

  constructor(readonly dependencies: Dependencies) { }

  public get entity() {
    return this._entity;
  }

  async update(): Promise<void> {

    const newEntity = await this._loadAll(this._source);
    const documentEntityFactory = DocumentEntityFactoryDependency.find(this.dependencies);

    const root = documentEntityFactory.create();
    root.appendChild(newEntity);

    // TODO - create root entity here
    // TODO - async diffing using workers here
    // TODO - check entity constructor against new entity
    if (this._root) {
      const changes = diff(this._root, root);
      patch(this._root, changes, node => node);

      // necessary to update the source expressions so that on save(),
      // the source expressions are properly stringified back into the source string.
      updateSources(<IEntity>this._root.childNodes[0], <IEntity>root.childNodes[0]);
    } else {
      this._root = root;
    }

    this._entity = <IEntity>this._root.childNodes[0];
  }

  async load(source: IDiffableNode): Promise<IEntity> {
    this._source = source;
    await this.update();
    return this._entity;
  }

  private async _loadAll(source: IDiffableNode) {
    const entityFactory = EntityFactoryDependency.find(source.nodeName, this.dependencies);

    if (entityFactory == null) {
      throw new Error(`Unable to find entity factory for "${source.nodeName}".`);
    }

    const entity = entityFactory.create(source);
    entity.engine = this;

    const childSources = (entityFactory.mapSourceChildren ? await entityFactory.mapSourceChildren(source) : undefined) || [];

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