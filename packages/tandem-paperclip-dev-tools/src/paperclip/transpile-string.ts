import { 
  PCExpression, 
  PCString, 
  PCFragment,
  PCSelfClosingElement, 
  PCStartTag,
  PCEndTag,
  PCAttribute,
  PCElement, 
  PCBlock,
  PCExpressionType,
  getPCStartTagAttribute,
  hasPCStartTagAttribute,
} from "./ast";
import { parse } from "./parser";

const transpileNode = (ast: PCExpression) => {
  if (ast.type === PCExpressionType.SELF_CLOSING_ELEMENT) {
    return transpileStartTag(ast as PCSelfClosingElement);
  } else if (ast.type === PCExpressionType.ELEMENT) {
    return transpileElement(ast as PCElement);
  } else if (ast.type === PCExpressionType.STRING) {
    return transpileText(ast as PCString);
  } else if (ast.type === PCExpressionType.BLOCK) {
    return transpileTextBlock(ast as PCString);
  }
};

const transpileText = (text: PCString) => !/^[\s\r\n\t]+$/.test(text.value) ? `buffer += '${text.value.replace(/'/g, "\\'").replace(/\n/g, "\\n")}';\n` : "";

const transpileElement = (element: PCElement) => {
  const tagName = element.startTag.name;
  if (tagName === "template") {
    return transpileTemplateElement(element);
  } else if (tagName === "repeat") {
    return transpileRepeatElement(element);
  } else {
    return transpileNativeElement(element);
  }
}

const transpileAttributeValue = (attribute: PCAttribute) => {
  if (attribute.value.type === PCExpressionType.STRING) {
    return `"${(attribute.value as PCString).value}"`;
  } else if (attribute.value.type === PCExpressionType.BLOCK) {
    return `"' + ${transpileAttrBlock(attribute.value as PCBlock)} + '"`;
  }
}

const transpileAttribute = (attribute: PCAttribute) => attribute.name + (attribute.value ? `=${transpileAttributeValue(attribute)}` : "");

const transpileAttrBlock = (block: PCBlock, wrapInCall?: boolean) => block.value;

const transpileTextBlock = (block: PCBlock) => `
  buffer += ${block.value};
`;

const transpileStartTag = (startTag: PCStartTag) => {
  let buffer = `buffer += '<${startTag.name}`;
  
  for (const attribute of startTag.attributes) {
    buffer += ` ${transpileAttribute(attribute)}`;
  }

  buffer += startTag.type === PCExpressionType.SELF_CLOSING_ELEMENT ? " />" : ">";

  buffer += "'; \n";
  return buffer;
}

const transpileNativeElement = (element: PCElement) => {
  let buffer = transpileStartTag(element.startTag);
  buffer += element.children.map(transpileNode).join("\n");
  buffer += `buffer += '</${element.startTag.name}>'\n`;
  return buffer;
};

const transpileTemplateElement = (element: PCElement) => {
  const name = getPCStartTagAttribute(element.startTag, "name");
  const shouldExport = hasPCStartTagAttribute(element.startTag, "export");

  if (!name) {

    // TODO
    // throw new Error();
  }

  let buffer = `function ${name}(context) {
    with (context) {
      var buffer = "";
      ${element.children.map(transpileNode).join("")}
      return buffer;
    }
  }\n`;

  if (shouldExport) {
    buffer = `exports[${name}] = ${buffer}`;
  }

  return buffer;
}

const transpileRepeatElement = (element: PCElement) => {
  const name = getPCStartTagAttribute(element.startTag, "name");
  const shouldExport = hasPCStartTagAttribute(element.startTag, "export");
  const fn = `function ${name}() {
    var buffer = "";
    ${element.children.map(transpileNode)}
    return buffer;
  }`;
}

const transpileModule = (ast: PCFragment) => {
  let buffer = ast.children.map(transpileNode).join("");
  return buffer;
};

export const transpilePaperclipToStringRenderer = (source: string) => {
  return transpileModule(parse(source));
};

