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
    `import {ReactNode, InputHTMLAttributes, ClassAttributes} from "react";\n\n`,
    context
  );
  context = translateUtils(ast, context);
  context = translateParts(ast, context);
  context = translateMainTemplate(ast, context);
  return context;
};

const translateUtils = (ast: Node, context: TranslateContext) => {
  context = addBuffer(
    `export type styled = (tagName: string) => (props: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> | null) => ReactNode;\n\n`,
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
    `export type ${componentName} = (props: ${componentName}Props) => ReactNode;\n\n`,
    context
  );
  return context;
};

const translateComponent = (
  node: Node,
  componentPropsName: string,
  context: TranslateContext
) => {
  context = addBuffer(`export type ${componentPropsName} = {\n`, context);
  context = startBlock(context);
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

    context = addBuffer(`${referenceName}: ${paramType}, \n`, context);
  }

  context = endBlock(context);
  context = addBuffer(`};\n\n`, context);

  return context;
};

const translateMainTemplate = (ast: Node, context: TranslateContext) => {
  const componentName = getComponentName(ast);
  context = translateComponent(ast, "Props", context);
  context = addBuffer(
    `type ${componentName} = (props: Props) => ReactNode;\n`,
    context
  );
  context = addBuffer(`export default ${componentName};\n`, context);
  return context;
};
