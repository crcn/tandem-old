// TODO - assert modifiers (cannot have else, elseif, and else in the same block)
// TODO - throw error if var found out of context

import { 
  PCElement, 
  PCFragment, 
  PCTextNode,
  PCAttribute,
  BKProperty,
  PCBlock,
  BKExpression,
  PCExpression, 
  BKExpressionType,
  PCExpressionType, 
  PCSelfClosingElement,
  getElementModifiers,
  PCRootExpression,
  getElementChildNodes,
  getElementAttributes,
  getPCStartTagAttribute,
  getElementTagName,
  getAttributeStringValue,
  getAllChildElementNames
} from "./ast";
import { weakMemo } from "./utils";

import { parseModuleSource } from "./parser";
import { DiagnosticType, Diagnostic } from "./parser-utils";

export type IO = {
  readFile: (path) => any
  resolveFile: (relativePath, fromPath) => any
};

export type Import = {
  type: string;
  href: string;
};

export type ComponentMetadata = {
  name: string;
  params: {
    [identifier: string]: string
  }
}

export type Component = {
  source: PCElement;
  id: string;
  metadata: ComponentMetadata[];
  style: PCElement;
  template: PCElement;
  previews: (PCSelfClosingElement|PCElement)[];
};

export type ComponentExpressions = {
  [identifier: string]: {
    filePath: string;
    expression: PCExpression;
  }
};

export type LoadDependencyGraphResult = {
  diagnostics: Diagnostic[];
  graph: DependencyGraph;
};

export type Module = {

  source: PCRootExpression;
  uri: string;

  globalStyles: PCElement[];

  // import statements that are defined at the top.
  imports: Import[];

  // <component id="x-component" /> tags
  components: Component[];

  // nodes that are defined in the root document
  unhandledExpressions: PCExpression[];
};

export type Dependency = {
  module: Module;
  resolvedImportUris: {
    [identifier: string]: string
  }
};

export type DependencyGraph = {
  [identifier: string]: Dependency
};

// rename to avoid confusion
export type ChildComponentInfo = {} & DependencyGraph;

const LOADED_SYMBOL = Symbol();

export const loadModuleAST = (ast: PCRootExpression, uri: string): Module => {
  
  // weak memoization
  if (ast[LOADED_SYMBOL] && ast[LOADED_SYMBOL][0] === ast) return ast[LOADED_SYMBOL][1];


  const module = createModule(ast, uri);
  ast[LOADED_SYMBOL] = [ast, module];

  return module;
};

export const defaultResolveModulePath = (relative, base) => {
  const dirname = base.split("/");
  dirname.pop();
  relative = relative.replace("./", "");
  const parentDirs = relative.split("../");
  const baseName = parentDirs.pop();
  dirname.splice(dirname.length - parentDirs.length, dirname.length);
  return dirname.join("/") + "/" + baseName;
};

export const getChildComponentInfo = (root: PCExpression, graph: DependencyGraph): ChildComponentInfo => {
  const info = {};
  getAllChildElementNames(root).forEach((tagName) => {
    const dependency = getComponentDependency(tagName, graph);
    if (dependency) {
      info[tagName] = dependency;
    }
  });

  return info;
};

export const getDependencyGraphComponentsExpressions = (graph: DependencyGraph): ComponentExpressions => {
  const templates: ComponentExpressions = {};
  for (const filePath in graph) {
    const { module } = graph[filePath];
    for (const component of module.components) {
      templates[component.id] = {
        filePath,
        expression: component.source
      };
    }
  }
  return templates;
};

export const getDependencyChildComponentInfo = ({ module }: Dependency, graph: DependencyGraph): ChildComponentInfo => {
  const info = {};
  
  module.components.forEach((component) => {
    Object.assign(info, getChildComponentInfo(component.template, graph));
  });

  return info;
};

export const getModuleComponent = (id: string, module: Module) => module.components.find((component) => component.id === id);

export const getUsedDependencies = (dep: Dependency, graph: DependencyGraph) => {
  const allDeps: Dependency[] = [];
  const info = getDependencyChildComponentInfo(dep, graph)
  const componentTagGraph = getDependencyChildComponentInfo(dep, graph);
  for (const tagName in componentTagGraph) {
    const dep = componentTagGraph[tagName];
    if (allDeps.indexOf(dep) === -1) {
      allDeps.push(dep);
    }
  }
  return allDeps;
};

export const getImportDependencies = ({ resolvedImportUris }: Dependency, graph: DependencyGraph) => {
  const importDeps: Dependency[] = [];

  for (const relativePath in resolvedImportUris) {
    importDeps.push(graph[resolvedImportUris[relativePath]]);
  }

  return importDeps;
};


export const getComponentDependency = (id: string, graph: DependencyGraph) => {
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

export const loadModuleDependencyGraph = (uri: string, { readFile, resolveFile = defaultResolveModulePath }: Partial<IO>, graph: DependencyGraph = {}, diagnostics: Diagnostic[] = []): Promise<LoadDependencyGraphResult> => {

  // beat circular dep
  if (graph[uri]) {
    return Promise.resolve({ diagnostics, graph });
  }
  
  return Promise.resolve(readFile(uri))
  .then(parseModuleSource)
  .then(result => {
    diagnostics.push(...result.diagnostics);
    return loadModuleAST(result.root, uri)
  })
  .then((module): any => {

    const resolvedImportUris = {};

    // set DG value to prevent getting caught in a loop via
    // circ dependencies
    graph[uri] = { module, resolvedImportUris };

    if (!module.imports.length) {
      return Promise.resolve(graph);
    }

    return Promise.all(module.imports.map(_import => {
      return Promise.resolve(resolveFile(_import.href, uri))
      .then((resolvedUri) => {
        resolvedImportUris[_import.href] = resolvedUri;
        return loadModuleDependencyGraph(resolvedUri, { readFile, resolveFile }, graph, diagnostics);
      })
    }))
  })
  .then(() => {
    return { graph, diagnostics };
  })
}

const createModule = (ast: PCRootExpression, uri: string): Module => {
  const childNodes = ast.type === PCExpressionType.FRAGMENT ? (ast as any as PCFragment).childNodes : [ast];

  const imports: Import[] = [];
  const components: Component[] = [];
  const globalStyles: PCElement[] = [];
  const unhandledExpressions: PCExpression[] = [];

  for (let i = 0, {length} = childNodes; i < length; i++) {
    const child = childNodes[i];

    if (child.type === PCExpressionType.SELF_CLOSING_ELEMENT || child.type === PCExpressionType.ELEMENT) {
      const element = child as PCSelfClosingElement;
      const tagName = getElementTagName(element);
      const childNodes = getElementChildNodes(element);
      const attributes = getElementAttributes(element);
      const modifiers = getElementModifiers(element);

      if (tagName === "component" && element.type === PCExpressionType.ELEMENT) {
        components.push(createComponent(element as any as PCElement, modifiers, attributes, childNodes));
        continue;
      } else if (tagName === "link") {
        imports.push(createImport(attributes));
        continue;
      } else if (tagName === "style") {
        globalStyles.push(element as any as PCElement);
        continue;
      }
    }

    unhandledExpressions.push(child);
  }

  return {
    source: ast,
    uri,
    imports,
    components,
    globalStyles,
    unhandledExpressions,
  };
};

export const parseMetaContent = (content: string) => {
  const params = {};
  for (const part of content.split(/,\s+/g)) {
    const [key, value] = part.split("=");
    params[key] = value;
  }
  return params;
};

export const getComponentMetadataItems = (component: Component, name: string) => component.metadata.filter(meta => meta.name === name);
export const getComponentMetadataItem = (component: Component, name: string) => getComponentMetadataItems(component, name).shift();

const createComponent = (element: PCElement, modifiers: PCBlock[], attributes: PCAttribute[], childNodes: PCExpression[]): Component => {
  let id: string;
  let style: PCElement;
  let template: PCElement;
  const previews: PCSelfClosingElement[] = [];
  const metadata: ComponentMetadata[] = [];

  for (let i = 0, {length} = attributes; i < length; i++) {
    const attr = attributes[i];
    if (attr.name === "id") {
      id = getAttributeStringValue(attr);
    }
  }

  for (let i = 0, {length} = childNodes; i < length; i++) {
    const child = childNodes[i];
    if (child.type === PCExpressionType.SELF_CLOSING_ELEMENT || child.type === PCExpressionType.ELEMENT) {
      const element = child as PCSelfClosingElement;
      const tagName = getElementTagName(element);
      const attributes = getElementAttributes(element);
      const childNodes = getElementChildNodes(element);
      if (tagName === "style") {
        style = element as any as PCElement;
      } else if (tagName === "template") {
        template = element as any as PCElement;
      } else if (tagName === "preview") {
        previews.push(element as any as PCSelfClosingElement);
      } else if (tagName === "meta") {
        metadata.push({
          name: getPCStartTagAttribute(element, "name"),
          params: parseMetaContent(getPCStartTagAttribute(element, "content") || "")
        });
      }
    }
  }

  return {
    source: element,
    id,
    style,
    metadata,
    template,
    previews
  };
};

const createImport = (attributes: PCAttribute[]): Import => {

  let href: string;
  let type: string;

  for (let i = 0, {length} = attributes; i < length; i++) {
    const attr = attributes[i];
    if (attr.name === "href") {
      href = getAttributeStringValue(attr);
    } else if (attr.name === "type") {
      type = getAttributeStringValue(attr);
    }
  }

  return {
    type,
    href,
  };
};