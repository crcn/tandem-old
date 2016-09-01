import { IHTMLElementAttributeEntity, HTMLAttributeExpression } from "sf-html-extension/ast";
import { ClassFactoryDependency, Dependencies } from "sf-core/dependencies";

// TODO - possibly require renderer here as well
export const ELEMENT_ATTRIBUTE_NS = "elementAttributes";
export class ElementAttributeEntityFactory extends ClassFactoryDependency {

  constructor(readonly type: string, readonly clazz: { new(source: HTMLAttributeExpression): IHTMLElementAttributeEntity } ) {
    super([ELEMENT_ATTRIBUTE_NS, type].join("/"), clazz);
  }

  clone() {
    return new ElementAttributeEntityFactory(this.type, this.clazz);
  }

  create(source: HTMLAttributeExpression) {
    return super.create(source);
  }

  static findByName(name: string, dependencies: Dependencies) {
    return dependencies.query<ElementAttributeEntityFactory>([ELEMENT_ATTRIBUTE_NS, name].join("/"));
  }

  static findBySource(source: HTMLAttributeExpression, dependencies: Dependencies) {
    return this.findByName(source.name, dependencies);
  }

  static createEntityFromSource(source: HTMLAttributeExpression, dependencies: Dependencies): IHTMLElementAttributeEntity {
    const dependency = this.findBySource(source, dependencies);

    if (!dependency) {
      throw new Error(`Unable to find entity factory for source type "${source.constructor.name}".`);
    }

    return dependency.create(source);
  }
}