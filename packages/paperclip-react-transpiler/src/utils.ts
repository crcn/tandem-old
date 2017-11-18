import { traversePCAST, Component, PCElement, PCExpression, getStartTag, Module, isTag, Dependency, DependencyGraph, getPCStartTagAttribute } from "paperclip";
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

// rename to avoid confusion
export type ChildComponentInfo = {} & DependencyGraph;

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

export const getChildElementNames = (roots: PCExpression[]) => {
  const childElementNames: string[] = [];

  for (const root of roots) {
    traversePCAST(root, (element) => {
      if (isTag(element)) {
        childElementNames.push(getStartTag(element as PCElement).name);
      }
    });
  }
  
  return uniq(childElementNames);
};

export const getComponentFromModule = (id: string, module: Module) => module.components.find(component => component.id === id);

export const getChildComponentInfo = (roots: PCExpression[], graph: DependencyGraph): ChildComponentInfo => {
  const info = {};
  getChildElementNames(roots).forEach((tagName) => {
    const dependency = getComponentIdDependency(tagName, graph);
    if (dependency) {
      info[tagName] = dependency;
    }
  });

  return info;
};

export const getComponentIdDependency = (id: string, graph: DependencyGraph) => {
  for (const uri in graph) {
    const dep = graph[uri];
    for (let i = 0, {length} = dep.module.components; i < length; i++) {
      const component = dep.module.components[i];
      if (component.id === id) {
        return dep;
      }
    }
  }
};

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

export const getUsedDependencies = ({ module, resolvedImportUris }: Dependency, graph: DependencyGraph) => {
  const allDeps: Dependency[] = [];

  module.components.forEach((component) => {
    const componentTagGraph = getChildComponentInfo(component.template.childNodes, graph);
    for (const tagName in componentTagGraph) {
      allDeps.push(componentTagGraph[tagName]);
    }
  });

  return uniq(allDeps);
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