import { HTMLDocument } from '../parser/htmlParser';
import { parseModuleSource, PCExpressionType, PCStartTag, PCElement, PCSelfClosingElement, getPCStartTagAttribute } from "paperclip";
import * as path from "path";
import { getExpressionAtPosition, exprLocationToRange } from "../utils";
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
  const { root } = parseModuleSource(document.getText());
  const expr = root && getExpressionAtPosition(offset, root, (expr) => {
    return expr.type === PCExpressionType.SELF_CLOSING_ELEMENT || expr.type === PCExpressionType.ELEMENT;
  });

  if (!expr) {
    return NULL_HOVER;
  }
  function getTagHover(startTag: PCStartTag, range: Range, open: boolean): Hover | Promise<Hover> {
    const { name: tagName } = startTag;
    const tagLower = tagName.toLowerCase();

    if (tagLower === "component") {

      const id = getPCStartTagAttribute(startTag, "id");

      if (!id) {
        return NULL_HOVER;
      }

      const hoverFilePath = path.join(TMP_DIRECTORY, `${id.replace(/\-/g, "")}.png`);

      console.log(hoverFilePath);

      return (async () => {

        // Hack. Must save files to local FS for some reason.
        try {
          await new Promise((resolve, reject) => {
            request({ url: `http://127.0.0.1:${devToolsPort}/components/${id}/screenshots/latest.png?maxWidth=300&maxHeight=200`, encoding: null }, (err, response, body) => {
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

  const range = exprLocationToRange(expr.location)
  switch (expr.type) {
    case PCExpressionType.SELF_CLOSING_ELEMENT: return getTagHover((expr as PCSelfClosingElement), range, true);
    case PCExpressionType.ELEMENT: return getTagHover((expr as PCElement).startTag, range, true);

    // case TokenType.EndTag:
    //   return getTagHover(node.tag, tagRange, false);
    // case TokenType.AttributeName:
    //   // TODO: treat : as special bind
    //   const attribute = scanner.getTokenText().replace(/^:/, '');
    //   return getAttributeHover(node.tag, attribute, tagRange);
  }

  return NULL_HOVER;
}
