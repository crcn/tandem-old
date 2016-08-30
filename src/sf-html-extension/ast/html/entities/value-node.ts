import { decode } from "ent";
import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import { ValueNode } from "sf-core/markup";
import { disposeEntity } from "./utils";
import { EntityMetadata } from "sf-core/ast/entities";
import { IEntityDocument } from "sf-core/ast";
import { IHTMLValueNodeExpression } from "sf-html-extension/ast";
import { NodeSection, IDOMSection } from "sf-html-extension/dom";
import { IHTMLEntity, IHTMLContainerEntity } from "./base";
import { DEPENDENCIES_NS, Dependencies, Injector } from "sf-core/dependencies";

export abstract class HTMLValueNodeEntity<T extends IHTMLValueNodeExpression> extends ValueNode implements IHTMLEntity {

  readonly parent: IHTMLContainerEntity;
  readonly root: IHTMLContainerEntity;

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;

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
    this.didUpdate();
  }

  load() {
    this.didUpdate();
  }

  update() {
    this.source.value = this.value;
    this.didUpdate();
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

  protected didUpdate() { }
  clone() {
    const clone = this._clone();
    if (this._dependencies) Injector.inject(clone, this._dependencies);
    return clone;
  }
  abstract _clone();
}
