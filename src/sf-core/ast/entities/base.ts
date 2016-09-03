
import { Metadata } from "sf-core/metadata";
import { IExpression } from "sf-core/ast";
import { IEntityDisplay } from "./display";
import { IInjectable } from "sf-core/dependencies";
import { EntityFactoryDependency } from "sf-core/dependencies";
import { IDisposable, IOwnable, IValued, IRemovable, INamed, IPatchable, IComparable } from "sf-core/object";

import {
  ITreeNode
} from "sf-core/tree";

export class EntityMetadata extends Metadata implements IOwnable {
  constructor(readonly owner: IEntity, data?: any) {
    super(data);
  }
}

export interface IEntityDocument extends IOwnable {
  update();
  parse(source: string): IExpression;
}

export interface IEntity extends ITreeNode<IEntity>, IDisposable, IInjectable, IPatchable, IComparable {
  document: IEntityDocument;
  readonly parent: IEntity;
  readonly metadata: EntityMetadata;
  readonly source: IExpression;

  /**
   * update source from props on this entity
   */

  updateSource();

  /**
   * loads the entity from the source
   */

  load();

  /**
   * patche this entity from another one.
   */

  patch(entity: IEntity): void;

  /**
   */

  flatten(): Array<IEntity>;

  /**
   */

  compare(entity: IEntity): number;
}

export interface IValueEntity extends IEntity, IValued { }

export interface IContextualEntity extends IEntity {
  context: any;
}

export interface IVisibleEntity extends IEntity {
  display: IEntityDisplay;
}
