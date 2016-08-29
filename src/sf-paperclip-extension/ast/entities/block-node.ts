import { Node as MarkupNode } from "sf-core/markup";
import { GroupNodeSection } from "sf-html-extension/dom";
import { PCBlockNodeExpression } from "sf-paperclip-extension/ast/expressions";
import { HTMLContainerEntity, IHTMLEntity } from "sf-html-extension/ast";
import { INodeEntity, EntityMetadata, IContainerNodeEntity, IEntity } from "sf-core/ast";

export class PCBlockNodeEntity extends MarkupNode implements INodeEntity, IHTMLEntity {
  readonly section: GroupNodeSection = new GroupNodeSection();
  readonly parent: IContainerNodeEntity;
  readonly root: IContainerNodeEntity;
  readonly metadata: EntityMetadata = new EntityMetadata(this);
  readonly document: any;
  private _script: Function;

  constructor(public source: PCBlockNodeExpression) {
    super(source.name);
    this.willSourceChange(source);
  }

  protected willSourceChange(source: PCBlockNodeExpression) {
    this._script = new Function("context", `with(context) { ${source.script} }`);
  }

  update() {

  }

  load() {
    // TODO - get context here
    const value = this._script({});
    this.section.removeChildren();

    if (value instanceof Node) {
      this.section.appendChild(value);
    } else if (value instanceof MarkupNode && value.section) {
      this.section.appendChild(value.section.toFragment());
    } else {
      this.section.appendChild(document.createTextNode(String(value)));
    }
  }


  patch(entity: PCBlockNodeEntity) {
    this.source = entity.source;
    this.willSourceChange(entity.source);
  }

  find(filter: (entity: IEntity) => boolean) {
    return filter(this) ? this : undefined;
  }

  dispose() {

  }

  flatten(): Array<IHTMLEntity> {
    return [this];
  }
  clone() {
    return new PCBlockNodeEntity(this.source);
  }
}

