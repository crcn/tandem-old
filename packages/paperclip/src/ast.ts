export enum PCExpressionType {
  STRING,
  BLOCK,
  STRING_BLOCK,
  ELEMENT,
  SELF_CLOSING_ELEMENT,
  TEXT_NODE,
  COMMENT,
  ATTRIBUTE,
  START_TAG,
  BLOCK_STRING,
  FRAGMENT,
  END_TAG
};

export enum BKExpressionType {
  TYPE = "TYPE",
  BIND = "BIND",
  IF = "IF",
  STRING = "STRING",
  OBJECT = "OBJECT",
  ARRAY = "ARRAY",
  KEY_VALUE_PAIR = "KEY_VALUE_PAIR",
  NUMBER = "NUMBER",
  PROPERTY = "PROPERTY",
  RESERVED_KEYWORD = "RESERVED_KEYWORD",
  ELSEIF = "ELSEIF",
  NOT = "NOT",
  OPERATION = "OPERATION",
  GROUP = "GROUP",
  VAR_REFERENCE = "VAR_REFERENCE",
  PROP_REFERENCE = "PROP_REFERENCE",
  ELSE = "ELSE",
  REPEAT = "REPEAT"
};

export enum CSSExpressionType {
  SHEET,
  DECLARATION_PROPERTY,
  STYLE_RULE,
  AT_RULE,
  IMPORT,
  CHARSET
};

export enum DcExpressionType {
  COLOR = "COLOR",
  CALL = "CALL",
  MEASUREMENT = "MEASUREMENT",
  SPACED_LIST = "SPACED_LIST",
  COMMA_LIST = "COMMA_LIST",
  KEYWORD = "KEYWORD",
  LIST = "LIST"
};

export type Token = {
  type: number;
  pos: number;
  value?: string;
};

export type ExpressionPosition = {
  line: number;
  column: number;
  pos: number;
};

// Sourc information that is attached to each rendered object 
// that describes basic information about the expression that it
// is representing. Note that only minimal information about the expression is attached here to ensure that the source information body size stays relatively small. The shape of this object may change depending on the behavior of each expression.
export type VMObjectExpressionSource = {
  uri: string;
} & ExpressionLocation;

export type ExpressionLocation = {
  start: ExpressionPosition;
  end: ExpressionPosition;
};

export type PCExpression = {
  type: number|string;
  location: ExpressionLocation;
};

export type PCRootExpression = {
  input: string;
} & PCExpression;

export type PCTextNode = {
  value: string;
} & PCExpression;

export type PCComment = {
  value: string;
} & PCExpression;

export type PCString = {
  value: string;
} & PCExpression;

export type PCReference = {

} & PCExpression;

export type BKExpression = PCExpression;

export type PCBlock = {
  value: BKExpression;
} & PCExpression;

export type BKBind = {
  value: BKExpression;
} & PCExpression;

export type BKReservedKeyword = {
  value: string;
} & PCExpression;


export type BKPropertyReference = {
  path: BKVarReference[];
} & BKExpression;

export type BKVarReference = {
  name: string;
} & BKExpression;

export type BKGroup = {
  value: BKExpression;
} & BKExpression;

export type BKObject = {
  properties: BKKeyValuePair[];
} & BKExpression;

export type BKString = {
  value: string;
} & BKExpression;

export type BKKeyValuePair = {
  key: string;
  value: BKExpression;
} & BKExpression;

export type BKArray = {
  values: BKExpression[];
} & BKExpression;

export type BKRepeat = {
  each: BKExpression;
  asKey: BKVarReference;
  asValue: BKVarReference;
} & BKExpression;

export type BKOperation = {
  left: BKExpression;
  operator: string;
  right: BKExpression;
} & BKExpression;

export type BKIf = {
  condition: BKExpression;
} & BKExpression;

export type BKProperty = {
  name: string;
  defaultValue?: string;
} & BKExpression;

export type BKNumber = {
  value: string;
} & BKExpression;

export type BKNot = {
  value: BKExpression;
} & BKExpression;

export type BKElseIf = BKIf;
export type BKElse = BKExpression;

export type CSSExpression = PCExpression;
export type CSSRule = CSSExpression;

export type CSSGroupingRule = {
  children: (CSSRule|CSSDeclarationProperty)[];
} & CSSExpression;

export type CSSStyleRule = {
  selectorText: string;
} & CSSGroupingRule;

export type CSSDeclarationProperty = {
  name: string;
  value: string;
} & CSSExpression;

export type CSSAtRule = {
  name: string;
  params: string[];
} & CSSGroupingRule;

export type CSSSheet = CSSGroupingRule;

export type DcExpression = CSSExpression;

export type DcCall = {
  type: DcExpressionType.CALL;
  name: string;
  params: DcExpression[];
} & DcExpression;

export type DcColor = {
  type: DcExpressionType.COLOR;
  value: string;
} & DcExpression;

export type DcList = {
  type: DcExpressionType.SPACED_LIST | DcExpressionType.COMMA_LIST;
  items: DcExpression[];
} & DcExpression;

export type DcMeasurement = {
  type: DcExpressionType.MEASUREMENT;
  value: string;
  unit: string;
} & DcExpression;

export type DcKeyword = {
  type: DcExpressionType.KEYWORD;
  name: string;
} & DcExpression;

export type PCStringBlock = {
  values: Array<PCString|PCBlock>;
} & PCExpression;

export type PCAttribute = {
  location: ExpressionLocation;
  name: string;
  value?: PCExpression;
} & PCExpression;

export type PCStartTag = {
  name: string;
  modifiers: PCBlock[];
  attributes: PCAttribute[];
} & PCExpression;

export type PCEndTag = {
  name: string;
} & PCExpression;

export type PCSelfClosingElement = {

} & PCStartTag;

type ChildNodes = Array<PCElement | PCSelfClosingElement | PCBlock | PCTextNode>;

export type PCParent = {
  childNodes: ChildNodes;
} & PCExpression;

export type PCFragment = {
} & PCParent;

export type PCElement = {
  startTag: PCStartTag;
  endTag: PCEndTag;
} & PCParent;

export const getElementChildNodes = (ast: PCSelfClosingElement | PCElement) => ast.type == PCExpressionType.SELF_CLOSING_ELEMENT ? [] : (ast as PCElement).childNodes;

export const getElementTagName = (ast: PCSelfClosingElement | PCElement) => ast.type == PCExpressionType.SELF_CLOSING_ELEMENT ? (ast as PCSelfClosingElement).name : (ast as PCElement).startTag.name;

// TODO - assert string value
export const getAttributeStringValue = (attr: PCAttribute) => (attr.value as PCString).value;

export const getElementAttributes = (ast: PCSelfClosingElement | PCElement) => getStartTag(ast).attributes;

export const getElementModifiers = (ast: PCSelfClosingElement | PCElement) => getStartTag(ast).modifiers;

export const isTag = (ast: PCExpression) => ast.type === PCExpressionType.ELEMENT || ast.type === PCExpressionType.ELEMENT || ast.type === PCExpressionType.START_TAG || ast.type === PCExpressionType.END_TAG || ast.type === PCExpressionType.SELF_CLOSING_ELEMENT;


export const filterPCElementsByStartTag = (ast: PCExpression, filter: (ast: PCStartTag | PCSelfClosingElement) => boolean) => filterPCASTTree(ast, (expression) => (expression.type === PCExpressionType.SELF_CLOSING_ELEMENT ? filter(expression as PCSelfClosingElement): expression.type === PCExpressionType.ELEMENT ? filter((expression as PCElement).startTag) : false));

export const getElementStartTag = (element: PCSelfClosingElement | PCElement): PCStartTag => element.type === PCExpressionType.SELF_CLOSING_ELEMENT || element.type == PCExpressionType.START_TAG ? element as PCSelfClosingElement : (element as PCElement).startTag;

export const getPCStartTagAttribute = (element: PCElement | PCSelfClosingElement, name: string) => {
  if (!hasPCStartTagAttribute(element, name)) return;
  const attr = getElementStartTag(element).attributes.find((attr) => attr.name === name);
  return attr && attr.value && (attr.value as PCString).value;
}

export const hasPCStartTagAttribute = (element: PCElement | PCSelfClosingElement, name: string) => {
  return (element.type === PCExpressionType.ELEMENT || element.type === PCExpressionType.SELF_CLOSING_ELEMENT || element.type === PCExpressionType.START_TAG) && Boolean(getElementStartTag(element).attributes.find((attr) => attr.name === name));
}

export const getPCStyleElements = (parent: PCParent) => filterPCASTTree(parent, (expression) => expression.type === PCExpressionType.ELEMENT && (expression as PCElement).startTag.name === "style");

export const getPCLinkStyleElements = (parent: PCParent) => filterPCASTTree(parent, (expression) => expression.type === PCExpressionType.SELF_CLOSING_ELEMENT && (expression as PCSelfClosingElement).name === "link" && getPCStartTagAttribute(expression as PCSelfClosingElement, "rel") === "stylesheet");

export const getPCCSSElements = (parent: PCParent) => [
  ...getPCStyleElements(parent),
  ...getPCLinkStyleElements(parent)
];

/**
 * @param ast 
 */

export const getPCMetaTags = (ast: PCExpression) => {
  return getPCASTElementsByTagName(ast, "meta");
}

/**
 * Returns the human friendly name of the module, otherwise the file path is used
 * @param ast 
 */

export const getPCMetaName = (ast: PCExpression) => {
  const nameMetaTag = getPCMetaTags(ast).find((meta) => Boolean(getPCStartTagAttribute(meta, "name")));
  return nameMetaTag && getPCStartTagAttribute(nameMetaTag, "content");
}

export const traversePCAST = (ast: PCExpression, each: (ast: PCExpression, path?: any[]) => void | boolean, path: any[] = []) => {
  if (each(ast, path) === false) {
    return false;
  }

  if ((ast as PCParent).childNodes) {
    const parent = ast as PCParent;
    for (let i = 0, {length} = parent.childNodes; i < length; i++) {
      const child = parent.childNodes[i];
      if (traversePCAST(child, each, [...path, "childNodes", i]) === false) {
        return false;
      }
    }
  }
};

export const getStartTag = (element: PCElement | PCStartTag): PCStartTag => {
  return element.type === PCExpressionType.ELEMENT ? (element as PCElement).startTag : element as PCStartTag;
};

export const getPCElementModifier = (element: PCElement | PCStartTag, type: BKExpressionType) => {
  return getStartTag(element).modifiers.find((modifier) => modifier.value.type === type);
};

export const getExpressionPath = (expression: PCExpression, root: PCExpression) => {
  let _path: any[];
  traversePCAST(root, (child, path) => {
    if (child === expression) {
      _path = path;
      return false;
    }
  });

  return _path;
}


export const filterPCASTTree = (ast: PCExpression, filter: (ast: PCExpression) => boolean) => {
  const expressions: PCExpression[] = [];
  traversePCAST(ast, (expression) => {
    if (filter(expression)) {
      expressions.push(expression);
    }
  });

  return expressions;
};

export const getPCASTElementsByTagName = (ast: PCExpression, tagName: string) => filterPCElementsByStartTag(ast, (tag) => tag.name === tagName) as Array<PCElement | PCSelfClosingElement>;

export const getPCParent = (root: PCParent, tagOrChild: PCExpression) => filterPCASTTree(root, expr => expr["childNodes"] && expr["childNodes"].find((child) => {
  return child === tagOrChild || (tagOrChild.type === PCExpressionType.START_TAG && child.type === PCExpressionType.ELEMENT && (child as PCElement).startTag === tagOrChild) 
}))[0] as PCParent;


export const getAllChildElementNames = (root: PCExpression) => {
  const childElementNames: string[] = [];

  traversePCAST(root, (element) => {
    if (isTag(element) && childElementNames.indexOf(getStartTag(element as PCElement).name) === -1) {
      childElementNames.push(getStartTag(element as PCElement).name);
    }
  });
  
  return childElementNames;
};
