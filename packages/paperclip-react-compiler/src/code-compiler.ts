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
  PCLabelOverride,
  isPCComponentInstance,
  isPCOverride,
  isComponentOrInstance,
  isPCComponentOrInstance
} from "paperclip";
import { repeat, camelCase, uniq, kebabCase, last, negate } from "lodash";
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

type ContentNode = PCVisibleNode | PCComponent;

type TranslateContext = {
  options: TranslateOptions;
  buffer: string;
  newLine?: boolean;
  currentScope?: string;
  entry: PCDependency;
  graph: DependencyGraph;
  warnings: Error[];
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

export type TranslateOptions = {
  compileNonComponents?: boolean;
};

export const translatePaperclipModuleToReact = (
  entry: PCDependency,
  graph: DependencyGraph,
  options: TranslateOptions = EMPTY_OBJECT
) => {
  const buffer = translateModule(entry.content, {
    options,
    entry,
    buffer: "",
    graph,
    scopedLabelRefs: {},
    depth: 0,
    warnings: []
  }).buffer;
  return buffer;
};

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

  context = addToNativePropsFunction(context);
  context = addMergeFunction(context);
  // context = addBuildPropsFunction(context);

  context = addLine("\nvar _EMPTY_OBJECT = {}", context);

  // context = translateModuleStyles(module, context);

  context = module.children
    .filter(isComponent)
    .reduce(
      (context, component: PCComponent) =>
        translateContentNode(component, module, context),
      context
    );

  if (context.options.compileNonComponents !== false) {
    context = module.children
      .filter(negate(isComponent))
      .reduce(
        (context, component: ContentNode) =>
          translateContentNode(component, module, context),
        context
      );
  }

  return context;
};

const addToNativePropsFunction = (context: TranslateContext) => {
  context = addOpenTag(`\nfunction _toNativeProps(props) {\n`, context);
  context = addLine(`var newProps = {};`, context);
  context = addOpenTag(`for (var key in props) {\n`, context);
  context = addLine(`var value = props[key];`, context);
  context = addLine(`var tov = typeof value;`, context);
  context = addOpenTag(
    `if((tov !== "object" && key !== "text" && (tov !== "function" || key === "ref" || key.substr(0, 2) === "on")) || key === "style") {\n`,
    context
  );
  context = addLine(`newProps[key] = value;`, context);
  context = addCloseTag(`}\n`, context);
  context = addCloseTag(`}\n`, context);
  context = addLine(`return newProps;`, context);
  context = addCloseTag(`}\n`, context);
  return context;
};

const addMergeFunction = (context: TranslateContext) => {
  context = addOpenTag(
    `\nfunction mergeProps(target, object, keyFilter) {\n`,
    context
  );
  context = addLine(`if (object == null) return target; `, context);
  context = addLine(
    `if (!target || typeof object !== 'object' || Array.isArray(object)) return object; `,
    context
  );
  context = addOpenTag(`for (var key in object) {\n`, context);
  context = addOpenTag(`if (!keyFilter || keyFilter(key)) {\n`, context);
  context = addLine(
    `target[key] = key === "className" ? target[key] ?  object[key] + " " + target[key] : object[key]: mergeProps(target[key], object[key], keyFilter);`,
    context
  );
  context = addCloseTag(`}\n`, context);
  context = addCloseTag(`}\n`, context);
  context = addLine(`return target;`, context);
  context = addCloseTag(`}\n`, context);
  return context;
};

// const addBuildPropsFunction = (context: TranslateContext) => {
//   context = addOpenTag(`\nfunction buildProps(internalProps, publicProps, staticProps) {\n`, context);
//   context = addLine(`var props = {};`, context);
//   context = addLine(`if (internalProps || publicProps) Object.assign(props, internalProps, publicProps); `, context);
//   context = addOpenTag(`if (props && props.className) {\n`, context);
//   context = addLine
//   context = addCloseTag(`}\n`, context);
//   context = addLine(`return Object.assign(props, staticProps, props)`, context);
//   context = addLine(`if (!target || typeof object !== 'object' || Array.isArray(object)) return object; `, context);
//   context = addOpenTag(`for (var key in object) {\n`, context);
//   context = addLine(`target[key] = merge(target[key], object[key]);`, context);
//   context = addCloseTag(`}\n`, context);
//   context = addLine(`return target;`, context);
//   context = addCloseTag(`}\n`, context);
//   return context;
// };

const translateComponentStyles = (
  component: ContentNode,
  context: TranslateContext
) => {
  context = addOpenTag(
    `if (typeof document !== "undefined" && !_${component.id}.style) {\n`,
    context
  );
  const styleVarName = getInternalVarName(component) + "Style";

  context = addLine(
    `var ${styleVarName} = _${
      component.id
    }.style = document.createElement("style");`,
    context
  );
  context = addLine(`${styleVarName}.type = "text/css";`, context);
  context = addOpenTag(
    `${styleVarName}.appendChild(document.createTextNode("" +\n`,
    context
  );
  context = translateComponentStyleInner(component, context);
  context = addCloseTag(`"")); \n\n`, context);
  context = addLine(`document.head.appendChild(${styleVarName});`, context);
  context = addCloseTag(`}\n`, context);
  return context;
};

const translateComponentStyleInner = (
  component: ContentNode,
  context: TranslateContext
) => {
  context = flattenTreeNode(component)
    .filter(
      (node: PCNode) =>
        isVisibleNode(node) || node.name === PCSourceTagNames.COMPONENT
    )
    .reduce((context, node: ContentNode) => {
      if (Object.keys(node.style).length === 0) {
        return context;
      }
      context = addOpenTag(`"._${node.id} {" + \n`, context);
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
      `" ${kebabCase(key)}: ${translateStyleValue(key, style[key]).replace(
        /[\n\r]/g,
        " "
      )};" + \n`,
      context
    );
  }

  return context;
};

const translateStyleOverrides = (
  contentNode: ContentNode,
  context: TranslateContext
) => {
  const variants = isComponent(contentNode)
    ? getComponentVariants(contentNode)
    : [];
  const instances = filterNestedNodes(
    contentNode,
    node =>
      node.name === PCSourceTagNames.COMPONENT_INSTANCE ||
      node.name === PCSourceTagNames.COMPONENT
  );

  for (const instance of instances) {
    context = translateStyleVariantOverrides(instance, contentNode, context);
  }

  return context;
};

const translateStyleVariantOverrides = (
  instance: PCComponentInstanceElement | PCComponent,
  component: ContentNode,
  context: TranslateContext
) => {
  const styleOverrides = getOverrides(instance).filter(
    node =>
      node.propertyName === PCOverridablePropertyName.STYLE &&
      Object.keys(node.value).length
  ) as PCStyleOverride[];
  const prefix =
    instance.name === PCSourceTagNames.COMPONENT_INSTANCE
      ? `._${component.id} `
      : "";

  for (const override of styleOverrides) {
    context = addOpenTag(`"._${override.id} {" + \n`, context);
    context = translateStyle(override.value, context);
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
  contentNode: ContentNode,
  module: PCModule,
  context: TranslateContext
) => {
  context = setCurrentScope(module.id, context);
  context = addScopedLayerLabel(contentNode.label, contentNode.id, context);
  const internalVarName = getInternalVarName(contentNode);
  const publicClassName = getPublicComponentClassName(contentNode, context);

  context = addOpenTag(`\nfunction ${internalVarName}(overrides) {\n`, context);

  context = translatedUsedComponentInstances(contentNode, context);
  context = translateSelfOverrides(contentNode, context);
  context = translateComponentStyles(contentNode, context);

  context = addOpenTag(`var render = function(props) {\n`, context);

  if (isPCComponentOrInstance(contentNode) && !extendsComponent(contentNode)) {
    context = addLineItem(
      `var _${contentNode.id}Props = Object.assign({}, _${
        contentNode.id
      }StaticProps, props);\n`,
      context
    );
    context = addClassNameCheck(`${contentNode.id}`, `props`, context);
  } else {
    context = addLine(
      `var _${contentNode.id}Props = Object.assign({}, props);`,
      context
    );
  }

  context = setCurrentScope(contentNode.id, context);
  context = flattenTreeNode(contentNode)
    .filter(isVisibleNode)
    .reduce((context, node: ContentNode) => {
      if (node === contentNode) return context;
      context = addScopedLayerLabel(node.label, node.id, context);
      context = addLine("", context);

      const propsVarName = getNodePropsVarName(node, context);
      context = addLine(
        `var _${node.id}Props = Object.assign({}, _${contentNode.id}Props._${
          node.id
        }, _${contentNode.id}Props.${propsVarName});`,
        context
      );

      if (node.name !== PCSourceTagNames.COMPONENT_INSTANCE) {
        context = addClassNameCheck(node.id, `_${node.id}Props`, context);
      }

      context = addLine(
        `_${node.id}Props = Object.assign({}, _${node.id}StaticProps, _${
          node.id
        }Props);`,
        context
      );

      return context;
    }, context);

  context = addLine("", context);
  context = getComponentLabelOverrides(contentNode).reduce(
    (context, override) => {
      context = addScopedLayerLabel(override.value, override.id, context);
      context = addLineItem(
        `var ${getPCOverrideVarName(override, contentNode)} = _${
          contentNode.id
        }Props.${getPublicLayerVarName(
          override.value,
          override.id,
          context
        )}Props;\n`,
        context
      );
      return context;
    },
    context
  );

  context = translateContentNodeOverrides(contentNode, context);

  context = addLine("", context);
  context = addLineItem("return ", context);
  if (contentNode.name === PCSourceTagNames.TEXT) {
    context = addOpenTag(`React.createElement('span', null, `, context);
    context = translateVisibleNode(contentNode, context);
    context = addCloseTag(`);`, context);
  } else {
    context = translateElement(contentNode, context);
  }
  context = addLine(";", context);

  context = addCloseTag(`};\n`, context);

  if (isComponent(contentNode)) {
    context = translateControllers(contentNode, context);
  }

  context = addLine(`return render;`, context);

  context = addCloseTag(`};\n`, context);

  // necessary or other imported modules
  context = addLine(
    `\nexports.${internalVarName} = ${internalVarName};`,
    context
  );
  context = addLine(
    `exports.${publicClassName} = ${internalVarName}({});`,
    context
  );
  return context;
};

const addClassNameCheck = (
  id: string,
  varName: string,
  context: TranslateContext
) => {
  context = addOpenTag(`if(${varName} && ${varName}.className) {\n`, context);
  context = addLine(
    `_${id}Props.className = _${id}StaticProps.className + " " + ${varName}.className;`,
    context
  );
  context = addCloseTag(`}\n`, context);
  return context;
};

const translatedUsedComponentInstances = (
  component: ContentNode,
  context: TranslateContext
) => {
  const componentInstances = filterNestedNodes(
    component,
    isPCComponentInstance
  );

  if (isPCComponentOrInstance(component) && extendsComponent(component)) {
    context = translateUsedComponentInstance(component, context);
  }
  for (const instance of componentInstances) {
    context = translateUsedComponentInstance(
      instance as PCComponentInstanceElement,
      context
    );
  }
  return context;
};

const translateUsedComponentInstance = (
  instance: PCComponentInstanceElement | PCComponent,
  context: TranslateContext
) => {
  const overrideProp = `${
    instance.name === PCSourceTagNames.COMPONENT
      ? "overrides"
      : `overrides._${instance.id}`
  }`;

  context = addOpenTag(
    `var _${instance.id}Component = ${
      !getNestedTreeNodeById(instance.is, context.entry.content)
        ? "_imports."
        : ""
    }_${instance.is}(mergeProps({\n`,
    context
  );
  context = translateUsedComponentOverrides(instance, context);
  context = addLine(`className: "_${instance.id}",`, context);
  context = addCloseTag(`}, ${overrideProp}));\n\n`, context);
  return context;
};

const translateUsedComponentOverrides = (
  instance: PCComponentInstanceElement | PCComponent,
  context: TranslateContext
) => {
  const overrideMap = getOverrideMap(getOverrides(instance));
  context = translateUsedComponentOverrideMap(
    overrideMap[COMPUTED_OVERRIDE_DEFAULT_KEY],
    context
  );
  return context;
};

const translateUsedComponentOverrideMap = (
  map: PCComputedOverrideVariantMap,
  context: TranslateContext
) => {
  for (const key in map) {
    const { children, overrides } = map[key];
    if (mapContainsStaticOverrides(map[key])) {
      context = addOpenTag(`_${key}: {\n`, context);
      for (const override of overrides) {
        context = translateStaticOverride(override, context);
      }
      context = translateUsedComponentOverrideMap(children, context);
      context = addCloseTag(`},\n`, context);
    }
  }

  return context;
};

const translateSelfOverrides = (
  component: ContentNode,
  context: TranslateContext
) => {
  const visibleNodes = filterNestedNodes(
    component,
    node => isVisibleNode(node) || node.name === PCSourceTagNames.COMPONENT
  );
  for (const node of visibleNodes) {
    // overrides provided when component is created, so ski
    if (node.name === PCSourceTagNames.COMPONENT && extendsComponent(node)) {
      continue;
    }

    const overrideProp = `${
      node.name === PCSourceTagNames.COMPONENT
        ? "overrides"
        : `overrides._${node.id}`
    }`;

    if (node.name === PCSourceTagNames.COMPONENT_INSTANCE) {
      context = addOpenTag(`var _${node.id}StaticProps = {\n`, context);
    } else {
      context = addOpenTag(
        `var _${node.id}StaticProps = mergeProps({\n`,
        context
      );
    }
    if (
      node.name === PCSourceTagNames.ELEMENT ||
      node.name === PCSourceTagNames.COMPONENT ||
      node.name === PCSourceTagNames.COMPONENT_INSTANCE
    ) {
      context = translateInnerAttributes(node.id, node.attributes, context);
    }
    context = addLine(`key: "${node.id}",`, context);

    // class name provided in override
    if (node.name !== PCSourceTagNames.COMPONENT_INSTANCE) {
      context = addLine(`className: "_${node.id}",`, context);
    }
    if (node.name === PCSourceTagNames.TEXT) {
      context = addLine(`text: ${JSON.stringify(node.value)},`, context);
    }

    if (node.name === PCSourceTagNames.COMPONENT_INSTANCE) {
      context = addCloseTag(`};\n\n`, context);
    } else {
      context = addCloseTag(
        `}, ${overrideProp}, function(key) { return key.charAt(0) !== "_"; });\n\n`,
        context
      );
    }
  }
  return context;
};

const getPCOverrideVarName = memoize(
  (override: PCOverride, component: ContentNode) => {
    const parent = getParentTreeNode(override.id, component);
    return `_${parent.id}_${override.targetIdPath.join("_")}Props`;
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
      `var ${controllerVarName} = require("${relativePath}");`,
      context
    );
    context = addLine(
      `render = (${controllerVarName}.default || ${controllerVarName})(render);`,
      context
    );
  }

  return context;
};

const translateContentNodeOverrides = (
  component: ContentNode,
  context: TranslateContext
) => {
  const instances = filterNestedNodes(
    component,
    node =>
      node.name === PCSourceTagNames.COMPONENT ||
      node.name === PCSourceTagNames.COMPONENT_INSTANCE
  );
  for (let i = instances.length; i--; ) {
    const instance = instances[i];
    const overrideMap = getOverrideMap(getOverrides(instance));
    context = translatePropsVarOverrideMap(
      component,
      instance,
      overrideMap.default,
      context
    );
  }

  return context;
};

const isComputedOverride = (map: any): map is PCComputedNoverOverrideMap =>
  Boolean(map.children);

const mapContainersOverride = (filter: (override: PCOverride) => boolean) => {
  const check = memoize(
    (map: PCComputedNoverOverrideMap | PCComputedOverrideVariantMap) => {
      if (isComputedOverride(map)) {
        if (map.overrides.find(filter)) {
          return true;
        }
        for (const childId in map.children) {
          if (check(map.children[childId])) {
            return true;
          }
        }
      } else {
        for (const childId in map) {
          if (check(map[childId])) {
            return true;
          }
        }
      }

      return false;
    }
  );
  return check;
};

const mapContainsDynamicOverrides = mapContainersOverride(
  override =>
    override.propertyName === PCOverridablePropertyName.CHILDREN &&
    override.children.length > 0
);
const mapContainsStaticOverrides = mapContainersOverride(
  override => override.propertyName !== PCOverridablePropertyName.CHILDREN
);
const mapContainsLabelOverrides = mapContainersOverride(
  override => override.propertyName === PCOverridablePropertyName.LABEL
);

const translatePropsVarOverrideMap = (
  component: ContentNode,
  instance: PCComponent | PCComponentInstanceElement,
  map: PCComputedOverrideVariantMap,
  context: TranslateContext
) => {
  // const parentOverideIds = {};

  // for (const nodeId in map) {
  //   if (!getNestedTreeNodeById(nodeId, component)) {
  //     parentOverideIds[nodeId] = map[nodeId];
  //   }
  // }

  // const overridedNodesInComponent = filterNestedNodes(component, node =>
  //   Boolean(map[node.id])
  // ).reverse();

  // for (const node of overridedNodesInComponent) {
  //   const inf = map[node.id];
  //   context = addLine("", context);

  //   if (mapContainsDynamicOverrides(inf)) {
  //     context = addLineItem(`Object.assign(_${node.id}, `, context);
  //     context = translatePropsInnerOverrideMap(
  //       [node.id],
  //       component,
  //       inf,
  //       context
  //     );
  //     context = addLineItem(`);\n`, context);
  //   }
  // }

  if (mapContainsDynamicOverrides(map) || mapContainsLabelOverrides(map)) {
    context = addLine("", context);
    context = addOpenTag(`Object.assign(_${instance.id}Props, {\n`, context);
    for (const nodeId in map) {
      const inf = map[nodeId];
      if (mapContainsDynamicOverrides(inf) || mapContainsLabelOverrides(inf)) {
        context = addLineItem(`_${nodeId}: `, context);
        context = translatePropsInnerOverrideMap(
          instance.name === PCSourceTagNames.COMPONENT
            ? [nodeId]
            : [instance.id, nodeId],
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
  component: ContentNode,
  inf: PCComputedNoverOverrideMap,
  context: TranslateContext
) => {
  const labelOverride = getPCNodeLabelOverride(idPath, component);
  if (labelOverride) {
    context = addLineItem(`Object.assign(`, context);
  }

  context = addOpenTag(`{\n`, context);
  context = translateDynamicOverrideMap(idPath, component, inf, context);
  context = addCloseTag(`}`, context);

  if (labelOverride) {
    context = addLineItem(`, ${getIdPathPropRef(idPath)}`, context);
    context = addLineItem(
      `, ${getPCOverrideVarName(labelOverride, component)})`,
      context
    );
  }
  return context;
};

const getIdPathPropRef = (idPath: string[]) =>
  idPath.slice(1).reduce((ref, id, index, ary) => {
    return ref + " && " + ref + "._" + ary.slice(0, index + 1).join("._");
  }, "_" + idPath[0] + "Props");

const getComponentLabelOverrides = memoize(
  (component: ContentNode) =>
    filterNestedNodes(component, (node: PCNode) => {
      return (
        node.name === PCSourceTagNames.OVERRIDE &&
        node.propertyName === PCOverridablePropertyName.LABEL &&
        Boolean(node.value)
      );
    }) as PCLabelOverride[]
);

const getPCNodeLabelOverride = (idPath: string[], component: ContentNode) =>
  getComponentLabelOverrides(component).find(
    node =>
      idPath.join(" ") ===
      [getParentTreeNode(node.id, component).id, ...node.targetIdPath].join(" ")
  );

const hasDynamicOverrides = ({
  children,
  overrides
}: PCComputedNoverOverrideMap) => {
  for (const override of overrides) {
    if (override.propertyName === PCOverridablePropertyName.CHILDREN) {
      return true;
    }
  }

  for (const key in children) {
    if (hasDynamicOverrides(children[key])) {
      return true;
    }
  }

  return false;
};

const translateDynamicOverrideMap = (
  idPath: string[],
  component: ContentNode,
  { children, overrides }: PCComputedNoverOverrideMap,
  context: TranslateContext
) => {
  for (const override of overrides) {
    context = translateDynamicOverride(override, context);
  }

  for (const childId in children) {
    if (
      mapContainsDynamicOverrides(children[childId]) ||
      mapContainsLabelOverrides(children[childId])
    ) {
      context = addLineItem(`_${childId}: `, context);
      context = translatePropsInnerOverrideMap(
        [...idPath, childId],
        component,
        children[childId],
        context
      );
      context = addLineItem(`,\n`, context);
    }
  }

  return context;
};

const translateDynamicOverride = (
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
  }

  return context;
};

const translateStaticOverride = (
  override: PCOverride,
  context: TranslateContext
) => {
  switch (override.propertyName) {
    case PCOverridablePropertyName.STYLE: {
      return addLine(`className: "_${override.id}",`, context);
    }
    case PCOverridablePropertyName.TEXT: {
      return addLine(`text: ${JSON.stringify(override.value)},`, context);
    }
    case PCOverridablePropertyName.ATTRIBUTES: {
      context = translateInnerAttributes(
        last(override.targetIdPath),
        override.value,
        context
      );
      break;
    }
  }

  return context;
};

const translateInnerAttributes = (
  nodeId: string,
  attributes: any,
  context: TranslateContext
) => {
  const node = getPCNode(nodeId, context.graph) as PCComponentInstanceElement;
  if (!node) {
    return addWarning(new Error(`cannot find PC node`), context);
  }
  for (const key in attributes) {
    let value = JSON.stringify(attributes[key]);
    if (key === "src" && node.is === "img") {
      value = `require(${value})`;
    }
    context = addLine(`${camelCase(key)}: ${value},`, context);
  }
  return context;
};

const addWarning = (warning: Error, context: TranslateContext) => ({
  ...context,
  warnings: [...context.warnings, warning]
});

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
      const textValue = `_${node.id}Props.text || ${JSON.stringify(
        node.value
      )}`;

      if (Object.keys(node.style).length) {
        return addLineItem(
          `React.createElement("span", _toNativeProps(_${
            node.id
          }Props), ${textValue})`,
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
        ? `_${elementOrComponent.id}Component`
        : '"' + elementOrComponent.is + '"'
    }, `,
    context
  );

  if (!extendsComponent(elementOrComponent)) {
    context = addLineItem(
      `_toNativeProps(_${elementOrComponent.id}Props)`,
      context
    );
  } else {
    context = addLineItem(`_${elementOrComponent.id}Props`, context);
  }
  context = addLineItem(`, _${elementOrComponent.id}Props.children`, context);
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
// const translateElementAttributes = (
//   node: PCVisibleNode | PCComponent,
//   context: TranslateContext
// ) => {
//   if (
//     node.name === PCSourceTagNames.ELEMENT ||
//     node.name === PCSourceTagNames.COMPONENT ||
//     node.name === PCSourceTagNames.COMPONENT_INSTANCE
//   ) {
//     for (const key in node.attributes) {
//       let value = JSON.stringify(node.attributes[key]);
//       if (key === "src" && node.is === "img") {
//         value = `require(${value})`;
//       }
//       context = addLine(`${key}: ${value},`, context);
//     }
//   }
//   return context;
// };

const getPublicComponentClassName = (
  component: ContentNode,
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
