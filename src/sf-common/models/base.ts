// import { Action } from 'sf-core/actions';
// import { IActor, IInvoker } from "sf-core/actors";

// // TODO - implement

// import {
//   FindAction,
//   UpdateAction,
//   DSInsertAction,
//   RemoveAction
// } from 'sf-core/actions';

// export default class BaseModel implements IInvoker {

//   public bus:IActor;
//   public id:string;
//   public collectionName:string;
//   private _data:Object;

//   get data():Object {
//     return this._data;
//   }

//   set data(value:Object) {
//     this._data = value;
//     Object.assign(this, this.deserialize(value));
//   }

//   /**
//    */

//   isNew() {
//     return !this.id;
//   }

//   /**
//    */

//   save():any  {
//     return this.isNew() ? this.insert() : this.update();
//   }

//   /**
//    */

//   remove():any {
//     this._assertNotNew();
//     return this.fetch(new RemoveAction(this.collectionName, { id: this.id }));
//   }

//   /**
//    */

//   update():any {
//     this._assertNotNew();
//     return this.fetch(new UpdateAction(undefined, this.serialize(), { id: this.id }));
//   }

//   /**
//    */

//   insert():any {
//     return this.fetch(new DSInsertAction(undefined, this.serialize()));
//   }

//   /**
//    */

//   load():any {
//     return this.fetch(new FindAction(undefined, { id: this.id }));
//   }

//   /**
//    */

//   serialize() {

//   }

//   /**
//    */

//   deserialize():Object {
//     return data;
//   }

//   /**
//    * executes a command against the bus
//    */

//   async fetch() {
//     this.data = await this.bus.execute(Object.assign({}, options, {
//       target: this,
//       collectionName: this.collectionName
//     })).read();

//     return this;
//   }

//   _assertNotNew() {
//     if (!this.id) {
//       return Promise.reject(
//         new Error("Cannot load model without an ID.")
//       );
//     }
//   }
// }
