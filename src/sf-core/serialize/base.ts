export interface ISerializable {

  serialize():Object;
  deserialize(value: Object): void;
}