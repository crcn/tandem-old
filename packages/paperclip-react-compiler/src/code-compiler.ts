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
  PCOverride,
  PCOverridablePropertyName,
  PCComputedNoverOverrideMap,
  PCLabelOverride,
  isPCComponentInstance,
  isPCComponentOrInstance,
  getPCNodeModule,
  getPCVariants
} from "paperclip";
import { camelCase, uniq, kebabCase, last, negate } from "lodash";
import {
  flattenTreeNode,
  EMPTY_OBJECT,
  EMPTY_ARRAY,
  getNestedTreeNodeById,
  stripProtocol,
  filterNestedNodes,
  memoize,
  getParentTreeNode
} from "tandem-common";
import * as path from "path";
import {
  TranslateOptions,
  addWarning,
  ContentNode,
  getPublicComponentClassName,
  getPublicLayerVarName,
  TranslateContext,
  getScopedLayerLabelIndex,
  addOpenTag,
  addCloseTag,
  addBuffer,
  addLine,
  getInternalVarName,
  addLineItem,
  setCurrentScope,
  addScopedLayerLabel
} from "./utils";
import { InheritStyle } from "paperclip";
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
    definedObjects: {},
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
      .filter(dep => dep && dep !== context.entry)
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

  context = addLine("\nvar _EMPTY_OBJECT = {}", context);

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
      context = translateStyle(
        node,
        { ...getInheritedStyle(node.inheritStyle, context), ...node.style },
        context
      );
      context = addCloseTag(`"}" + \n`, context);
      return context;
    }, context);

  context = translateStyleOverrides(component, context);
  return context;
};

const isSVGPCNode = memoize((node: PCNode, graph: DependencyGraph) => {
  return (
    node &&
    ((node as PCElement).is === "svg" ||
      isSVGPCNode(
        getParentTreeNode(node.id, getPCNodeModule(node.id, graph)),
        graph
      ))
  );
});

const SVG_STYLE_PROP_MAP = {
  background: "fill"
};

const getInheritedStyle = (
  inheritStyle: InheritStyle,
  context: TranslateContext,
  computed = {}
) => {
  if (!inheritStyle) {
    return {};
  }
  const componentIds = Object.keys(inheritStyle)
    .filter(a => Boolean(inheritStyle[a]))
    .sort(
      (a, b) => (inheritStyle[a].priority > inheritStyle[b].priority ? 1 : -1)
    );

  return componentIds.reduce((style, componentId) => {
    const component = getPCNode(componentId, context.graph) as PCComponent;
    const compStyle =
      computed[componentId] ||
      (computed[componentId] = {
        ...component.style,
        ...getInheritedStyle(component.inheritStyle, context, computed)
      });
    return { ...style, ...compStyle };
  }, {});
};

const translateStyle = (
  target: ContentNode,
  style: any,
  context: TranslateContext
) => {
  const isSVG = isSVGPCNode(target, context.graph);

  if (isSVG) {
    // TODO - add vendor prefix stuff here
    for (const key in style) {
      const propName = kebabCase(key);
      context = addLineItem(
        `" ${SVG_STYLE_PROP_MAP[propName] || propName}: ${translateStyleValue(
          key,
          style[key]
        ).replace(/[\n\r]/g, " ")};" + \n`,
        context
      );
    }
  } else {
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
  }

  return context;
};

const translateStyleOverrides = (
  contentNode: ContentNode,
  context: TranslateContext
) => {
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
    let selector = `._${override.id}`;
    if (override.variantId) {
      selector += `._${override.variantId}`;
    }
    context = addOpenTag(`"${selector} {" + \n`, context);
    context = translateStyle(
      getPCNode(last(override.targetIdPath), context.graph) as ContentNode,
      override.value,
      context
    );
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
  context = translateStaticOverrides(contentNode, context);
  context = translateComponentStyles(contentNode, context);

  const variantLabelMap = getVariantLabelMap(contentNode);
  context = addOpenTag(`const VARIANT_LABEL_ID_MAP = {\n`, context);
  for (const id in variantLabelMap) {
    context = addLine(`"${variantLabelMap[id][0]}": "${id}",`, context);
  }
  context = addCloseTag(`};\n`, context);
  context = addOpenTag(`const DEFAULT_VARIANT_IDS = [\n`, context);
  for (const id in variantLabelMap) {
    const [name, isDefault] = variantLabelMap[id];
    if (isDefault) {
      context = addLine(`"${id}",`, context);
    }
  }
  context = addCloseTag(`];\n`, context);

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

  context = addLine(
    `var variant = props.variant != null ? props.variant.split(" ").map(function(label) { return VARIANT_LABEL_ID_MAP[label.trim()] || label.trim(); }) : DEFAULT_VARIANT_IDS;`,
    context
  );

  context = setCurrentScope(contentNode.id, context);
  context = defineNestedObject([`_${contentNode.id}Props`], false, context);
  context = flattenTreeNode(contentNode)
    .filter(isVisibleNode)
    .reduce((context, node: ContentNode) => {
      if (node === contentNode) return context;
      context = addScopedLayerLabel(node.label, node.id, context);
      context = addLine("", context);

      const propsVarName = getNodePropsVarName(node, context);

      context = defineNestedObject([`_${node.id}Props`], false, context);
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

  // variants need to come first since there may be child overrides that have variant styles
  context = translateContentNodeVariantOverrides(contentNode, context);
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

const getVariantLabelMap = (contentNode: ContentNode) => {
  const map = {};
  const variants = getPCVariants(contentNode);
  for (const variant of variants) {
    map[variant.id] = [camelCase(variant.label), variant.isDefault];
  }
  return map;
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

const translateStaticOverrides = (
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
    context = translateLabelOverrides(component, instance, context);
    context = translateDynamicOverrides(component, instance, null, context);
  }

  return context;
};

const translateContentNodeVariantOverrides = (
  component: ContentNode,
  context: TranslateContext
) => {
  const instances = filterNestedNodes(
    component,
    node =>
      node.name === PCSourceTagNames.COMPONENT ||
      node.name === PCSourceTagNames.COMPONENT_INSTANCE
  );

  const variants = getPCVariants(component);
  for (const variant of variants) {
    context = addOpenTag(
      `if (variant.indexOf("${variant.id}") !== -1) {\n`,
      context
    );
    for (let i = instances.length; i--; ) {
      const instance = instances[i];
      const overrides = getOverrides(instance);
      const overrideMap = getOverrideMap(overrides);
      if (!overrideMap[variant.id]) {
        continue;
      }
      context = translateDynamicOverrides(
        component,
        instance,
        variant.id,
        context
      );
    }
    context = addCloseTag(`}\n`, context);
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

const isStaticOverride = (override: PCOverride) =>
  override.propertyName !== PCOverridablePropertyName.CHILDREN &&
  !override.variantId;
const isLabelOverride = (override: PCOverride): override is PCLabelOverride =>
  override.propertyName === PCOverridablePropertyName.LABEL;
const isDynamicOverride = (override: PCOverride) =>
  (override.propertyName === PCOverridablePropertyName.CHILDREN &&
    override.children.length > 0) ||
  Boolean(override.variantId);

const mapContainsDynamicOverrides = mapContainersOverride(isDynamicOverride);
const mapContainsStaticOverrides = mapContainersOverride(isStaticOverride);
const mapContainsLabelOverrides = mapContainersOverride(isLabelOverride);

const defineNestedObject = (
  keyPath: string[],
  setObject: boolean,
  context: TranslateContext
) => {
  if (!context.definedObjects[context.currentScope]) {
    context = {
      ...context,
      definedObjects: { ...context.definedObjects, [context.currentScope]: {} }
    };
  }

  for (let i = 0, { length } = keyPath; i < length; i++) {
    const currentPath = keyPath.slice(0, i + 1);
    const ref = currentPath.join(".");
    if (!context.definedObjects[context.currentScope][ref]) {
      if (setObject) {
        context = addOpenTag(`if (${ref}) {\n`, context);
        context = addLine(`${ref} = Object.assign({}, ${ref});`, context);
        context = addCloseTag(`}`, context);
        context = addOpenTag(` else {\n`, context);
        context = addLine(`${ref} = {};`, context);
        context = addCloseTag(`}\n`, context);
      }
      context = {
        ...context,
        definedObjects: {
          ...context.definedObjects,
          [context.currentScope]: {
            ...context.definedObjects[context.currentScope],
            [ref]: true
          }
        }
      };
    }
  }

  return context;
};

const translateLabelOverrides = (
  component: ContentNode,
  instance: PCComponent | PCComponentInstanceElement,
  context: TranslateContext
) => {
  const overrides = getOverrides(instance);
  for (const override of overrides) {
    if (isLabelOverride(override)) {
      const keyPath = [instance.id + "Props", ...override.targetIdPath].map(
        id => `_${id}`
      );
      context = defineNestedObject(
        keyPath.slice(0, keyPath.length - 1),
        true,
        context
      );
      context = addLine(
        `${keyPath.join(".")} = Object.assign({}, ${keyPath.join(".")}, _${
          component.id
        }Props.${camelCase(override.value)}Props);`,
        context
      );
    }
  }
  return context;
};

const translateDynamicOverrides = (
  component: ContentNode,
  instance: PCComponent | PCComponentInstanceElement,
  variantId: string,
  context: TranslateContext
) => {
  const overrides = getOverrides(instance);

  for (const override of overrides) {
    if (isDynamicOverride(override) && override.variantId == variantId) {
      let keyPath: string[];

      if (getNestedTreeNodeById(last(override.targetIdPath), component)) {
        keyPath = [`_${last(override.targetIdPath)}Props`];
      } else {
        keyPath = [instance.id + "Props", ...override.targetIdPath].map(
          id => `_${id}`
        );
      }
      context = defineNestedObject(keyPath, true, context);
      context = translateDynamicOverrideSetter(
        keyPath.join("."),
        override,
        context
      );
    }
  }

  return context;
};

const getIdPathPropRef = (idPath: string[]) =>
  idPath.slice(1).reduce((ref, id, index, ary) => {
    return ref + " && " + ref + "._" + ary.slice(0, index + 1).join("._");
  }, "_" + idPath[0] + "Props");

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

const translateDynamicOverrideSetter = (
  varName: string,
  override: PCOverride,
  context: TranslateContext
) => {
  switch (override.propertyName) {
    case PCOverridablePropertyName.CHILDREN: {
      const visibleChildren = getVisibleChildren(override);

      // may be defined in the upper scope
      context = addOpenTag(`if (!${varName}.children) {\n`, context);
      if (visibleChildren.length) {
        context = addOpenTag(`${varName}.children =  [\n`, context);
        for (const child of visibleChildren) {
          context = translateVisibleNode(child, context);
          context = addLineItem(",\n", context);
        }
        context = addCloseTag(`];\n`, context);
      }
      context = addCloseTag(`}\n`, context);
      return context;
    }
  }

  if (override.variantId) {
    switch (override.propertyName) {
      case PCOverridablePropertyName.STYLE: {
        context = addLine(
          `${varName}.className = (${varName}.className ? ${varName}.className + " " : "") + "_${
            override.id
          } _${override.variantId}";`,
          context
        );
        return context;
      }
    }
  }

  return context;
};

const translateStaticOverride = (
  override: PCOverride,
  context: TranslateContext
) => {
  if (override.variantId) {
    return context;
  }
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
