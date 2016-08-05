import { ISerializable } from "../serialize";
import { IObservable } from "../observable";

export interface IActiveRecord extends ISerializable, IObservable {

}

export interface IFile extends IActiveRecord {
  readonly path: string;
  save();
}
