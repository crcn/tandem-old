import { PCElement, PCTextNode, PCSelfClosingElement, PCExpression, PCRootExpression, PCExpressionType, PCComment, PCStartTag } from "./ast";
import { Diagnostic, DiagnosticType, diagnosticsContainsError } from "./parser-utils";
import { loadModuleDependencyGraph, DependencyGraph, IO, Component, getAllComponents, getComponentPreview } from "./loader";
import { BaseNode, ParentNode, TextNode, Element, NodeType, pushChildNode } from "slim-dom";

type VMData = {

};

type VMContext = {
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
  io: Partial<IO>;
};

// TODO - may eventually want to have a compilation step for this
export const runPCFile = async ({ io, entry: { filePath, componentId, previewName } }: RunPCFileOptions): Promise<VMResult> => {
  
  const { graph, diagnostics } = await loadModuleDependencyGraph(filePath, io);

  if (diagnosticsContainsError(diagnostics)) {
    return {
      document: null,
      diagnostics
    }
  }

  const context: VMContext = {
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

  const preview = getComponentPreview(previewName, component);
  if (!preview) {
    return {
      document: null,
      diagnostics: [{ type: DiagnosticType.ERROR, message: `Preview "${previewName}" does not exist for component "${componentId}"`, filePath: null, location: null }]
    };
  }

  return {
    document: runPreview(preview, context),
    diagnostics: []
  }
};

const runPreview = (preview: PCElement, context: VMContext) => {
  let root = {
    type: NodeType.DOCUMENT_FRAGMENT,
    childNodes: [],
    source: preview
  };

  root = appendChildNodes(root, preview.childNodes, context);

  return root;
};

let appendElement = (parent: ParentNode, child: PCElement|PCSelfClosingElement, context: VMContext) => {
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

  if (startTag.name === "link") {
    return parent;
  }

  // TODO - check for repeat here

  return parent;
}

const appendNode = (parent: ParentNode, child: PCExpression, context: VMContext) => {
  switch(child.type) {
    case PCExpressionType.TEXT_NODE: return appendTextNode(parent, child as PCTextNode, context);
    case PCExpressionType.ELEMENT:
    case PCExpressionType.SELF_CLOSING_ELEMENT: return appendElement(parent, child as PCElement, context);
    default: return parent;
  }
};

const appendChildNodes = (parent: ParentNode, childNodes: PCExpression[], context: VMContext) => {
  for (let i = 0, {length} = childNodes; i < length; i++) {
    parent = appendNode(parent, childNodes[i], context);
  }
  return parent;
};

const appendTextNode = (parent: ParentNode, child: PCTextNode, context: VMContext) => {
  return pushChildNode(parent, {
    type: NodeType.TEXT,
    value: child.value,
    source: child
  } as TextNode);
}
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

