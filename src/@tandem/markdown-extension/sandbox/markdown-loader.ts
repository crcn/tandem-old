import path =  require("path");
import sm = require("source-map");
import marked =  require("marked");

import {
  Dependency,
  IDependencyLoader,
  IDependencyContent,
  BaseDependencyLoader,
  DefaultDependencyLoader,
  IDependencyLoaderResult,
} from "@tandem/sandbox";

import {
  HTML_MIME_TYPE,
} from "@tandem/common";


export class MarkdownDependencyLoader extends BaseDependencyLoader {


  async load({ filePath, hash }, { type, content }): Promise<IDependencyLoaderResult> {
    return {
      content: `
        <style>
          html, body {
            font-family: Helvetica
          }
        </style>
        ${marked(String(content))}
      `,
      type: HTML_MIME_TYPE,
      importedDependencyPaths: []
    };
  }
}