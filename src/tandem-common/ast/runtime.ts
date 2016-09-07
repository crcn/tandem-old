// import { IActor } from "tandem-common/actors";
// import { Action } from "tandem-common/actions";
// import { WrapBus } from "mesh";
// import { IEntity } from "./entities/base";
// import { debounce } from "lodash";
// import { Observable } from "tandem-common/observable";
// import { IExpression } from "tandem-common/ast/base";
// import { Dependencies, EntityFactoryDependency } from "tandem-common/dependencies";

// export class EntityRuntime extends Observable {

//   private _source: IExpression;
//   private _entity: IEntity;
//   private _sourceObserver: IActor;

//   constructor(readonly dependencies: Dependencies) {
//     super();
//     this._sourceObserver = new WrapBus(this.onSourceAction.bind(this));
//   }

//   protected get source(): IExpression {
//     return this._source;
//   }

//   async load(source: IExpression) {

//     if (this._source) {
//       this._source.unobserve(this._sourceObserver);
//     }

//     this._source.observe(this._sourceObserver);
//   }

//   protected onSourceAction(action: Action) {
//     this.requestReload();
//   }

//   private requestReload = debounce(() => {
//     this.load(this.source);
//   }, 10);
// }