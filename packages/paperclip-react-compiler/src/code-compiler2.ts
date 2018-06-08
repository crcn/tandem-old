// TODOS:
// - variants for props
// - variants for classes
// - tests**
import {
  PCModule,
  PCVisibleNode,
  PCElement,
  PCComponent,
  PCComponentInstanceElement,
  PCSourceTagNames,
  PCBaseVisibleNode,
  getModuleComponents,
  PCNode,
  extendsComponent,
  getVisibleChildren,
  PCStyleOverride,
  isVisibleNode,
  getOverrides,
  getPCNode,
  isComponent,
  PCDependency,
  DependencyGraph,
  getComponentRefIds,
  getPCNodeDependency,
  getOverrideMap,
  COMPUTED_OVERRIDE_DEFAULT_KEY,
  PCComputedOverrideVariantMap,
  PCComputedOverrideMap,
  PCOverride,
  PCOverridablePropertyName,
  getComponentVariants,
  PCComputedNoverOverrideMap,
  flattenPCOverrideMap,
  PCLabelOverride
} from "paperclip";
import { repeat, camelCase, uniq, kebabCase } from "lodash";
import {
  Translate,
  KeyValue,
  flattenTreeNode,
  arraySplice,
  EMPTY_OBJECT,
  EMPTY_ARRAY,
  getNestedTreeNodeById,
  stripProtocol,
  filterNestedNodes,
  memoize,
  getParentTreeNode
} from "tandem-common";
import * as path from "path";

export const compilePaperclipModuleToReact = (
  entry: PCDependency,
  graph: DependencyGraph
) => {
  const context = { exports: {} };
  new Function("exports", translatePaperclipModuleToReact(entry, graph))(
    context
  );
  return context.exports;
};

type TranslateContext = {
  buffer: string;
  newLine?: boolean;
  currentScope?: string;
  entry: PCDependency;
  graph: DependencyGraph;
  scopedLabelRefs: {
    // scope ID
    [identifier: string]: {
      // var name
      [identifier: string]: string[];
    };
  };
  depth: number;
};

const INDENT = "  ";

export const translatePaperclipModuleToReact = (
  entry: PCDependency,
  graph: DependencyGraph
) =>
  translateModule(entry.content, {
    entry,
    buffer: "",
    graph,
    scopedLabelRefs: {},
    depth: 0
  }).buffer;

const translateModule = (module: PCModule, context: TranslateContext) => {
  context = addLine("\nvar React = require('react');", context);

  const imports = uniq(
    getComponentRefIds(module)
      .map((refId: string) => {
        return getPCNodeDependency(refId, context.graph);
      })
      .filter(dep => dep !== context.entry)
  );

  if (imports.length) {
    context = addLine(`\nvar _imports = {};`, context);
    for (const { uri } of imports) {
      let relativePath = path.relative(
        path.dirname(stripProtocol(context.entry.uri)),
        stripProtocol(uri)
      );
      if (relativePath.charAt(0) !== ".") {
        relativePath = "./" + relativePath;
      }

      context = addLine(
        `Object.assign(_imports, require("${relativePath}"));`,
        context
      );
    }
  }

  context = addOpenTag(`\nfunction _toNativeProps(props) {\n`, context);
  context = addLine(`var newProps = {};`, context);
  context = addOpenTag(`for (var key in props) {\n`, context);
  context = addLine(`var value = props[key];`, context);
  context = addLine(`var tov = typeof value;`, context);
  context = addOpenTag(
    `if((tov !== "object" && (tov !== "function" || key.substr(0, 2) === "on")) || key === "style" || key === "text") {\n`,
    context
  );
  context = addLine(`newProps[key] = value;`, context);
  context = addCloseTag(`}\n`, context);
  context = addCloseTag(`}\n`, context);
  context = addLine(`return newProps;`, context);
  context = addCloseTag(`}\n`, context);

  // for (const imp of module.imports) {
  //   context = addLine(`Object.assign(_imports, require("${imp}"));`, context);
  // }

  context = addLine("\nvar _EMPTY_OBJECT = {}", context);

  context = translateModuleStyles(module, context);

  context = module.children
    .filter(isComponent)
    .reduce(
      (context, component: PCComponent) =>
        translateContentNode(component, module, context),
      context
    );

  return context;
};

const translateModuleStyles = (module: PCModule, context: TranslateContext) => {
  context = addOpenTag(`\nif (typeof document !== "undefined") {\n`, context);
  const styleVarName = getInternalVarName(module) + "Style";

  context = addLine(
    `var ${styleVarName} = document.createElement("style");`,
    context
  );
  context = addLine(`${styleVarName}.type = "text/css";`, context);
  context = addOpenTag(
    `${styleVarName}.appendChild(document.createTextNode("" +\n`,
    context
  );
  context = module.children
    .filter(isComponent)
    .reduce((context, component: PCComponent) => {
      return translateComponentStyles(component as PCComponent, context);
    }, context);
  context = addCloseTag(`"")); \n\n`, context);
  context = addLine(`document.head.appendChild(${styleVarName});`, context);
  context = addCloseTag(`}\n`, context);
  return context;
};

const translateComponentStyles = (
  component: PCComponent,
  context: TranslateContext
) => {
  context = flattenTreeNode(component)
    .filter(
      (node: PCNode) =>
        isVisibleNode(node) || node.name === PCSourceTagNames.COMPONENT
    )
    .reduce((context, node: PCVisibleNode) => {
      if (Object.keys(node.style).length === 0) {
        return context;
      }

      let selector = `._${node.id}`;
      if (node.id !== component.id) {
        selector = `._${component.id} ${selector}`;
      }
      context = addOpenTag(`" ${selector} {" + \n`, context);
      context = translateStyle(node.style, context);
      context = addCloseTag(`"}" + \n`, context);
      return context;
    }, context);

  context = translateStyleOverrides(component, context);
  return context;
};

const translateStyle = (style: KeyValue<any>, context: TranslateContext) => {
  // TODO - add vendor prefix stuff here
  for (const key in style) {
    context = addLineItem(
      `" ${kebabCase(key)}: ${translateStyleValue(key, style[key])};" + \n`,
      context
    );
  }

  return context;
};

const translateStyleOverrides = (
  component: PCComponent,
  context: TranslateContext
) => {
  const variants = getComponentVariants(component);
  const map = getOverrideMap(component);

  if (map.default) {
    context = translateStyleVariantOverrides(component, map.default, context);
  }

  return context;
};

const translateStyleVariantOverrides = (
  component: PCComponent,
  map: PCComputedOverrideVariantMap,
  context: TranslateContext
) => {
  const flattened = flattenPCOverrideMap(map);
  for (const idPath in flattened) {
    const styleOverride = flattened[idPath].find(
      override => override.propertyName === PCOverridablePropertyName.STYLE
    ) as PCStyleOverride;

    if (!styleOverride || Object.keys(styleOverride.value).length === 0) {
      continue;
    }

    context = addOpenTag(
      `" ._${component.id} ${idPath
        .split(" ")
        .map(id => `._${id}`)
        .join(" ")} {" + \n`,
      context
    );
    context = translateStyle(styleOverride.value, context);
    context = addCloseTag(`"}" + \n`, context);
  }
  return context;
};

const translateStyleValue = (key: string, value: any) => {
  if (typeof value === "number") {
    return value + "px";
  }
  return value;
};

const translateContentNode = (
  component: PCComponent,
  module: PCModule,
  context: TranslateContext
) => {
  const componentVarName = getInternalVarName(component);

  context = setCurrentScope(module.id, context);
  context = addScopedLayerLabel(component.label, component.id, context);

  context = addOpenTag(
    `\nvar ${componentVarName} = function(overrides) {\n`,
    context
  );
  context = addCloseTag(`};\n`, context);

  context = addLine(
    `\nexports.${getPublicComponentClassName(
      component,
      context
    )} = ${componentVarName}({});`,
    context
  );
  context = addLine(
    `exports.${componentVarName} = ${componentVarName};`,
    context
  );

  return context;
};

const getPublicComponentClassName = (
  component: PCComponent,
  context: TranslateContext
) => {
  const varName = getPublicLayerVarName(component.label, component.id, context);
  return varName.substr(0, 1).toUpperCase() + varName.substr(1);
};

const getPublicLayerVarName = (
  label: string,
  id: string,
  context: TranslateContext
) => {
  const i = getScopedLayerLabelIndex(label, id, context);
  return camelCase(label || "child") + (i === 0 ? "" : i);
};

const getScopedLayerLabelIndex = (
  label: string,
  id: string,
  context: TranslateContext
) => {
  return context.scopedLabelRefs[context.currentScope][label].indexOf(id);
};

const translateControllers = (
  component: PCComponent,
  context: TranslateContext
) => {
  if (!component.controllers) {
    return context;
  }

  const internalVarName = getInternalVarName(component);

  let i = 0;

  for (const relativePath of component.controllers) {
    const controllerVarName = `${internalVarName}Controller${++i}`;

    // TODO - need to filter based on language (javascript). to be provided in context
    context = addLine(
      `\n\nvar ${controllerVarName} = require("${relativePath}");`,
      context
    );
    context = addLine(
      `${internalVarName} = (${controllerVarName}.default || ${controllerVarName})(${internalVarName});`,
      context
    );
  }

  return context;
};

const mapContainsPropOverrides = memoize((map: PCComputedNoverOverrideMap) => {
  if (
    map.overrides.filter(
      override => override.propertyName !== PCOverridablePropertyName.STYLE
    ).length
  ) {
    return true;
  }
  for (const childId in map.children) {
    if (mapContainsPropOverrides(map.children[childId])) {
      return true;
    }
  }
  return false;
});

const getInternalVarName = (node: PCNode) => "_" + node.id;

const addBuffer = (buffer: string = "", context: TranslateContext) => ({
  ...context,
  buffer: (context.buffer || "") + buffer
});

const addLineItem = (buffer: string = "", context: TranslateContext) =>
  addBuffer((context.newLine ? repeat(INDENT, context.depth) : "") + buffer, {
    ...context,
    newLine: buffer.lastIndexOf("\n") === buffer.length - 1
  });
const addLine = (buffer: string = "", context: TranslateContext) =>
  addLineItem(buffer + "\n", context);

const addOpenTag = (
  buffer: string,
  context: TranslateContext,
  indent: boolean = true
) => ({
  ...addLineItem(buffer, context),
  depth: indent ? context.depth + 1 : context.depth
});

const addCloseTag = (
  buffer: string,
  context: TranslateContext,
  indent: boolean = true
) =>
  addLineItem(buffer, {
    ...context,
    depth: indent ? context.depth - 1 : context.depth
  });

const setCurrentScope = (currentScope: string, context: TranslateContext) => ({
  ...context,
  currentScope
});

const addScopedLayerLabel = (
  label: string,
  id: string,
  context: TranslateContext
) => {
  if (context.scopedLabelRefs[id]) {
    return context;
  }

  const scope = context.currentScope;

  if (!context.scopedLabelRefs[scope]) {
    context = {
      ...context,
      scopedLabelRefs: {
        [context.currentScope]: EMPTY_OBJECT
      }
    };
  }

  return {
    ...context,
    scopedLabelRefs: {
      [scope]: {
        ...context.scopedLabelRefs[scope],
        [label]: uniq([
          ...(context.scopedLabelRefs[scope][label] || EMPTY_ARRAY),
          id
        ])
      }
    }
  };
};
