// TODO - possibly move this over to @tandem/common/display or similar
export class DOMNodeCapabilities {
  constructor(
    readonly movable: boolean,
    readonly resizable: boolean
  ) {}

  merge(...capabilities: DOMNodeCapabilities[]) {
    return DOMNodeCapabilities.merge(this, ...capabilities);
  }

  static merge(...capabilities: DOMNodeCapabilities[]) {
    return capabilities.reduce((a, b) => (
      new DOMNodeCapabilities(
        a ? a.movable   && b.movable   : b.movable,
        b ? a.resizable && b.resizable : b.resizable
      )
    ));
  }
}
