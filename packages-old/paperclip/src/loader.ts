
import { 
  PCElement, 
  PCFragment, 
  PCTextNode,
  PCAttribute,
  BKProperty,
  PCBlock,
  BKExpression,
  PCStartTag,
  PCExpression, 
  BKExpressionType,
  PCExpressionType, 
  PCSelfClosingElement,
  CSSExpressionType,
  CSSAtRule,
  CSSDeclarationProperty,
  CSSExpression,
  CSSGroupingRule,
  CSSRule,
  CSSSheet,
  CSSStyleRule,
  getElementModifiers,
  PCRootExpression,
  getElementChildNodes,
  getStartTag,
  getElementAttributes,
  getPCStartTagAttribute,
  getElementTagName,
  getAttributeStringValue,
  getAllChildElementNames
} from "./ast";
import { weakMemo, isCSSFile, isPaperclipFile } from "./utils";

import { parseModuleSource } from "./parser";
import { DEFAULT_PREVIEW_SIZE } from "./constants";
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

export type Preview = {
  name: string;
  source: PCElement;
  width: number;
  height: number;
};

export type Component = {
  source: PCElement;
  id: string;
  metadata: ComponentMetadata[];
  style: PCElement;
  template: PCElement;
  previews: Preview[];
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

export enum PCModuleType {
  COMPONENT,
  CSS
};

export type ComponentModule = {

  source: PCRootExpression;
  uri: string;
  type: PCModuleType;

  globalStyles: PCElement[];

  // import statements that are defined at the top.
  imports: Import[];

  // <component id="x-component" /> tags
  components: Component[];

  // nodes that are defined in the root document
  unhandledExpressions: PCExpression[];
};

export type CSSModule = {
  scoped?: boolean;
  source: CSSSheet;
  uri: string;
  type: PCModuleType;
}

export type Module = ComponentModule | CSSModule;

export type Dependency<TModule extends Module> = {
  module: TModule;
  resolvedImportUris: {
    [identifier: string]: string
  }
};

export type DependencyGraph = {
  [identifier: string]: Dependency<Module>
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

export const getAllComponents = weakMemo((graph: DependencyGraph): {
  [identifier: string]: Component
} => {
  const allComponents = {};
  for (const filePath in graph) {
    const { module } = graph[filePath];
    if (module.type === PCModuleType.COMPONENT) {
      for (const component of (module as ComponentModule).components) {
        allComponents[component.id] = component;
      }
    }
  }
  return allComponents;
});

export const getComponentSourceUris = weakMemo((graph: DependencyGraph): {
  [identifier: string]: string
} => {
  const componentUris = {};
  for (const filePath in graph) {
    const { module } = graph[filePath];
    if (module.type === PCModuleType.COMPONENT) {
      for (const component of (module as ComponentModule).components) {
        componentUris[component.id] = filePath;
      }
    }
  }
  return componentUris;
});

export const defaultResolveModulePath = (relative, base) => {
  const dirname = base.split("/");
  dirname.pop();
  relative = relative.replace(/^\.\//, "");
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
    for (const component of (module as ComponentModule).components) {
      templates[component.id] = {
        filePath,
        expression: component.source
      };
    }
  }
  return templates;
};

export const getDependencyChildComponentInfo = ({ module }: Dependency<any>, graph: DependencyGraph): ChildComponentInfo => {
  const info = {};

  if (module.type === PCModuleType.COMPONENT) {
    (module as ComponentModule).components.forEach((component) => {
      Object.assign(info, getChildComponentInfo(component.template, graph));
    });
  }

  return info;
};

export const getModuleComponent = (id: string, module: ComponentModule) => module.components.find((component) => component.id === id);

export const getUsedDependencies = (dep: Dependency<any>, graph: DependencyGraph) => {
  const allDeps: Dependency<any>[] = [];
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

export const getImportDependencies = ({ resolvedImportUris }: Dependency<any>, graph: DependencyGraph) => {
  const importDeps: Dependency<any>[] = [];

  for (const relativePath in resolvedImportUris) {
    importDeps.push(graph[resolvedImportUris[relativePath]]);
  }

  return importDeps;
};


export const getComponentDependency = (id: string, graph: DependencyGraph) => {
  for (const uri in graph) {
    const dep = graph[uri];
    if (dep.module.type === PCModuleType.COMPONENT) {
      const module = dep.module as ComponentModule;
      for (let i = 0, {length} = module.components; i < length; i++) {
        const component = module.components[i];
        if (component.id === id) {
          return dep;
        }
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
  .then(source => parseModuleSource(source, uri))
  .then(result => {
    diagnostics.push(...result.diagnostics);
    if (!result.root) {
      return null;
    }
    return loadModuleAST(result.root, uri)
  })
  .then((module): any => {

    if (!module) {
      return null;
    }

    const resolvedImportUris = {};

    // set DG value to prevent getting caught in a loop via
    // circ dependencies
    graph[uri] = { module, resolvedImportUris };

    if (module.type !== PCModuleType.COMPONENT || !(module as ComponentModule).imports.length) {
      return Promise.resolve(graph);
    }

    return Promise.all((module as ComponentModule).imports.map(_import => {
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

  addImports(ast, imports);

  if (isPaperclipFile(uri)) {

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
          // imports.push(createImport(attributes));
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
      type: PCModuleType.COMPONENT,
      components,
      globalStyles,
      unhandledExpressions,
    } as ComponentModule;
  } else if (isCSSFile(uri)) {
    return {
      source: ast as any as CSSSheet,
      type: PCModuleType.CSS,
      uri,
    } as CSSModule;

  }

};

const addImports = (current: PCExpression, imports: Import[]) => {
  switch(current.type) {
    case PCExpressionType.SELF_CLOSING_ELEMENT:
    case PCExpressionType.ELEMENT: {
      let childNodes: PCExpression[];
      let startTag: PCStartTag;
      if (current.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
        startTag = getStartTag(current as PCSelfClosingElement);
        childNodes = [];
      } else {
        const el = current as PCElement;
        startTag = el.startTag;
        childNodes = el.childNodes;
      }

      if (startTag.name === "link") {
        imports.push(createImport(startTag.attributes));
      }

      for (let i = 0, {length} = childNodes; i < length; i++) {
        addImports(childNodes[i], imports);
      }
      break;
    }
    
    case PCExpressionType.FRAGMENT: {
      const { childNodes } = current as PCFragment;
      for (let i = 0, {length} = childNodes; i < length; i++) {
        addImports(childNodes[i], imports);
      }
      break;
    }

    case CSSExpressionType.SHEET: {
      const { children } = current as CSSSheet;
      for (let i = 0, {length} = children; i < length; i++) {
        addCSSImports(children[i], imports);
      }
      break;
    }
  }
}

const addCSSImports = (current: CSSExpression, imports: Import[]) => {
  switch(current.type) {
    case CSSExpressionType.AT_RULE: {
      const { name, params, children } = current as CSSAtRule;
      if (name === "import") {
        imports.push({
          href: params.join(" "),
          type: "stylesheet"
        });
      }
      break;
    }
  }
}

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
  const previews: Preview[] = [];
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
        if (child.type === PCExpressionType.ELEMENT && (child as PCElement).childNodes.find(child => child.type === PCExpressionType.ELEMENT || child.type === PCExpressionType.SELF_CLOSING_ELEMENT) && Boolean(getPCStartTagAttribute(element as any, "name"))) {
          previews.push({
            source: element as any as PCElement,
            name: getPCStartTagAttribute(element as any, "name"),
            width: Number(getPCStartTagAttribute(element as any, "width") || DEFAULT_PREVIEW_SIZE.width),
            height: Number(getPCStartTagAttribute(element as any, "height") || DEFAULT_PREVIEW_SIZE.height)
          });
        }
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

export const getComponentPreview = (name: string, component: Component) => {
  return component.previews.find(preview => preview.name === name)
}

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