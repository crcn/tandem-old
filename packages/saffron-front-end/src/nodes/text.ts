import Node from './base';

export default class TextNode extends Node {
  constructor(public nodeValue:string) {
    super({}); 
  }

  cloneNode() {
    return new (this.constructor as any)({
      nodeValue: this.nodeValue
    });
  }
}
