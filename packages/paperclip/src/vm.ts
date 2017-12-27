import { PCElement, PCTextNode, PCSelfClosingElement, PCExpression, PCRootExpression, PCExpressionType, PCComment, PCStartTag, BKRepeat, BKIf, BKElse, BKExpression, BKExpressionType, BKElseIf, PCAttribute, PCStringBlock, BKNumber, BKNot, BKString, BKOperation, BKGroup, BKObject, BKArray, BKBind, PCString, PCBlock, CSSStyleRule, CSSSheet, CSSAtRule, CSSDeclarationProperty, CSSExpression, CSSExpressionType, CSSGroupingRule } from "./ast";
import { Diagnostic, DiagnosticType, diagnosticsContainsError } from "./parser-utils";
import { getReferenceKeyPath } from "./inferencing";
import { loadModuleDependencyGraph, DependencyGraph, IO, Component, getAllComponents, getComponentPreview, getComponentSourceUris, getAllGlobalStyles } from "./loader";
import { eachValue } from "./utils";
import { SlimBaseNode, SlimParentNode, SlimTextNode, SlimElement, SlimVMObjectType, pushChildNode, SlimElementAttribute, VMObjectSource, SlimStyleElement, SlimCSSStyleSheet, SlimCSSStyleRule, SlimCSSRule, SlimCSSStyleDeclaration, SlimCSSAtRule, VMObject } from "slim-dom";
import { kebabCase } from "lodash";

// Note that this is MUTABLE primarily to make incrementing
// IDs easier. 
type VMContext = {
  idSeed: string,
  refCount: number;
  currentProps: any;
  currentURI: string;
  graph: DependencyGraph;
  globalStyles: PCExpression[];
  components: {
    [identifier: string]: Component
  };
  diagnostics: Diagnostic[]
};

type VMResult = {
  document: SlimBaseNode;
  diagnostics: Diagnostic[];
};

export type RunPCFileEntry = {
  filePath: string;
  componentId: string;
  previewName: string;
}

export type RunPCFileOptions = {
  entry: RunPCFileEntry;
  graph: DependencyGraph;
  idSeed?: string
};

// TODO - may eventually want to have a compilation step for this
export const runPCFile = ({ entry: { filePath, componentId, previewName }, graph, idSeed }: RunPCFileOptions): VMResult => {

  let memoKey = "__memo$$" + filePath + componentId + previewName;
  if (graph[memoKey]) {
    return graph[memoKey] as any;
  }
  
  const context: VMContext = {
    idSeed: String(idSeed || Math.floor(1000 + Math.random() * 8999)),
    refCount: 0,
    currentProps: {},
    globalStyles: getAllGlobalStyles(graph),
    currentURI: getComponentSourceUris(graph)[componentId],
    graph,
    components: getAllComponents(graph),
    diagnostics: []
  };
  
  const component = context.components[componentId];

  if (!component) {
    return {
      document: null,
      diagnostics: [{ type: DiagnosticType.ERROR, message: `Component "${componentId}" does not exist`, filePath: null, location: null }]
    };
  }

  const preview = previewName ? getComponentPreview(previewName, component) : component.previews[0];
  if (!preview) {
    return {
      document: null,
      diagnostics: [{ type: DiagnosticType.ERROR, message: `Preview "${previewName}" does not exist for component "${componentId}"`, filePath: null, location: null }]
    };
  }

  return graph[memoKey] = ({
    document: runPreview(preview.source, context),
    diagnostics: []
  } as VMResult) as any;
};

const createId = (context: VMContext) => {
  return context.idSeed + (++context.refCount);
}

const runPreview = (preview: PCElement, context: VMContext) => {
  let root = {
    id: createId(context),
    type: SlimVMObjectType.DOCUMENT_FRAGMENT,
    childNodes: [],
    source: createVMSource(preview, context)
  };

  for (let i = 0, {length} = context.globalStyles; i < length; i++) {
    root = appendChildNode(root, context.globalStyles[i], context);
  }

  root = appendChildNodes(root, preview.childNodes, context);

  return root;
};

let appendElement = <TParent extends SlimParentNode>(parent: TParent, child: PCElement|PCSelfClosingElement, context: VMContext): TParent => {
  let _repeat: BKRepeat;

  const startTag = child.type === PCExpressionType.SELF_CLOSING_ELEMENT ? child as PCSelfClosingElement : (child as PCElement).startTag;
  
  for (let i = 0, {length} = startTag.modifiers; i < length; i++) {
    const modifier = startTag.modifiers[i].value;
    if (modifier.type === BKExpressionType.REPEAT) {
      _repeat = modifier as BKRepeat;
      break;
    }
  }

  if (_repeat) {
    eachValue(evalExpr(_repeat.each, context), (item, i) => {
      const oldProps = context.currentProps;
      context.currentProps = {
        ...context.currentProps,
        [_repeat.asValue.name]: item,
        [_repeat.asKey ? _repeat.asKey.name : "__i"]: i,
      }
      parent = appendRawElement(parent, child, context);
      context.currentProps = oldProps;
    });
  } else {
    parent = appendRawElement(parent, child, context);
  }
  
  return parent;
}

const appendRawElement = <TParent extends SlimParentNode>(parent: TParent, child: PCElement|PCSelfClosingElement, context: VMContext) => {
  let startTag: PCStartTag;
  let childNodes: PCExpression[];

  if (child.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    childNodes = [];
    startTag = child as PCSelfClosingElement;
  } else {
    const el = child as PCElement;
    childNodes = el.childNodes;
    startTag = el.startTag;
  }

  const { name } = startTag;

  if (name === "link") {
    return parent;
  }

  let attributes: SlimElementAttribute[] = [];
  let props = {};
  
  for (let i = 0, {length} = startTag.attributes; i < length; i++) {
    const attribute = startTag.attributes[i];
    const value     = normalizeAttributeValue(attribute.name, evalAttributeValue(attribute.value, context));
    props[attribute.name] = value;
    attributes.push({
      name: attribute.name,
      value,
    });
  }
  
  for (let i = 0, {length} = startTag.modifiers; i < length; i++) {
    const modifier = startTag.modifiers[i].value;
    if (modifier.type === BKExpressionType.BIND) {
      Object.assign(props, evalExpr(modifier as BKBind, context) || {});
    }
  }

  if (name === "style") {
    let style = {
      id: createId(context),
      type: SlimVMObjectType.ELEMENT,
      tagName: name,
      attributes,
      childNodes: [],
      source: createVMSource(child, context),
      sheet: createStyleSheet(childNodes[0] as any as CSSSheet, context)
    } as SlimStyleElement;
    return pushChildNode(parent, style);
  }

  let shadow: SlimParentNode;
  const component = context.components[name];

  if (component) {
    shadow = {
      id: createId(context),
      type: SlimVMObjectType.DOCUMENT_FRAGMENT,
      childNodes: [],
      source: createVMSource(component.source, context)
    } as SlimParentNode;
    if (component.style) {
      shadow = appendChildNode(shadow, component.style, context);
    }
    const oldURI = context.currentURI;
    const oldProps = context.currentProps;
    context.currentURI = getComponentSourceUris(context.graph)[component.id];
    context.currentProps = props;
    shadow = appendChildNodes(shadow, component.template.childNodes, context);
    context.currentURI = oldURI;
    context.currentProps = oldProps;
  }

  let element = {
    id: createId(context),
    type: SlimVMObjectType.ELEMENT,
    tagName: name,
    attributes,
    childNodes: [],
    source: createVMSource(child, context),
    shadow: shadow
  } as SlimElement;

  element = appendChildNodes(element, childNodes, context);
  parent = pushChildNode(parent, element); 

  return parent;
}

const normalizeAttributeValue = (name: string, value: any) => {

  // TODO - check if this is STRING instead
  if (name === "style") {
    // return stringifyStyleAttributeValue(value);
  }
  return value;
};

const evalAttributeValue = (value: PCExpression, context: VMContext) => {
  if (!value) {
    return true;
  } else if (value.type === PCExpressionType.STRING_BLOCK) {
    return (value as PCStringBlock).values.map((expr) => evalAttributeValue(expr, context)).join("");
  } else if (value.type === PCExpressionType.STRING) {
    return (value as PCString).value;
  } else {
    return evalExpr((value as PCBlock).value, context);
  }
};

const appendChildNode = <TParent extends SlimParentNode>(parent: TParent, child: PCExpression, context: VMContext): TParent => {
  switch(child.type) {    
    case PCExpressionType.TEXT_NODE: return appendTextNode(parent, child as PCTextNode, context);
    case PCExpressionType.BLOCK: return appendTextBlock(parent, child as PCBlock, context)
    case PCExpressionType.ELEMENT:
    case PCExpressionType.SELF_CLOSING_ELEMENT: return appendElement(parent, child as PCElement, context);
    default: return parent;
  }
};

const appendChildNodes = <TParent extends SlimParentNode>(parent: TParent, childNodes: PCExpression[], context: VMContext): TParent => {

  // TODO - check for conditional stuff here

  let _passedCondition: boolean;

  for (let i = 0, {length} = childNodes; i < length; i++) {
    let startTag: PCStartTag;
    const childNode = childNodes[i];
    startTag = childNode.type === PCExpressionType.ELEMENT ? (childNode as PCElement).startTag : childNode.type === PCExpressionType.SELF_CLOSING_ELEMENT ? childNode as PCSelfClosingElement : null;

    if (startTag) {
      let _if: BKIf|BKElseIf;
      let _isCondition: boolean;
      for (let i = 0, {length} = startTag.modifiers; i < length; i++) {
        const modifier = startTag.modifiers[i].value;
        
        if (modifier.type === BKExpressionType.IF || modifier.type === BKExpressionType.ELSEIF) {
          _if = modifier as BKIf;
          _isCondition = true;
        } else if (modifier.type === BKExpressionType.ELSE) {
          _isCondition = true;
        }
      }

      if (_isCondition) {
        if (_if ? evalExpr(_if.condition, context) : !_passedCondition) {
          _passedCondition = true;
        } else {
          continue;
        }
      }
    }

    parent = appendChildNode(parent, childNodes[i], context);
  }

  return parent;
};

const appendTextNode = <TParent extends SlimParentNode>(parent: TParent, child: PCTextNode, context: VMContext) => {
  return pushChildNode(parent, {
    id: createId(context),
    type: SlimVMObjectType.TEXT,
    value: String(child.value || "") || " ",
    source: createVMSource(child, context)
  } as SlimTextNode);
};

const appendTextBlock = <TParent extends SlimParentNode>(parent: TParent, child: PCBlock, context: VMContext) => pushChildNode(parent, {
  id: createId(context),
  type: SlimVMObjectType.TEXT,
  value: evalExpr(child.value, context),
  source: createVMSource(child, context)
} as SlimTextNode);

const createStyleSheet = (expr: CSSSheet, context: VMContext): SlimCSSStyleSheet => {

  const rules: SlimCSSRule[] = new Array(expr.children.length);

  for (let i = 0, {length} = expr.children; i < length; i++) {
    const child = expr.children[i];
    rules[i] = createCSSRule(child, context);
  }

  return {
    rules,
    id: createId(context),
    type: SlimVMObjectType.STYLE_SHEET,
    source: createVMSource(expr, context)
  };
}

const createCSSRule = (rule: CSSExpression, context: VMContext) => {
  const source = createVMSource(rule, context);
  switch(rule.type) {
    case CSSExpressionType.STYLE_RULE: {
      const { selectorText, children } = rule as CSSStyleRule;
      const style: SlimCSSStyleDeclaration = {
        id: createId(context),
      } as any;
      
      for (let i = 0, {length} = children; i < length; i++) {
        const child = children[i];
        if (child.type === CSSExpressionType.DECLARATION_PROPERTY) {
          const decl = child as CSSDeclarationProperty;
          style[decl.name] = decl.value;
        }
      };

      return {
        id: createId(context),
        type: SlimVMObjectType.STYLE_RULE,
        selectorText,
        style,
        source
      } as SlimCSSStyleRule;
    }
    case CSSExpressionType.AT_RULE: {
      const { name, params, children } = rule as CSSAtRule;
      const rules: SlimCSSRule[] = new Array(children.length);
      for (let i = 0, {length} = children; i < length; i++) {
        const child = children[i];
        rules[i] = createCSSRule(child, context);
      }
      return {
        id: createId(context),
        name,
        type: SlimVMObjectType.AT_RULE,
        params: params.join(" "),
        rules,
        source,
      } as SlimCSSAtRule;

    }
  }
}

const evalExpr = (expr: BKExpression, context: VMContext) => {
  switch(expr.type) {
    case BKExpressionType.OPERATION: {
      const { left, operator, right } = expr as BKOperation;
      let lv = evalExpr(left, context);
      let rv = evalExpr(right, context);
      switch(operator) {
        case `+`: return lv + rv;
        case `-`: return lv - rv;
        case `*`: return lv * rv;
        case `/`: return lv / rv;
        case `%`: return lv % rv;
        case `&&`: return lv && rv;
        case `||`: return lv || rv;
        case `==`: return lv == rv;
        case `===`: return lv === rv;
        case `!=`: return lv != rv;
        case `!==`: return lv !== rv;
        case `>`: return lv > rv;
        case `>=`: return lv >= rv;
        case `<`: return lv < rv;
        case `<=`: return lv <= rv;
      }
    }
    case BKExpressionType.NUMBER: {
      return Number((expr as BKNumber).value);
    }
    case BKExpressionType.STRING: {
      return String((expr as BKString).value);
    }
    case BKExpressionType.OBJECT: {
      const obj = expr as BKObject;
      let ret = {};
      for (const {key, value} of obj.properties) {
        ret[key] = evalExpr(value, context);
      }
      return ret;
    }
    case BKExpressionType.ARRAY: {
      const ary = expr as BKArray;
      let ret = [];
      for (const value of ary.values) {
        ret.push(evalExpr(value, context));
      }
      return ret;
    }
    case BKExpressionType.NOT: {
      return !evalExpr((expr as BKNot).value, context);
    }
    case BKExpressionType.GROUP: {
      return evalExpr((expr as BKGroup).value, context);
    }
    case BKExpressionType.BIND: {
      return evalExpr((expr as BKBind).value, context);
    }
    case BKExpressionType.IF: 
    case BKExpressionType.ELSEIF: {
      return evalExpr((expr as BKIf).condition, context)
    }
    case BKExpressionType.PROP_REFERENCE: 
    case BKExpressionType.VAR_REFERENCE: {
      const keypath = getReferenceKeyPath(expr);
      let current = context.currentProps;
      for (let i = 0, {length} = keypath; i < length; i++) {
        current = current[keypath[i]];
        if (!current) break;
      }
      return current;
    }
    default: return null;
  }
};

const createVMSource = (expr: PCExpression, context: VMContext): VMObjectSource => ({
  type: expr.type,
  uri: context.currentURI,
  range: {
    start: expr.location.start,
    end: expr.location.end
  }
});