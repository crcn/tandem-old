
import { Metadata } from "tandem-common/metadata";
import { IExpression } from "tandem-common/ast";
import { IEntityDisplay } from "./display";
import { IInjectable } from "tandem-common/dependencies";
import { EntityFactoryDependency } from "tandem-common/dependencies";
import { IDisposable, IOwnable, IValued, IRemovable, INamed, IPatchable, IComparable } from "tandem-common/object";

import {
  ITreeNode
} from "tandem-common/tree";

export class EntityMetadata extends Metadata implements IOwnable {
  constructor(readonly owner: IEntity, data?: any) {
    super(data);
  }
}

export interface IEntityDocument extends IOwnable {
  parse(source: string): Promise<IExpression>;
}

export interface IEntity extends ITreeNode<IEntity>, IDisposable, IInjectable, IPatchable, IComparable {
  document: IEntityDocument;
  readonly parent: IEntity;
  readonly metadata: EntityMetadata;
  readonly source: IExpression;

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
