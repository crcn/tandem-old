import {
  Node,
  getAttributeStringValue,
  getImportIds,
  Element,
  getNestedReferences,
  getLogicElement,
  getParts,
  flattenNodes,
  isComponentInstance,
  NodeKind,
  getImports,
  getRelativeFilePath,
  isVisibleElement
} from "paperclip";
import { camelCase } from "lodash";
import {
  createTranslateContext,
  TranslateContext,
  startBlock,
  endBlock,
  addBuffer
} from "./translate-utils";
import {
  Options,
  getComponentName,
  getPartClassName,
  RENAME_PROPS,
  pascalCase
} from "./utils";

export const compile = (
  { ast }: { ast: Node },
  filePath: string,
  options: Options = {}
) => {
  let context = createTranslateContext(
    filePath,
    getImportIds(ast),
    [],
    Boolean(getLogicElement(ast)),
    options
  );
  context = translateRoot(ast, context);
  return context.buffer;
};

const translateRoot = (ast: Node, context: TranslateContext) => {
  context = addBuffer(
    `import {ReactNode, ReactHTML, Factory, InputHTMLAttributes, ClassAttributes} from "react";\n\n`,
    context
  );

  const allImports = getImports(ast);

  for (const imp of allImports) {
    const id = getAttributeStringValue("id", imp);
    const src = getAttributeStringValue("src", imp);
    if (!id || !src) {
      continue;
    }
    const relativePath = getRelativeFilePath(context.filePath, src);
    context = addBuffer(
      `import {$$Props as ${pascalCase(
        getInstancePropsName(imp)
      )}} from "${relativePath}";\n`,
      context
    );
  }

  context = addBuffer(`\n`, context);

  const logicElement = getLogicElement(ast);
  if (logicElement) {
    const src = getAttributeStringValue("src", logicElement);
    if (src) {
      const logicRelativePath = getRelativeFilePath(context.filePath, src);
      context = addBuffer(
        `import {Props as LogicProps} from "${logicRelativePath}";\n`,
        context
      );
    }
  }

  context = addBuffer(
    `type ElementProps = InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>;\n\n`,
    context
  );

  context = translateUtils(ast, context);
  context = translateMainView(ast, context);
  return context;
};

const translateUtils = (_ast: Node, context: TranslateContext) => {
  context = addBuffer(
    `export declare const styled: (tag: keyof ReactHTML | Factory<ElementProps>, defaultProps?: ElementProps) => Factory<ElementProps>;\n\n`,
    context
  );
  return context;
};

const BLACK_LIST_PROPS = {
  className: true,
  children: true
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

  const allElements = flattenNodes(node).filter(
    node => node.kind === NodeKind.Element && isVisibleElement(node)
  ) as Element[];

  for (const element of allElements) {
    if (isComponentInstance(element, context.importIds)) {
      context = addBuffer(
        `${getInstancePropsName(element)}: ${getInstancePropsTypeName(
          element
        )},\n`,
        context
      );
    } else {
      const id = getAttributeStringValue("id", element);
      if (id) {
        context = addBuffer(`${camelCase(id)}?: ElementProps,\n`, context);
      }
    }
  }

  context = endBlock(context);
  context = addBuffer(`} & ElementProps;\n\n`, context);

  return context;
};

const getInstancePropsName = (element: Element) => {
  return `${camelCase(
    getAttributeStringValue("id", element) || element.tagName
  )}Props`;
};

const getInstancePropsTypeName = (element: Element) => {
  return `${pascalCase(element.tagName)}Props`;
};

const translateMainView = (ast: Node, context: TranslateContext) => {
  const componentName = getComponentName(ast);
  context = translateComponent(ast, "Props", context);
  context = addBuffer(
    `declare const ${componentName}: Factory<Props>;\n`,
    context
  );
  if (context.hasLogicFile) {
    context = addBuffer(
      `declare const Enhanced${componentName}: Factory<LogicProps>;\n`,
      context
    );
    context = addBuffer(`export type $$Props = LogicProps;\n`, context);
    context = addBuffer(`export default Enhanced${componentName};\n`, context);
  } else {
    context = addBuffer(`export type $$Props = Props;\n`, context);
    context = addBuffer(`export default ${componentName};\n`, context);
  }
  return context;
};
