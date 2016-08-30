import { decode } from "ent";
import { BubbleBus } from "sf-core/busses";
import { ValueNode } from "sf-core/markup";
import { disposeEntity } from "./utils";
import { EntityMetadata } from "sf-core/ast/entities";
import { IEntityDocument } from "sf-core/ast";
import { IHTMLValueNodeExpression } from "sf-html-extension/ast";
import { NodeSection, IDOMSection } from "sf-html-extension/dom";
import { IHTMLEntity, IHTMLContainerEntity } from "./base";

export abstract class HTMLValueNodeEntity<T extends IHTMLValueNodeExpression> extends ValueNode implements IHTMLEntity {

  readonly parent: IHTMLContainerEntity;
  readonly root: IHTMLContainerEntity;

  readonly type: string = null;
  readonly section: IDOMSection;
  readonly metadata: EntityMetadata;
  public document: IEntityDocument;

  private _node: Node;
  private _value: any;

  constructor(private _source: T) {
    super(_source.name, _source.value);
    this.metadata = new EntityMetadata(this);
    this.metadata.observe(new BubbleBus(this));
    this.section = this.createSection();
  }

  abstract createSection();

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

  update() {
    this.source.value = this.value;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
    if (this.section instanceof NodeSection) {
      this.section.targetNode.nodeValue = decode(value);
    }
  }

  willUnmount() {
    this.section.remove();
  }

  dispose() {
    disposeEntity(this);
  }
}
