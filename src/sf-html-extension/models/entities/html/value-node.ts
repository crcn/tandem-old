import { decode } from "ent";
import { BubbleBus } from "sf-core/busses";
import { disposeEntity } from "./utils";
import { EntityMetadata } from "sf-core/entities";
import { NodeSection, ValueNode } from "sf-core/markup";
import { IHTMLValueNodeExpression } from "sf-html-extension/parsers/html";
import { IHTMLDocument, IHTMLEntity } from "./base";

export abstract class HTMLValueNodeEntity<T extends IHTMLValueNodeExpression> extends ValueNode implements IHTMLEntity {

  readonly type: string = null;
  readonly section: NodeSection;
  readonly metadata: EntityMetadata;

  private _node: Node;
  private _nodeValue: any;
  private _document: IHTMLDocument;

  constructor(readonly source: T) {
    super(source.nodeName, source.nodeValue);
    this.metadata = new EntityMetadata(this);
    this.metadata.observe(new BubbleBus(this));
    this.section = new NodeSection(this._node = this.createDOMNode(source.nodeValue) as any);
  }

  patch(entity: HTMLValueNodeEntity<any>) {
    this.nodeValue = entity.nodeName;
    // this.source = entity.source;
  }

  load() { }

  get document(): IHTMLDocument {
    return this._document;
  }

  set document(value: IHTMLDocument) {
    this.willChangeDocument(value);
    const oldDocument = this._document;
    this._document = value;
  }

  protected willChangeDocument(newDocument) { }

  sync() {
    this.source.nodeValue = this.nodeValue;
  }

  get nodeValue(): any {
    return this._nodeValue;
  }

  set nodeValue(value: any) {
    this._nodeValue = value;
    if (this._node) this._node.nodeValue = decode(value);
  }

  willUnmount() {
    if (this._node.parentElement) {
      this._node.parentNode.removeChild(this._node);
    }
  }

  abstract createDOMNode(nodeValue: any): Node;

  dispose() {
    disposeEntity(this);
  }
}
