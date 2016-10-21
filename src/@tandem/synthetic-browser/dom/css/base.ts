import { Bundle } from "@tandem/sandbox";
import { CSSExpression } from "./ast";
import { ISourceLocation } from "@tandem/common";
import { ISerializer, serialize, deserialize } from "@tandem/common";

export class SyntheticCSSObject {

  public $location: ISourceLocation;

  get location() {
    return this.$location;
  }
}

export interface ISerializeCSSObject {
  location: ISourceLocation;
  bundleFilePath: string;
}

export class SyntheticCSSObjectSerializer implements ISerializer<SyntheticCSSObject, ISerializeCSSObject> {
  constructor(readonly childSerializer: ISerializer<SyntheticCSSObject, any>) { }
  serialize(value: SyntheticCSSObject) {
    return Object.assign(this.childSerializer.serialize(value), {
      location: value.$location
    });
  }
  deserialize(value: ISerializeCSSObject, dependencies) {
    return Object.assign(this.childSerializer.deserialize(value, dependencies), {
      $location: value.location
    });
  }
}