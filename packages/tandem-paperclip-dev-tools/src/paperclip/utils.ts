import { 
  PCParent,
  PCString,
  PCElement,
  PCFragment,
  PCStartTag,
  PCExpression,
  PCExpressionType,
  PCSelfClosingElement,
} from "./ast";

export const filterPCElementsByStartTag = (ast: PCExpression, filter: (ast: PCStartTag | PCSelfClosingElement) => boolean) => filterPCASTTree(ast, (expression) => (expression.type === PCExpressionType.SELF_CLOSING_ELEMENT ? filter(expression as PCSelfClosingElement): expression.type === PCExpressionType.ELEMENT ? filter((expression as PCElement).startTag) : false));

export const getElementStartTag = (element: PCSelfClosingElement | PCElement): PCStartTag => element.type === PCExpressionType.SELF_CLOSING_ELEMENT ? element as PCSelfClosingElement : (element as PCElement).startTag;

export const getPCStartTagAttribute = (element: PCElement | PCSelfClosingElement, name: string) => {
  const attr = getElementStartTag(element).attributes.find((attr) => attr.name === name);
  return attr && (attr.value as PCString).value;
}

export const hasPCStartTagAttribute = (element: PCElement | PCSelfClosingElement, name: string) => {
  return Boolean(getElementStartTag(element).attributes.find((attr) => attr.name === name));
}

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

  if ((ast as PCParent).children) {
    const parent = ast as PCParent;
    for (let i = 0, {length} = parent.children; i < length; i++) {
      const child = parent.children[i];
      if (traversePCAST(child, each, [...path, "children", i]) === false) {
        return false;
      }
    }
  }
}

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

export const getPCImports = (ast: PCExpression) => {
  const imports = {};
  traversePCAST(ast, (ast) => {
    if (ast.type === PCExpressionType.START_TAG || ast.type === PCExpressionType.SELF_CLOSING_ELEMENT || ast.type === PCExpressionType.ELEMENT) {

      if (ast.type === PCExpressionType.ELEMENT) {
        ast = (ast as PCElement).startTag;
      }
      
      for (const attr of (ast as PCSelfClosingElement).attributes) {
        if (attr.name.substr(0, 6) === "xmlns:") {
          imports[attr.name.substr(6)] = (attr.value as PCString).value;
        }
      }
    }
  });
  

  return imports;
}