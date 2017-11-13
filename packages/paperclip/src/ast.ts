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
  TYPE,
  ECHO,
  IF,
  NUMBER,
  PROPERTY,
  RESERVED_KEYWORD,
  ELSEIF,
  NOT,
  OPERATION,
  GROUP,
  REFERENCE,
  ELSE,
  REPEAT
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

export type ExpressionLocation = {
  start: ExpressionPosition;
  end: ExpressionPosition;
};

export type PCExpression = {
  type: number;
  location: ExpressionLocation;
};

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

export type BKExpression = {
  
  } & PCExpression;

export type PCBlock = {
  value: BKExpression;
} & PCExpression;

export type BKBind = {
  value: BKExpression;
} & PCExpression;

export type BKReservedKeyword = {
  value: string;
} & PCExpression;

export type BKReference = {
  value: string;
} & BKExpression;

export type BKGroup = {
  value: BKExpression;
} & BKExpression;

export type BKRepeat = {
  each: BKReference;
  asKey: BKReference;
  asValue: BKReference;
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

export type BKNot = {
  value: BKExpression;
} & BKExpression;

export type BKElseIf = BKIf;
export type BKElse = BKExpression;

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

export const isTag = (ast: PCExpression) => ast.type === PCExpressionType.ELEMENT || ast.type === PCExpressionType.ELEMENT || ast.type === PCExpressionType.START_TAG || ast.type === PCExpressionType.END_TAG;


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
}

export const getStartTag = (element: PCElement | PCStartTag) => {
  return element.type === PCExpressionType.ELEMENT ? (element as PCElement).startTag : element as PCStartTag;
};

export const getPCElementModifier = (element: PCElement | PCStartTag, type: BKExpressionType) => {
  return getStartTag(element).modifiers.find((modifier) => modifier.type === type);
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
