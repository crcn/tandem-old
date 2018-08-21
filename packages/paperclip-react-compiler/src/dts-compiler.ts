import * as path from "path";
import { PCModule, DependencyGraph, PCDependency, isComponent, PCComponent, PCNode, getPCImportedChildrenSourceUris, getPCNodeDependency, extendsComponent, getPCNode, isComponentOrInstance, isPCComponentInstance } from "paperclip";
import { TranslateContext, addScopedLayerLabel, addLine, getPublicComponentClassName, addOpenTag, addCloseTag, setCurrentScope, addLineItem, getPublicLayerVarName } from "./utils";
import { EMPTY_ARRAY, filterNestedNodes } from "tandem-common";

export const translatePaperclipModuleToReactTSDefinition = (entry: PCDependency, graph: DependencyGraph) => {
  return translateModule(entry.content, {
    options: {},
    entry,
    buffer: "",
    graph,
    definedObjects: {},
    scopedLabelRefs: {},
    depth: 0,
    warnings: []
  }).buffer
}

const translateModule = (module: PCModule, context: TranslateContext) => {
  context = addLine(`import * as React from "react";`, context);
  const components = module.children.filter(isComponent);


  for (const component of components) {
    context = setCurrentScope(module.id, context);
    context = addScopedLayerLabel(component.label, component.id, context);
    if (component.controllers) {
      for (const controllerPath of component.controllers) {
        if (isTSFilePath(controllerPath)) {
          const controllerClassName = getComponentControllerClassName(component, controllerPath, context);
          context = addLine(`import ${controllerClassName}, {Props as ${controllerClassName}Props} from "${controllerPath}";`, context);
        }
      }
    }
  }

  const imported = {};

  for (const child of getLabeledNestedChildren(module)) {
    if (isComponent(child) || isPCComponentInstance(child)) {
      let current = child;
      while(1) {
        const dep = getPCNodeDependency(current.id, context.graph);
        if (dep.uri !== context.entry.uri) {
          if (!imported[dep.uri]) {
            imported[dep.uri] = {};
          }
          imported[dep.uri][current.id] = 1;
        }
        if (!extendsComponent(current)) {
          break;
        }
        current = getPCNode(current.is, context.graph) as PCComponent;
      }
    }
  }

  for (const uri in imported) {
    const dep = context.graph[uri];
    context = addLine(`import {${Object.keys(imported[uri]).map(id => `_${id}Props`).join(", ")}} from "${path.relative(context.entry.uri, dep.uri)}";`, context);
  }

  context = addLine("", context);

  for (const component of components) {
    context = translateComponent(component, context);
  }
  return context;
};

const translateComponent = (component: PCComponent, context: TranslateContext) => {
  const componentClassName = getPublicComponentClassName(component, context);

  // context = setCurrentScope(component.id, context);
  const controllerPath = (component.controllers || EMPTY_ARRAY).find(isTSFilePath);
  const labeledNestedChildren = getLabeledNestedChildren(component);

  // const labeledNestedChildren = 
  context = addOpenTag(`export type Base${getComponentPropsName(component, context)} = {\n`, context);
  for (const child of labeledNestedChildren) {
    if (child.id === component.id) continue;
    context = addScopedLayerLabel(child.label, child.id, context);
    context = addLineItem(`${getPublicLayerVarName(child.label, child.id, context)}Props: `, context);
    if (isPCComponentInstance(child)) {
      context = addLineItem(`_${child.is}Props`, context);
    } else {
      context = addLineItem(`any`, context);
    }
    context = addLineItem(`;\n`, context);
  }
  context = addCloseTag(`}`, context);

  let current = component;
  while(extendsComponent(current)) {
    const parent = getPCNode(current.is, context.graph) as PCComponent;
    context = addLineItem(` & _${parent.id}Props`, context);
    current = parent;
  }

  context = addLine(`;\n`, context);
  context = addLine(`export const _${component.id}Props = Base${getComponentPropsName(component, context)};\n`, context);

  if (controllerPath) {
    context = addLine(`export const ${componentClassName} = ${getComponentControllerClassName(component, controllerPath, context)};\n`, context);
    return context;
  }

  context = addLine(`export const ${componentClassName} = (props: Base${getComponentPropsName(component, context)}) => any;\n`, context);
  return context;
};

const getLabeledNestedChildren = (parent: PCNode) => {
  return filterNestedNodes(parent, (child) => child.label);
};

const getComponentPropsName = (component: PCComponent, context: TranslateContext) => {
  return `${getPublicComponentClassName(component, context)}Props`;
};

const isTSFilePath = (filePath: string) => /tsx?$/.test(filePath);

const getComponentControllerClassName = (component: PCComponent, controller: string, context: TranslateContext) => {
  const componentClassName = getPublicComponentClassName(component, context);
  return `${componentClassName}Controller${component.controllers.indexOf(controller)}`;
};

