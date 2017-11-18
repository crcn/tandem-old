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
  getElementChildNodes,
  getElementAttributes,
  getElementTagName,
  getAttributeStringValue,
} from "./ast";

import { parseModuleSource } from "./parser";

export type IO = {
  readFile: (path) => Promise<any>
  resolveFile: (relativePath, fromPath) => Promise<any>
};

export type Import = {
  type: string;
  href: string;
};

export type Template = {
  content: PCExpression[];
};

export type Component = {
  id: string;
  properties: BKProperty[];
  style: PCElement;
  template: Template;
};

export type Module = {

  source: PCExpression;
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

const LOADED_SYMBOL = Symbol();

export const loadModuleAST = (ast: PCExpression, uri: string): Module => {
  
  // weak memoization
  if (ast[LOADED_SYMBOL] && ast[LOADED_SYMBOL][0] === ast) return ast[LOADED_SYMBOL][1];


  const module = createModule(ast, uri);
  ast[LOADED_SYMBOL] = [ast, module];

  return module;
};

const defaultResolveFile = (relative, base) => {
  const dirname = base.split("/");
  dirname.pop();
  relative = relative.replace("./", "");
  const parentDirs = relative.split("../");
  const baseName = parentDirs.pop();
  dirname.splice(dirname.length - parentDirs.length, dirname.length);
  return Promise.resolve(dirname.join("/") + "/" + baseName);
};

export const loadModuleDependencyGraph = (uri: string, { readFile, resolveFile = defaultResolveFile }: Partial<IO>, graph: DependencyGraph = {}): Promise<DependencyGraph> => {

  // beat circular dep
  if (graph[uri]) {
    return Promise.resolve(graph);
  }
  
  return readFile(uri)
  .then(parseModuleSource)
  .then(ast => loadModuleAST(ast, uri))
  .then((module) => {

    const resolvedImportUris = {};

    // set DG value to prevent getting caught in a loop via
    // circ dependencies
    graph[uri] = { module: module, resolvedImportUris };

    if (!module.imports.length) {
      return Promise.resolve(graph);
    }

    return Promise.all(module.imports.map(_import => {
      return resolveFile(_import.href, uri)
      .then((resolvedUri) => {
        resolvedImportUris[_import.href] = resolvedUri;
        return loadModuleDependencyGraph(resolvedUri, { readFile, resolveFile }, graph);
      })
    })).then(() => {
      return graph;
    })
  }).catch((e) => {
    console.error(`Error in ${uri}`);
    throw e;
  });
}

const createModule = (ast: PCExpression, uri: string): Module => {
  const childNodes = ast.type === PCExpressionType.FRAGMENT ? (ast as PCFragment).childNodes : [ast];

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

      if (tagName === "component") {
        components.push(createComponent(modifiers, attributes, childNodes));
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

const createComponent = (modifiers: PCBlock[], attributes: PCAttribute[], childNodes: PCExpression[]): Component => {
  let id: string;
  let style: PCElement;
  let template: Template;
  let properties: BKProperty[] = modifiers.map(({value}) => value).filter(modifier => modifier.type === BKExpressionType.PROPERTY) as BKProperty[];

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
        template = createTemplate(attributes, childNodes);
      }
    }
  }

  return {
    id,
    style,
    properties,
    template
  };
};

const createTemplate = (attributes: PCAttribute[], childNodes: PCExpression[]): Template => {
  return {
    content: childNodes
  };
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