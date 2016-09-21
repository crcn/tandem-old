// TODO - add _history prop here and reduce
// context

export class SymbolTable {

  private _vars: any;

  constructor(private _parent?: SymbolTable) {
    this._vars = {};
  }

  get(id: string) {
    return this._vars[id] != null ? this._vars[id] : this._parent ? this._parent.get(id) : undefined;
  }

  defineVariable(id: string, value?: any) {
    this._vars[id] = value;
  }

  set(id: string, value: any) {
    const context = this.getOwner(id);
    if (context === this) {
      this._vars[id] = value;
    } else {
      context.set(id, value);
    }
  }

  getOwner(id: string) {
    return this._vars.hasOwnProperty(id) ? this : this._parent ? this._parent.getOwner(id) : this;
  }

  createChild() {
    return new SymbolTable(this);
  }
}