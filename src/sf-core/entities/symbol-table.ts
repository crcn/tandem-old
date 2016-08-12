
export class SymbolTable {

  private _vars: any;

  constructor(private _parent?: SymbolTable) {
    this._vars = {};
  }

  get(id: string) {
    return this._vars[id] != null ? this._vars[id] : this._parent ? this._parent.get(id) : undefined;
  }

  set(id: string, value: any) {
    const context = this.getContext(id);
    if (context === this) {
      this._vars[id] = value;
    } else {
      context.set(id, value);
    }
  }

  getContext(id: string) {
    return this._vars.hasOwnProperty(id) ? this : this._parent ? this._parent.getContext(id) : this;
  }

  createChild() {
    return new SymbolTable(this);
  }
}