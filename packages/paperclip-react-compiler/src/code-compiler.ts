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
    `if((tov !== "object" && key !== "text" && (tov !== "function" || key.substr(0, 2) === "on")) || key === "style") {\n`,
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
  context = setCurrentScope(module.id, context);
  context = addScopedLayerLabel(component.label, component.id, context);
  const internalVarName = getInternalVarName(component);
  const publicClassName = getPublicComponentClassName(component, context);
  context = addLine(
    `\nvar ${internalVarName}DefaultVariant = ["${COMPUTED_OVERRIDE_DEFAULT_KEY}"];`,
    context
  );

  context = addOpenTag(
    `\nvar ${internalVarName} = function(props) {\n`,
    context
  );
  context = addLineItem(`var _${component.id} = props;\n`, context);
  context = addOpenTag(`_${component.id} = Object.assign({\n`, context);
  context = translateElementAttributes(component, context);
  context = addCloseTag(`}, _${component.id}, `, context);
  context = addOpenTag("{\n", context);
  context = translateElementFinalAttributes(component, context);
  context = addLine(`variant: ${internalVarName}DefaultVariant,`, context);
  context = addCloseTag("}", context);
  context = addLineItem(");\n", context);

  context = setCurrentScope(component.id, context);
  context = flattenTreeNode(component)
    .filter(isVisibleNode)
    .reduce((context, node: PCVisibleNode | PCComponent) => {
      if (node === component) return context;
      context = addScopedLayerLabel(node.label, node.id, context);
      context = addLine("", context);

      const propsVarName = getNodePropsVarName(node, context);
      context = addLineItem(
        `var _${node.id} = _${component.id}.${propsVarName} || _${
          component.id
        }._${node.id} || _EMPTY_OBJECT;\n`,
        context
      );
      context = addLineItem(
        `_${node.id} = Object.assign({}, _${node.id}, `,
        context
      );
      context = addOpenTag("{\n", context);
      context = translateElementFinalAttributes(node, context);
      context = addCloseTag("}", context);
      context = addLineItem(");\n", context);

      return context;
    }, context);

  context = addLine("", context);
  context = getComponentLabelOverrides(component).reduce(
    (context, override) => {
      context = addScopedLayerLabel(override.value, override.id, context);
      context = addLineItem(
        `var ${getPCOverrideVarName(override, component)} = _${
          component.id
        }.${getPublicLayerVarName(
          override.value,
          override.id,
          context
        )}Props || _EMPTY_OBJECT;\n`,
        context
      );
      return context;
    },
    context
  );

  context = translateContentNodeOverrides(component, context);

  context = addLine("", context);
  context = addLineItem("return ", context);
  context = translateElement(component, context);
  context = addLine(";", context);

  context = addCloseTag(`};`, context);

  context = translateControllers(component, context);

  // necessary or other imported modules
  context = addLine(
    `\nexports.${internalVarName} = ${internalVarName};`,
    context
  );
  context = addLine(
    `exports.${publicClassName} = ${internalVarName};`,
    context
  );
  return context;
};

const getPCOverrideVarName = memoize(
  (override: PCOverride, component: PCComponent) => {
    const parent = getParentTreeNode(override.id, component);
    return `_${parent.id}_${override.targetIdPath.join("_")}`;
  }
);

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

const translateContentNodeOverrides = (
  component: PCComponent,
  context: TranslateContext
) => {
  const overrideMap = getOverrideMap(component);

  context = translatePropsVarOverrideMap(
    component,
    overrideMap.default,
    context
  );

  const variants = getComponentVariants(component);

  for (const variant of variants) {
    if (overrideMap[variant.id]) {
      context = addOpenTag(
        `if (variant.indexOf(${camelCase(variant.label)}) !== -1) {\n`,
        context
      );
      context = translatePropsVarOverrideMap(
        component,
        overrideMap[variant.id],
        context
      );
      context = addCloseTag(`}\n`, context);
    }
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

const translatePropsVarOverrideMap = (
  component: PCComponent,
  map: PCComputedOverrideVariantMap,
  context: TranslateContext
) => {
  const parentOverideIds = {};

  for (const nodeId in map) {
    if (!getNestedTreeNodeById(nodeId, component)) {
      parentOverideIds[nodeId] = map[nodeId];
    }
  }

  const overridedNodesInComponent = filterNestedNodes(component, node =>
    Boolean(map[node.id])
  ).reverse();

  for (const node of overridedNodesInComponent) {
    const inf = map[node.id];
    context = addLine("", context);

    if (mapContainsPropOverrides(inf)) {
      context = addLineItem(`Object.assign(_${node.id}, `, context);
      context = translatePropsInnerOverrideMap(
        [node.id],
        component,
        inf,
        context
      );
      context = addLineItem(`);\n`, context);
    }
  }

  // parent component overrides
  if (Object.keys(parentOverideIds).length) {
    context = addLine("", context);
    context = addOpenTag(`Object.assign(_${component.id}, {\n`, context);
    for (const nodeId in parentOverideIds) {
      const inf = parentOverideIds[nodeId];
      if (mapContainsPropOverrides(inf)) {
        context = addLineItem(`_${nodeId}: `, context);
        context = translatePropsInnerOverrideMap(
          [nodeId],
          component,
          inf,
          context
        );
        context = addLineItem(`,\n`, context);
      }
    }
    context = addCloseTag(`});\n`, context);
  }

  return context;
};

const translatePropsInnerOverrideMap = (
  idPath: string[],
  component: PCComponent,
  inf: PCComputedNoverOverrideMap,
  context: TranslateContext
) => {
  const labelOverride = getPCNodeLabelOverride(idPath, component);

  if (labelOverride) {
    context = addLineItem(`Object.assign(`, context);
  }

  context = addOpenTag(`{\n`, context);
  context = translatePropsOverrideMap(idPath, component, inf, context);
  context = addCloseTag(`}`, context);

  if (labelOverride) {
    context = addLineItem(
      `, ${getPCOverrideVarName(labelOverride, component)})`,
      context
    );
  }
  return context;
};

const getComponentLabelOverrides = memoize(
  (component: PCComponent) =>
    filterNestedNodes(component, (node: PCNode) => {
      return (
        node.name === PCSourceTagNames.OVERRIDE &&
        node.propertyName === PCOverridablePropertyName.LABEL &&
        Boolean(node.value)
      );
    }) as PCLabelOverride[]
);

const getPCNodeLabelOverride = (idPath: string[], component: PCComponent) =>
  getComponentLabelOverrides(component).find(
    node =>
      idPath.join(" ") ===
      [getParentTreeNode(node.id, component).id, ...node.targetIdPath].join(" ")
  );

const translatePropsOverrideMap = (
  idPath: string[],
  component: PCComponent,
  { children, overrides }: PCComputedNoverOverrideMap,
  context: TranslateContext
) => {
  for (const override of overrides) {
    context = translatePropOverride(override, context);
  }

  for (const childId in children) {
    if (mapContainsPropOverrides(children[childId])) {
      context = addLineItem(`_${childId}: `, context);
      context = translatePropsInnerOverrideMap(
        [...idPath, childId],
        component,
        children[childId],
        context
      );
      context = addLineItem(`,\n`, context);
      // context = addOpenTag(`_${childId}: {\n`, context);
      // context = translatePropsOverrideMap(children[childId], context);
      // context = addCloseTag(`},\n`, context);
    }
  }

  return context;
};

const translatePropOverride = (
  override: PCOverride,
  context: TranslateContext
) => {
  switch (override.propertyName) {
    case PCOverridablePropertyName.CHILDREN: {
      const visibleChildren = getVisibleChildren(override);
      if (visibleChildren.length) {
        context = addOpenTag(`children: [\n`, context);
        for (const child of visibleChildren) {
          context = translateVisibleNode(child, context);
          context = addLineItem(",\n", context);
        }
        context = addCloseTag(`],\n`, context);
      }
      return context;
    }
    case PCOverridablePropertyName.TEXT: {
      return addLine(`text: ${JSON.stringify(override.value)},`, context);
    }
    case PCOverridablePropertyName.ATTRIBUTES: {
      context = addOpenTag(`attributes: {\n`, context);
      for (const key in override.value) {
        context = addLine(
          `${camelCase(key)}: ${JSON.stringify(override.value[key])},`,
          context
        );
      }
      context = addCloseTag(`},\n`, context);

      break;
    }
  }

  return context;
};

const getNodePropsVarName = (
  node: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  return node.name === PCSourceTagNames.COMPONENT
    ? `props`
    : `${getPublicLayerVarName(node.label, node.id, context)}Props`;
};

const translateVisibleNode = (
  node: PCVisibleNode,
  context: TranslateContext
) => {
  switch (node.name) {
    case PCSourceTagNames.TEXT: {
      const textValue = `_${node.id}.text || ${JSON.stringify(node.value)}`;

      if (Object.keys(node.style).length) {
        return addLineItem(
          `React.createElement("span", _toNativeProps(_${
            node.id
          }), ${textValue})`,
          context
        );
      } else {
        return addLineItem(textValue, context);
      }
    }
    case PCSourceTagNames.COMPONENT_INSTANCE:
    case PCSourceTagNames.ELEMENT: {
      return translateElement(node, context);
    }
  }

  return context;
};

const getNodeProp = (
  name: string,
  node: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  return `_${node.id}.${name}`;
};

const translateElement = (
  elementOrComponent: PCComponent | PCComponentInstanceElement | PCElement,
  context: TranslateContext
) => {
  const visibleChildren = getVisibleChildren(elementOrComponent);
  const hasVisibleChildren = visibleChildren.length > 0;
  context = addOpenTag(`React.createElement(`, context, hasVisibleChildren);
  context = addLineItem(
    `${
      extendsComponent(elementOrComponent)
        ? (getNestedTreeNodeById(elementOrComponent.is, context.entry.content)
            ? ""
            : "_imports.") +
          `_` +
          elementOrComponent.is
        : '"' + elementOrComponent.is + '"'
    }, `,
    context
  );

  if (!extendsComponent(elementOrComponent)) {
    context = addLineItem(`_toNativeProps(_${elementOrComponent.id})`, context);
  } else {
    context = addLineItem(`_${elementOrComponent.id}`, context);
  }
  context = addLineItem(`, _${elementOrComponent.id}.children`, context);
  if (visibleChildren.length) {
    context = addLineItem(` || [\n`, context);
    context = visibleChildren.reduce((context, node, index, array) => {
      context = translateVisibleNode(node, context);
      if (index < array.length - 1) {
        context = addBuffer(",", context);
      }
      return addLine("", context);
    }, context);
  } else if (hasVisibleChildren) {
    context = addLineItem("\n", context);
  }
  context = addCloseTag(
    hasVisibleChildren ? "])" : ")",
    context,
    hasVisibleChildren
  );
  return context;
};
const translateElementAttributes = (
  node: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  if (
    node.name === PCSourceTagNames.ELEMENT ||
    node.name === PCSourceTagNames.COMPONENT ||
    node.name === PCSourceTagNames.COMPONENT_INSTANCE
  ) {
    for (const key in node.attributes) {
      let value = JSON.stringify(node.attributes[key]);
      if (key === "src" && node.is === "img") {
        value = `require(${value})`;
      }
      context = addLine(`${key}: ${value},`, context);
    }
  }
  return context;
};

const translateElementFinalAttributes = (
  node: PCVisibleNode | PCComponent,
  context: TranslateContext
) => {
  context = addLine(`key: "${node.id}",`, context);
  context = addLine(
    `className: "_${node.id} " + (${getNodeProp(
      "className",
      node,
      context
    )} || ""),`,
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
