import { inject } from "sf-core/decorators";
import { BubbleBus } from "sf-core/busses";
import { disposeEntity } from "./utils";
import { PropertyChangeAction } from "sf-core/actions";
import { diffArray, patchArray } from "sf-core/utils/array";
import { IHTMLContainerExpression, HTMLExpression } from "sf-html-extension/parsers/html";
import { IHTMLEntity, IHTMLDocument, IHTMLContainerEntity } from "./base";
import { IEntity, IContainerNodeEntity, EntityMetadata, IContainerNodeEntitySource } from "sf-core/ast/entities";
import { ContainerNode, INode } from "sf-core/markup";
import { IInjectable, DEPENDENCIES_NS, Dependencies, EntityFactoryDependency } from "sf-core/dependencies";
import { IDOMSection, NodeSection, GroupNodeSection } from "sf-html-extension/dom";

export abstract class HTMLContainerEntity<T extends IHTMLContainerExpression> extends ContainerNode implements IHTMLContainerEntity, IInjectable {

  readonly children: Array<IHTMLEntity>;
  readonly parent: IContainerNodeEntity;
  readonly type: string = null;
  readonly name: string;
  readonly section: IDOMSection;
  readonly metadata: EntityMetadata;

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;

  private _document: IHTMLDocument;

  constructor(private _source: T) {
    super(_source.name.toUpperCase());
    this.willSourceChange(_source);
    this.section = this.createSection();
    this.metadata = new EntityMetadata(this, this.getInitialMetadata());
    this.metadata.observe(new BubbleBus(this));
  }

  async load() {
    for (const childExpression of await this.mapSourceChildNodes()) {
      const entity = EntityFactoryDependency.createEntityFromSource(childExpression, this._dependencies);
      this.appendChild(entity);
      await entity.load();
    }
  }

  flatten(): Array<IHTMLEntity> {
    const flattened: Array<IHTMLEntity> = [this];
    for (const child of this.children) {
      flattened.push(...child.flatten());
    }
    return flattened;
  }

  protected mapSourceChildNodes() {
    return this._source.children;
  }

  get source(): T {
    return this._source;
  }

  patch(entity: HTMLContainerEntity<T>) {
    this.willSourceChange(entity.source);
    this._dependencies = entity._dependencies;
    this._source = entity.source;
    const changes = diffArray(this.children, entity.children, (a, b) => a.constructor === b.constructor && a.name === b.name);
    for (const entity of changes.remove) {
      this.removeChild(entity);
    }
    for (const [currentChild, patchChild] of changes.update) {
      currentChild.patch(patchChild);
      const patchIndex = entity.children.indexOf(patchChild);
      const currentIndex = this.children.indexOf(currentChild);
      if (currentIndex !== patchIndex) {
        const beforeChild = this.children[patchIndex];
        if (beforeChild) {
          this.insertBefore(currentChild, beforeChild);
        } else {
          this.appendChild(currentChild);
        }
      }
    }

    for (const addition of changes.add) {
      const beforeChild = this.children[addition.index];
      if (beforeChild) {
        this.insertBefore(addition.value, beforeChild);
      } else {
        this.appendChild(addition.value);
      }
    }
  }

  protected willSourceChange(value: IHTMLContainerExpression) {
    // override me
  }

  protected getInitialMetadata(): Object {

    // TODO - scan additional dependencies for metadata
    return {};
  }

  get document(): IHTMLDocument {
    return this._document;
  }

  find(filter: (entity: IEntity) => boolean): IEntity {
    if (filter(this)) return this;
    for (const child of this.children) {
      const ret = (<IEntity>child).find(filter);
      if (ret) return ret;
    }
    return null;
  }

  set document(value: IHTMLDocument) {
    this.willChangeDocument(value);
    const oldDocument = this._document;
    this._document = value;
    for (const child of this.children) {
      (<IHTMLEntity>child).document = value;
    }
  }

  protected willChangeDocument(newDocument) {
    // OVERRIDE ME
  }

  insertDOMChildBefore(newChild: Node, beforeChild: Node) {
    this.section.targetNode.insertBefore(newChild, beforeChild);
  }

  appendDOMChild(newChild: Node) {
    this.section.appendChild(newChild);
  }

  update() {
    for (const child of this.children) {
      (<IEntity>child).update();
    }
  }

  static mapSourceChildren(source: IHTMLContainerExpression) {
    return source.children;
  }

  protected createSection(): IDOMSection {
    return new NodeSection(document.createElement(this.name));
  }

  _unlink(child: IHTMLEntity) {
    super._unlink(child);
    child.document = undefined;
  }

  _link(child: IHTMLEntity) {
    child.document = this.document;
    super._link(child);
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

  abstract clone();

  dispose() {
    disposeEntity(this);
  }
}