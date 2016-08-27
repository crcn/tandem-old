import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import { disposeEntity } from "./utils";
import { IHTMLEntity, IHTMLDocument } from "./base";
import { IHTMLContainerExpression, HTMLExpression } from "sf-html-extension/parsers/html";
import { IEntity, IElementEntity, findEntitiesBySource, EntityMetadata } from "sf-core/entities";
import { IMarkupSection, ContainerNode, INode, NodeSection, GroupNodeSection } from "sf-core/markup";
import { IInjectable, DEPENDENCIES_NS, Dependencies, EntityFactoryDependency } from "sf-core/dependencies";

export abstract class HTMLContainerEntity extends ContainerNode implements IHTMLEntity, IElementEntity, IInjectable {

  readonly type: string = null;
  readonly nodeName: string;
  readonly section: IMarkupSection;
  readonly metadata: EntityMetadata;

  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;

  private _document: IHTMLDocument;

  constructor(readonly source: IHTMLContainerExpression) {
    super();
    this.nodeName = source.nodeName.toUpperCase();
    this.section = this.createSection();
    this.metadata = new EntityMetadata(this, this.getInitialMetadata());
    this.metadata.observe(new BubbleBus(this));
  }

  async load() {
    for (const childExpression of this.source.childNodes) {
      const entity = EntityFactoryDependency.createEntity(childExpression, this._dependencies);
      this.appendChild(await entity.load());
    }
  }

  getInitialMetadata(): Object {

    // TODO - scan additional dependencies for metadata
    return {};
  }

  get document(): IHTMLDocument {
    return this._document;
  }

  set document(value: IHTMLDocument) {
    this.willChangeDocument(value);
    const oldDocument = this._document;
    this._document = value;
    for (const child of this.childNodes) {
      (<IHTMLEntity>child).document = value;
    }
  }

  protected willChangeDocument(newDocument) {
    // OVERRIDE ME
  }

  insertDOMChildBefore(newChild: INode, beforeChild: INode) {
    this.section.targetNode.insertBefore(newChild, beforeChild);
  }

  appendDOMChild(newChild: INode) {
    this.section.appendChild(newChild);
  }

  sync() {
    for (const child of this.childNodes) {
      (<any>child).sync();
    }
  }

  static mapSourceChildren(source: IHTMLContainerExpression) {
    return source.childNodes;
  }

  protected createSection(): IMarkupSection {
    const element = document.createElement(this.nodeName) as any;
    return new NodeSection(element);
  }

  async appendSourceChildNode(childNode: HTMLExpression): Promise<Array<IEntity>> {
    this.source.appendChildNodes(childNode);

    // since the child node is dependant on the other entities that
    // are loaded in, we'll need to update the entire entity tree in order
    // to return the proper entity
    await this.document.sync();

    // since we don't know the entity, or where it lives in this entity, we'll need to scan for it. It could
    // even be a collection of entities.
    return findEntitiesBySource(this, childNode);
  }

  _unlink(child: IHTMLEntity) {
    super._unlink(child);
    child.document = undefined;
  }

  _link(child: IHTMLEntity) {
    super._link(child);
    child.document = this.document;
    if (child.section) {
      let nextHTMLEntitySibling: IHTMLEntity;
      do {
        nextHTMLEntitySibling = <IHTMLEntity>child.nextSibling;
      } while (nextHTMLEntitySibling && !nextHTMLEntitySibling.section);

      if (nextHTMLEntitySibling) {
        // TODO - this assumes that the next sibling has a section property - it
        // might not. Need to traverse the next sibling for a node that actually has a section
        const ppSection = (<IHTMLEntity>child.nextSibling).section;

        if (nextHTMLEntitySibling.section instanceof NodeSection) {
          this.insertDOMChildBefore(child.section.toFragment(), (<NodeSection>ppSection).targetNode);
        } else {
          this.insertDOMChildBefore(child.section.toFragment(), (<GroupNodeSection>ppSection).startNode);
        }
      } else {
        this.appendDOMChild(child.section.toFragment());
      }
    }
  }

  abstract cloneNode();

  dispose() {
    disposeEntity(this);
  }
}