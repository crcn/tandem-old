import { weakMemo, Struct, generateDefaultId, ExpressionLocation } from "aerial-common2";

export interface SEnvCSSObjectInterface {
  $id: string;
  source: ExpressionLocation;
  struct: Struct;
  previewCSSText: string;
}

export interface SEnvCSSObjectParentInterface extends SEnvCSSObjectInterface {
}

export const getSEnvCSSBaseObjectClass = weakMemo((context: any) => {
  abstract class SEnvCSSBaseObject implements SEnvCSSObjectInterface {

    protected _struct: Struct;
    private _$id: string;
    get $id() {
      return this._$id;
    }
    set $id(value: string) {
      this._$id = value;
      this._struct = undefined;
    }
    abstract previewCSSText: string;
    public source: ExpressionLocation;

    constructor() {
      this._$id = generateDefaultId();
    }

    get struct(): Struct {
      return this._struct || this.resetStruct();
    }

    abstract $createStruct(): Struct;

    protected resetStruct() {
      return this._struct = this.$createStruct();
    }
    clone() {
      const clone: SEnvCSSObjectInterface = this.cloneDeep();
      clone.source = this.source;
      clone["$id"] = this.$id;
      return clone;
    }

    abstract cloneDeep();
  }

  return SEnvCSSBaseObject;
});