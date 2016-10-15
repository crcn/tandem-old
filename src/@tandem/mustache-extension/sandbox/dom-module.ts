import { BaseSandboxModule } from "@tandem/sandbox";
import {
  parseMarkup,
  MarkupModule,
  SyntheticWindow,
  MarkupExpression,
  SyntheticDocument,
  MarkupNodeExpression,
} from "@tandem/synthetic-browser";

export class MustacheSandboxModule extends MarkupModule {
  evaluateMarkup(ast: MarkupNodeExpression, window: SyntheticWindow, xmlns?: string) {
    return evaluateMustacheTemplate(ast, window.document, null, this);
  }
}

const _blockScripts = {};

function getBlockScript(script: string) {
  if (_blockScripts[script]) return _blockScripts[script];
  return _blockScripts[script] = new Function("context", `
    with(context) {
      try {
        return ${script.replace(/{{|}}/g, "")}
      } catch(e) {
        // eat it for mustache
      }
    }
  `);
}

function evaluateBlocks(value: string, context: any) {

  for (const block of (value.match(/{{.*?}}/g) || [])) {
    const run = getBlockScript(block);
    value = value.replace(block, run(context));
  }

  return value;
}

function evaluateMustacheTemplate(ast: MarkupExpression, document: SyntheticDocument, context?: any, module?: BaseSandboxModule) {

  if (!context) {
    context = document.defaultView;
  }

  const synthetic = ast.accept({
    visitAttribute(expression) {
      return { name: expression.name, value: evaluateBlocks(expression.value, context) };
    },
    visitElement(expression) {
      const node = document.createElement(expression.nodeName);
      for (const attribute of expression.attributes) {
        const { name, value } = evaluateMustacheTemplate(attribute, document, context, module);
        node.setAttribute(name, value);
      }
      for (const child of expression.childNodes) {
        node.appendChild(evaluateMustacheTemplate(child, document, context, module));
      }
      return node;
    },
    visitComment(expression) {
      return document.createComment(expression.nodeValue);
    },
    visitDocumentFragment(expression) {
      const node = document.createDocumentFragment();
      for (const child of expression.childNodes) {
        node.appendChild(evaluateMustacheTemplate(child, document, context, module));
      }
      return node;
    },
    visitText(expression) {
      return document.createTextNode(evaluateBlocks(expression.nodeValue, context));
    }
  });

  synthetic.$module     = module;
  synthetic.$expression = ast;

  return synthetic;
}