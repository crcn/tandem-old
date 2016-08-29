import { decode } from "ent";
import { BubbleBus } from "sf-core/busses";
import { ValueNode } from "sf-core/markup";
import { NodeSection } from "sf-html-extension/dom";
import { disposeEntity } from "./utils";
import { EntityMetadata } from "sf-core/ast/entities";
import { IHTMLValueNodeExpression } from "sf-html-extension/parsers/html";
import { IHTMLDocument, IHTMLEntity, IHTMLContainerEntity } from "./base";

export abstract class HTMLValueNodeEntity<T extends IHTMLValueNodeExpression> extends ValueNode implements IHTMLEntity {

  readonly parent: IHTMLContainerEntity;
  readonly type: string = null;
  readonly section: NodeSection;
  readonly metadata: EntityMetadata;

  private _node: Node;
  private _value: any;
  private _document: IHTMLDocument;

  constructor(private _source: T) {
    super(_source.name, _source.value);
    this.metadata = new EntityMetadata(this);
    this.metadata.observe(new BubbleBus(this));
    this.section = new NodeSection(this._node = this.createDOMNode(_source.value));
  }

  flatten(): Array<IHTMLEntity> {
    return [this];
  }

  get source(): T {
    return this._source;
  }

  find(filter: (entity: IHTMLEntity) => boolean) {
    if (filter(this)) return this;
  }

  patch(entity: HTMLValueNodeEntity<any>) {
    this.value = entity.value;
    this._source = entity.source;
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

  update() {
    this.source.value = this.value;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
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
