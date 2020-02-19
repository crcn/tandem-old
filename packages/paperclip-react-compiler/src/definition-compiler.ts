import {
  Node,
  getAttributeStringValue,
  getImportIds,
  Element,
  getNestedReferences,
  getParts
} from "paperclip";
import {
  createTranslateContext,
  TranslateContext,
  startBlock,
  endBlock,
  addBuffer
} from "./translate-utils";
import { Options, getComponentName, getPartClassName } from "./utils";

export const compile = (
  { ast }: { ast: Node },
  filePath: string,
  options: Options = {}
) => {
  let context = createTranslateContext(filePath, getImportIds(ast), options);
  context = translateRoot(ast, context);
  return context.buffer;
};

const translateRoot = (ast: Node, context: TranslateContext) => {
  context = addBuffer(
    `import {ReactNode, ReactHTML, Factory, InputHTMLAttributes, ClassAttributes} from "react";\n\n`,
    context
  );
  context = addBuffer(
    `type BaseProps = InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>;\n\n`,
    context
  );
  context = translateUtils(ast, context);
  context = translateParts(ast, context);
  context = translateMainTemplate(ast, context);
  return context;
};

const translateUtils = (_ast: Node, context: TranslateContext) => {
  context = addBuffer(
    `export declare const styled: (tag: keyof ReactHTML | Factory<BaseProps>, defaultProps?: BaseProps) => Factory<BaseProps>;\n\n`,
    context
  );
  return context;
};

const translateParts = (ast: Node, context: TranslateContext) => {
  const parts = getParts(ast);
  for (const part of parts) {
    context = translatePart(part, context);
  }
  return context;
};

const translatePart = (part: Element, context: TranslateContext) => {
  if (context.omitParts.indexOf(getAttributeStringValue("id", part)) !== -1) {
    return context;
  }
  const componentName = getPartClassName(part);
  context = translateComponent(part, componentName + "Props", context);
  context = addBuffer(
    `export declare const ${componentName}: Factory<${componentName}Props>;\n\n`,
    context
  );
  return context;
};

const BLACK_LIST_PROPS = {
  className: true
};

const RENAME_PROPS = {
  class: "className"
};

const translateComponent = (
  node: Node,
  componentPropsName: string,
  context: TranslateContext
) => {
  context = addBuffer(`export type ${componentPropsName} = {\n`, context);
  context = startBlock(context);
  let _defined = {};
  for (const [reference, attrName] of getNestedReferences(node)) {
    // just be relaxed for now about types
    let paramType: String = `String | boolean | Number | ReactNode`;

    if (attrName) {
      // onClick, onMouseMove, etc
      if (/^on\w+/.test(attrName)) {
        paramType = `Function`;
      }
    }

    const referenceName = reference.path[0];
    const propName = RENAME_PROPS[referenceName] || referenceName;
    if (BLACK_LIST_PROPS[propName] || _defined[propName]) {
      continue;
    }
    _defined[propName] = 1;
    context = addBuffer(`${propName}: ${paramType}, \n`, context);
  }

  context = endBlock(context);
  context = addBuffer(`} & BaseProps\n\n`, context);

  return context;
};

const translateMainTemplate = (ast: Node, context: TranslateContext) => {
  const componentName = getComponentName(ast);
  context = translateComponent(ast, "Props", context);
  context = addBuffer(
    `declare const ${componentName}: Factory<Props>;\n`,
    context
  );
  context = addBuffer(`export default ${componentName};\n`, context);
  return context;
};
