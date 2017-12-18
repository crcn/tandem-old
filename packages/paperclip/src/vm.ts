import { PCElement, PCTextNode, PCSelfClosingElement, PCExpression, PCRootExpression, PCExpressionType, PCComment, PCStartTag, BKRepeat, BKIf, BKElse, BKExpression, BKExpressionType, BKElseIf, PCAttribute, PCStringBlock, BKNumber, BKNot, BKString, BKOperation, BKGroup, BKObject, BKArray, BKBind, PCString, PCBlock } from "./ast";
import { Diagnostic, DiagnosticType, diagnosticsContainsError } from "./parser-utils";
import { getReferenceKeyPath } from "./inferencing";
import { loadModuleDependencyGraph, DependencyGraph, IO, Component, getAllComponents, getComponentPreview, getComponentSourceUris } from "./loader";
import { eachValue } from "./utils";
import { BaseNode, ParentNode, TextNode, Element, NodeType, pushChildNode, ElementAttribute, VMObjectSource } from "slim-dom";

type VMContext = {
  currentProps: any;
  currentURI: string;
  graph: DependencyGraph;
  components: {
    [identifier: string]: Component
  };
  diagnostics: Diagnostic[]
};

type VMResult = {
  document: BaseNode;
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
};

// TODO - may eventually want to have a compilation step for this
export const runPCFile = ({ entry: { filePath, componentId, previewName }, graph }: RunPCFileOptions): VMResult => {

  let memoKey = "__memo$$" + filePath + componentId + previewName;
  if (graph[memoKey]) {
    return graph[memoKey] as any;
  }
  
  const context: VMContext = {
    currentProps: {},
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
    document: runPreview(preview, context),
    diagnostics: []
  } as VMResult) as any;
};

const runPreview = (preview: PCElement, context: VMContext) => {
  let root = {
    type: NodeType.DOCUMENT_FRAGMENT,
    childNodes: [],
    source: createVMSource(preview, context)
  };

  root = appendChildNodes(root, preview.childNodes, context);

  return root;
};

let appendElement = <TParent extends ParentNode>(parent: TParent, child: PCElement|PCSelfClosingElement, context: VMContext): TParent => {
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
      parent = appendRawElement(parent, child, {
        ...context,
        currentProps: {
          ...context.currentProps,
          [_repeat.asValue.name]: item,
          [_repeat.asKey ? _repeat.asKey.name : "__i"]: i,
        }
      });
    });
  } else {
    parent = appendRawElement(parent, child, context);
  }
  
  return parent;
}

let appendRawElement = <TParent extends ParentNode>(parent: TParent, child: PCElement|PCSelfClosingElement, context: VMContext) => {
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

  let attributes: ElementAttribute[] = [];
  let props = {};
  
  for (let i = 0, {length} = startTag.attributes; i < length; i++) {
    const attribute = startTag.attributes[i];
    const value     = evalAttributeValue(attribute.value, context);
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

  let shadow: ParentNode;
  const component = context.components[name];

  if (component) {
    shadow = {
      type: NodeType.DOCUMENT_FRAGMENT,
      childNodes: [],
      source: createVMSource(component.source, context)
    } as ParentNode;
    if (component.style) {
      shadow = appendChildNode(shadow, component.style, context);
    }
    shadow = appendChildNodes(shadow, component.template.childNodes, {
      ...context,
      currentURI: getComponentSourceUris(context.graph)[component.id],
      currentProps: props
    });
  }

  let element = {
    type: NodeType.ELEMENT,
    tagName: name,
    attributes,
    childNodes: [],
    source: createVMSource(child, context),
    shadow: shadow
  } as Element;

  element = appendChildNodes(element, childNodes, context);
  parent = pushChildNode(parent, element); 

  return parent;
}

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

const appendChildNode = <TParent extends ParentNode>(parent: TParent, child: PCExpression, context: VMContext): TParent => {
  switch(child.type) {    
    case PCExpressionType.TEXT_NODE: return appendTextNode(parent, child as PCTextNode, context);
    case PCExpressionType.BLOCK: return appendTextBlock(parent, child as PCBlock, context)
    case PCExpressionType.ELEMENT:
    case PCExpressionType.SELF_CLOSING_ELEMENT: return appendElement(parent, child as PCElement, context);
    default: return parent;
  }
};

const appendChildNodes = <TParent extends ParentNode>(parent: TParent, childNodes: PCExpression[], context: VMContext): TParent => {

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

const appendTextNode = <TParent extends ParentNode>(parent: TParent, child: PCTextNode, context: VMContext) => {
  return pushChildNode(parent, {
    type: NodeType.TEXT,
    value: String(child.value || "").trim() || " ",
    source: createVMSource(child, context)
  } as TextNode);
};

const appendTextBlock = <TParent extends ParentNode>(parent: TParent, child: PCBlock, context: VMContext) => pushChildNode(parent, {
  type: NodeType.TEXT,
  value: evalExpr(child.value, context),
  source: createVMSource(child, context)
} as TextNode);

const addDiagnosticError = (message: string, context: VMContext) => addDiagnostic(message, DiagnosticType.ERROR, context)

const addDiagnostic = (message: string, type: DiagnosticType, context: VMContext): VMContext => ({
  ...context,
  diagnostics: [
    ...context.diagnostics,
    {
      type,
      message,
      location: null,
      filePath: null
    }
  ]
});

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