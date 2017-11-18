// TODO - many useful functions here that should be moved to the paperclip repository
// when more transpilers are created

import { traversePCAST, Component, PCElement, PCExpression, getStartTag, Module, isTag, Dependency, DependencyGraph, getPCStartTagAttribute, getAllChildElementNames, getChildComponentInfo } from "paperclip";
import * as path from "path";
import { upperFirst, camelCase, uniq } from "lodash";

export type ComponentTranspileInfo = {
  className: string;
  component: Component;
  propTypesName: string;
  enhancerName: string;
  enhancerTypeName: string;
};

export type ImportTranspileInfo = {
  baseName: string;
  relativePath;
  dependency: Dependency;
  varName: string;
};


export const getComponentClassName = tagName => upperFirst(camelCase(tagName));

export const getComponentTranspileInfo = (component: Component): ComponentTranspileInfo => {
  
  const className = getComponentClassName(component.id);

  return {
    component,
    className,
    enhancerTypeName: `${className}Enhancer`,
    propTypesName: `${className}Props`,
    enhancerName: `enhance${className}`,
  };
};

export const getComponentFromModule = (id: string, module: Module) => module.components.find(component => component.id === id);

export const getSlotName = (name: string) => `${camelCase(name.replace(/-/g, "_"))}Slot`;

export const getTemplateSlotNames = (root: PCElement) => {
  const slotNames = [];
  traversePCAST(root, (child) => {
    if (isTag(child) && getStartTag(child as PCElement).name === "slot") {
      const slotName = getPCStartTagAttribute(child as PCElement, "name");
      slotNames.push(slotName ? getSlotName(getPCStartTagAttribute(child as PCElement, "name")) : "children");
    }
  });

  return uniq(slotNames);
};

export const getImportBaseName = href => upperFirst(camelCase(path.basename(href).split(".").shift()));
export const getImportsInfo = (entry: Dependency, allDeps: Dependency[]) => {

  const importTranspileInfo = [];

  allDeps.forEach((dependency, i) => {
    
    // using var define in itself
    if (dependency === entry) {
      return;
    }

    const varName = "imports_" + i;

    let relativePath = path.relative(path.dirname(entry.module.uri), dependency.module.uri);
    if (relativePath.charAt(0) !== ".") {
      relativePath = "./" + relativePath;
    }

    importTranspileInfo.push({
      varName, 
      dependency,
      relativePath,
      baseName: getImportBaseName(dependency.module.uri)
    });
  });

  return importTranspileInfo;
};

export const getImportFromDependency = (_imports: ImportTranspileInfo[], dep: Dependency) => _imports.find(_import => _import.dependency.module.uri === dep.module.uri);