import {
  TextDocument,
  Diagnostic,
  FormattingOptions,
  Position,
  CompletionList,
  CompletionItem,
  SignatureHelp,
  DocumentHighlight,
  SymbolInformation,
  DocumentLink,
  Definition,
  Location,
  TextEdit,
  Hover,
  Range
} from 'vscode-languageserver-types';
import {
  Color, ColorInformation, ColorPresentation
} from 'vscode-languageserver-protocol/lib/protocol.colorProvider.proposed';

import { getLanguageModes, LanguageModes } from '../modes/languageModes';
import { NULL_HOVER, NULL_COMPLETION, NULL_SIGNATURE } from '../modes/nullMode';
import { format } from './formatting';
import { getPaperclipHTMLMode } from '../modes/template/index';

export interface DocumentContext {
  resolveReference(ref: string, base?: string): string;
}

export interface VLS {
  initialize(workspacePath: string | null | undefined, devToolsPort: number): void;
  configure(config: any): void;
  format(doc: TextDocument, range: Range, formattingOptions: FormattingOptions): TextEdit[];
  validate(doc: TextDocument): Promise<Diagnostic[]>;
  doComplete(doc: TextDocument, position: Position): CompletionList;
  doResolve(doc: TextDocument, languageId: string, item: CompletionItem): CompletionItem;
  doHover(doc: TextDocument, position: Position): Hover | Promise<Hover>;
  doSignatureHelp(doc: TextDocument, position: Position): SignatureHelp;
  findDocumentHighlight(doc: TextDocument, position: Position): DocumentHighlight[];
  findDocumentSymbols(doc: TextDocument): SymbolInformation[];
  findDocumentLinks(doc: TextDocument, documentContext: DocumentContext): DocumentLink[];
  findDefinition(doc: TextDocument, position: Position): Definition;
  findReferences(doc: TextDocument, position: Position): Location[];
  findDocumentColors(doc: TextDocument): ColorInformation[];
  getColorPresentations(doc: TextDocument, color: Color, range: Range): ColorPresentation[];
  removeDocument(doc: TextDocument): void;
  dispose(): void;
}

export function getVls(): VLS {
  let languageModes: LanguageModes;
  const validation: { [k: string]: boolean } = {
    paperclip: true,
    html: true,
    css: true,
    scss: true,
    less: true,
    postcss: true,
    javascript: true
  };

  return {
    initialize(workspacePath, devToolsPort) {
      languageModes = getLanguageModes(workspacePath, devToolsPort);
    },
    configure(config) {
      const pcValidationOptions = config.tandem.paperclip.validation;
      validation.css = pcValidationOptions.style;
      validation.javascript = pcValidationOptions.script;

      languageModes.getAllModes().forEach(m => {
        if (m.configure) {
          m.configure(config);
        }
      });
    },
    format(doc, range, formattingOptions) {
      return format(languageModes, doc, range, formattingOptions);
    },
    async validate(doc): Promise<Diagnostic[]> {
      const diagnostics: Diagnostic[] = [];
      if (doc.languageId === 'paperclip') {
        for (const mode of languageModes.getAllModesInDocument(doc)) {
          if (mode.doValidation && validation[mode.getId()]) {
            pushAll(diagnostics, await mode.doValidation(doc));
          }
        }
      }
      return Promise.resolve(diagnostics);
    },
    doComplete(doc, position) {
      const mode = languageModes.getModeAtPosition(doc, position);
      if (mode) {
        if (mode.doComplete) {
          return mode.doComplete(doc, position);
        }
      }
      return NULL_COMPLETION;
    },
    doResolve(doc, languageId, item) {
      const mode = languageModes.getMode(languageId);
      if (mode && mode.doResolve && doc) {
        return mode.doResolve(doc, item);
      }
      return item;
    },
    doHover(doc, position) {
      const mode = languageModes.getModeAtPosition(doc, position);
      if (mode && mode.doHover) {
        return mode.doHover(doc, position);
      }
      return NULL_HOVER;
    },
    findDocumentHighlight(doc, position) {
      const mode = languageModes.getModeAtPosition(doc, position);
      if (mode && mode.findDocumentHighlight) {
        return mode.findDocumentHighlight(doc, position);
      }
      return [];
    },
    findDefinition(doc, position) {
      const mode = languageModes.getModeAtPosition(doc, position);
      if (mode && mode.findDefinition) {
        return mode.findDefinition(doc, position);
      }
      return [];
    },
    findReferences(doc, position) {
      const mode = languageModes.getModeAtPosition(doc, position);
      if (mode && mode.findReferences) {
        return mode.findReferences(doc, position);
      }
      return [];
    },
    findDocumentLinks(doc, documentContext) {
      const links: DocumentLink[] = [];
      languageModes.getAllModesInDocument(doc).forEach(m => {
        if (m.findDocumentLinks) {
          pushAll(links, m.findDocumentLinks(doc, documentContext));
        }
      });
      return links;
    },
    findDocumentSymbols(doc) {
      const symbols: SymbolInformation[] = [];
      languageModes.getAllModesInDocument(doc).forEach(m => {
        if (m.findDocumentSymbols) {
          pushAll(symbols, m.findDocumentSymbols(doc));
        }
      });
      return symbols;
    },
    findDocumentColors(doc) {
      const colors: ColorInformation[] = [];
      languageModes.getAllModesInDocument(doc).forEach(m => {
        if (m.findDocumentColors) {
          pushAll(colors, m.findDocumentColors(doc));
        }
      });
      return colors;
    },
    getColorPresentations(doc, color, range) {
      const mode = languageModes.getModeAtPosition(doc, range.start);
      if (mode && mode.getColorPresentations) {
        return mode.getColorPresentations(doc, color, range);
      }
      return [];
    },
    doSignatureHelp(doc, position) {
      const mode = languageModes.getModeAtPosition(doc, position);
      if (mode && mode.doSignatureHelp) {
        return mode.doSignatureHelp(doc, position);
      }
      return NULL_SIGNATURE;
    },
    removeDocument(doc) {
      languageModes.onDocumentRemoved(doc);
    },
    dispose() {
      languageModes.dispose();
    }
  };
}

function pushAll<T>(to: T[], from: T[]) {
  if (from) {
    for (let i = 0; i < from.length; i++) {
      to.push(from[i]);
    }
  }
}
