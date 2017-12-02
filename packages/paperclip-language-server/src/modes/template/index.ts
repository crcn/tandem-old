import { LanguageModelCache, getLanguageModelCache } from '../languageModelCache';
import { DocumentContext } from '../../service';
import { TextDocument, Position, FormattingOptions } from 'vscode-languageserver-types';
import { LanguageMode } from '../languageModes';
import { PaperclipDocumentRegions } from '../embeddedSupport';

import { loadModuleDependencyGraph, loadModuleAST, parseModuleSource, DiagnosticType } from "paperclip";
import { HTMLDocument } from './parser/htmlParser';
import { doComplete } from './services/htmlCompletion';
import { doHover } from './services/htmlHover';
import { findDocumentHighlights } from './services/htmlHighlighting';
import { findDocumentLinks } from './services/htmlLinks';
import { findDocumentSymbols } from './services/htmlSymbolsProvider';
import { htmlFormat } from './services/htmlFormat';
import { parseHTMLDocument } from './parser/htmlParser';
import { doValidation } from './services/htmlValidation';
import { findDefinition } from './services/htmlDefinition';
import { getTagProviderSettings } from './tagProviders';
import { ScriptMode } from '../script/javascript';
import { getComponentTags, getEnabledTagProviders } from './tagProviders';

import * as _ from 'lodash';
import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';
import { DiagnosticCategory } from 'typescript';

type DocumentRegionCache = LanguageModelCache<PaperclipDocumentRegions>;

export function getPaperclipHTMLMode(
  documentRegions: DocumentRegionCache,
  workspacePath: string | null | undefined,
  devToolsPort: number
): LanguageMode {
  let tagProviderSettings = getTagProviderSettings(workspacePath);
  let enabledTagProviders = getEnabledTagProviders(tagProviderSettings);
  const embeddedDocuments = getLanguageModelCache<TextDocument>(10, 60, document =>
    documentRegions.get(document).getEmbeddedDocument('paperclip')
  );
  const pcDocuments = getLanguageModelCache<HTMLDocument>(10, 60, document => parseHTMLDocument(document));
  // const lintEngine = createLintEngine();
  let config: any = {};

  return {
    getId() {
      return 'paperclip';
    },
    configure(c) {
      tagProviderSettings = _.assign(tagProviderSettings, c.html.suggest);
      enabledTagProviders = getEnabledTagProviders(tagProviderSettings);
      config = c;
    },
    doValidation(document) {
      const embedded = embeddedDocuments.get(document);

      // Fetch errors
      const { diagnostics } = parseModuleSource(document.getText());

      // TODO  - add warnings about components

      return diagnostics.map(diag => ({
        range: {
          start: {
            line: diag.location.start.line - 1,
            character: diag.location.start.column
          },
          end: {
            line: diag.location.start.line - 1,
            character: diag.location.start.column,
          }
        },
        severity: {
          [DiagnosticType.ERROR]: DiagnosticSeverity.Error,
          [DiagnosticType.WARNING]: DiagnosticSeverity.Warning,
        }[diag.type],
        message: diag.message
      }) as Diagnostic);
    },
    doComplete(document: TextDocument, position: Position) {
      const embedded = embeddedDocuments.get(document);
      // const components = scriptMode.findComponents(document);
      const tagProviders = enabledTagProviders; //.concat(getComponentTags(components));
      return doComplete(embedded, position, pcDocuments.get(embedded), tagProviders);
    },
    doHover(document: TextDocument, position: Position) {

      // const components = scriptMode.findComponents(document);
      const tagProviders = enabledTagProviders; //.concat(getComponentTags(components));
      return doHover(document, position, tagProviders, config, devToolsPort);
    },
    findDocumentHighlight(document: TextDocument, position: Position) {
      return findDocumentHighlights(document, position, pcDocuments.get(document));
    },
    findDocumentLinks(document: TextDocument, documentContext: DocumentContext) {
      return findDocumentLinks(document, documentContext);
    },
    findDocumentSymbols(document: TextDocument) {
      return findDocumentSymbols(document, pcDocuments.get(document));
    },
    format(document: TextDocument, range: Range, formattingOptions: FormattingOptions) {
      if (config.paperclip.format.defaultFormatter.html === 'none') {
        return [];
      }
      return htmlFormat(document, range, formattingOptions, config);
    },
    findDefinition(document: TextDocument, position: Position) {
      const embedded = embeddedDocuments.get(document);
      // const components = scriptMode.findComponents(document);
      return findDefinition(embedded, position, pcDocuments.get(embedded), []);
    },
    onDocumentRemoved(document: TextDocument) {
      pcDocuments.onDocumentRemoved(document);
    },
    dispose() {
      pcDocuments.dispose();
    }
  };
}
