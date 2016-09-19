import { BaseEntityController } from "./base";
import { BaseEntity } from "../index";
import { BaseExpression } from "../../base";
import { EntityFactoryDependency } from "tandem-common/dependencies";

type mapSourceChildrenType = () => Array<BaseExpression<any>>;

export class EntityBodyController extends BaseEntityController {

  private _mapSourceChildren: mapSourceChildrenType;

  constructor(entity: BaseEntity<any>, mapSourceChildren?: mapSourceChildrenType) {
    super(entity);
    this._mapSourceChildren = mapSourceChildren || this._defaultMapSourceChildren.bind(this);
  }

  public async evaluate(context: any) {

    const { dependencies } = context;
    const { entity } = this;

    // TODO - move all of this logic to an entity controller instead - likely
    // something such as EntityChildController or similar
    const mappedSourceChildren = this._mapSourceChildren();

    for (let i = 0, n = mappedSourceChildren.length; i < n; i++) {
      const childSource = mappedSourceChildren[i];
      let childEntity: BaseEntity<any>   = entity.children.find((child) => child.source === childSource);
      let oldIndex      = entity.children.indexOf(childEntity);

      // shuffle children around if the source exists but the entity
      // is out of order. Note that the children may still be removed
      // if the type is incorrect.
      if (oldIndex !== -1 && i !== oldIndex) {
        entity.insertChildAt(entity.children[oldIndex], i);
      }

      childEntity   = entity.children[i];

      const childEntityFactory = EntityFactoryDependency.findBySource(childSource, dependencies);

      // TODO - possible childEntity.source.compare(childSource) === 0
      if (!childEntity || childEntity.source !== childSource || childEntity.constructor !== childEntityFactory.entityClass) {

        if (childEntity) {
          entity.removeChild(childEntity);
          childEntity.dispose();
        }

        if (!childEntityFactory) {
          throw new Error(`Cannot find entity factory for expression type ${childSource.constructor.name}.`);
        }

        childEntity = childEntityFactory.create(childSource);
        await childEntity.evaluate(context);
        entity.insertChildAt(childEntity, i);
      } else {
        await childEntity.evaluate(context);
      }
    }

    for (let i = this.entity.children.length; i--; ) {
      const child = this.entity.children[i];
      if (mappedSourceChildren.indexOf(child.source) === -1) {
        this.entity.removeChild(child);
      }
    }
  }

  private _defaultMapSourceChildren() {
    return this.entity.source.children;
  }
}