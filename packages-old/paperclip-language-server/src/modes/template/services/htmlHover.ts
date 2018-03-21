import { HTMLDocument } from '../parser/htmlParser';
import { parseModuleSource, PCExpressionType, PCStartTag, PCElement, PCSelfClosingElement, getPCStartTagAttribute } from "paperclip";
import * as path from "path";
import { getExpressionAtPosition, exprLocationToRange, getAncestors } from "../utils";
import { TokenType, createScanner } from '../parser/htmlScanner';
import { TextDocument, Range, Position, Hover, MarkedString } from 'vscode-languageserver-types';
import { IHTMLTagProvider } from '../tagProviders';
import { NULL_HOVER } from '../../nullMode';
import * as request from "request";
import * as fs from "fs";
import { TMP_DIRECTORY } from "../../../constants";

const TRIVIAL_TOKEN = [TokenType.StartTagOpen, TokenType.EndTagOpen, TokenType.Whitespace];

export function doHover(
  document: TextDocument,
  position: Position,
  tagProviders: IHTMLTagProvider[],
  config: any,
  devToolsPort
): Hover | Promise<Hover> {
  const offset = document.offsetAt(position);
  // console.log("DOCC");
  const { root, diagnostics } = parseModuleSource(document.getText());
  // console.log("PARSE MOD SOURCE" + JSON.stringify(root) + JSON.stringify(diagnostics, null, 2));
  const expr = root && getExpressionAtPosition(offset, root, (expr) => {
    return expr.type === PCExpressionType.SELF_CLOSING_ELEMENT || expr.type === PCExpressionType.ELEMENT;
  });

  if (!expr) {
    return NULL_HOVER;
  }
  function getTagHover(element: PCSelfClosingElement|PCElement, range: Range, open: boolean): Hover | Promise<Hover> {
    const startTag = element.type === PCExpressionType.SELF_CLOSING_ELEMENT ? (element as PCSelfClosingElement) : (element as PCElement).startTag;

    const { name: tagName } = startTag;
    const tagLower = tagName.toLowerCase();

    if (tagLower === "preview") {
      const ancestors = getAncestors(element, root);
      const component = ancestors[0];

      const id = getPCStartTagAttribute(component, "id");
      const previewName = getPCStartTagAttribute(element, "name") || component.childNodes.indexOf(element);

      if (!id) {
        return NULL_HOVER;
      }

      const hoverFilePath = path.join(TMP_DIRECTORY, `${id.replace(/\-/g, "")}.png`);

      return (async () => {

        // Hack. Must save files to local FS for some reason.
        try {
          await new Promise((resolve, reject) => {
            request({ url: `http://127.0.0.1:${devToolsPort}/components/${id}/screenshots/${previewName}/latest?maxWidth=300&maxHeight=240`, encoding: null }, (err, response, body) => {
              if (err) return reject();
              if (response.statusCode !== 200) {
                return reject(new Error("not found"));
              }
              fs.writeFileSync(hoverFilePath, body);
              resolve();
            })
          });
        } catch(e) {
          return {
            contents: `Preview could not be loaded. `,
            isTrusted: true
          };
        }

        return {

          // timestamp for cache buster
          contents: `![component preview](file://${hoverFilePath}?${Date.now()})`
        };
      })();

      
    }

    for (const provider of tagProviders) {
      let hover: Hover | null = null;
      provider.collectTags((t, label) => {

        if (t === tagLower) {
          const tagLabel = open ? '<' + tagLower + '>' : '</' + tagLower + '>';
          hover = { contents: [{ language: 'html', value: tagLabel }, MarkedString.fromPlainText(label)], range };
        }
      });
      if (hover) {
        return hover;
      }
    }
    return NULL_HOVER;
  }

  function getAttributeHover(tag: string, attribute: string, range: Range): Hover {
    tag = tag.toLowerCase();
    let hover: Hover = NULL_HOVER;
    for (const provider of tagProviders) {
      provider.collectAttributes(tag, (attr, type, documentation) => {
        if (attribute !== attr) {
          return;
        }
        const contents = [documentation ? MarkedString.fromPlainText(documentation) : `No doc for ${attr}`];
        hover = { contents, range };
      });
    }
    return hover;
  }

  const range = exprLocationToRange(expr.location);
  switch (expr.type) {
    case PCExpressionType.SELF_CLOSING_ELEMENT: return getTagHover((expr as PCSelfClosingElement), range, true);
    case PCExpressionType.ELEMENT: return getTagHover((expr as PCElement), range, true);
  }

  return NULL_HOVER;
}
