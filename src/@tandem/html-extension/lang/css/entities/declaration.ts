import { CSSFile } from "@tandem/html-extension/models";
import { NodeSection } from "@tandem/html-extension/dom";
import { ICSSEntity } from "./base";
import { CSSDeclarationExpression } from "../ast";
import { BaseEntity, IEntity } from "@tandem/common/lang";
import { EntityFactoryDependency } from "@tandem/common/dependencies";

export class CSSDeclarationEntity extends BaseEntity<CSSDeclarationExpression> implements ICSSEntity {

  readonly document: CSSFile;
  cloneLeaf() {
    return new CSSDeclarationEntity(this.source);
  }
}

export const cssDeclarationEntityDependency = new EntityFactoryDependency(CSSDeclarationExpression, CSSDeclarationEntity);