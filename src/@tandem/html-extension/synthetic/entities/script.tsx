import {
  SyntheticDOMElement,
  BaseDOMNodeEntity
} from "@tandem/synthetic-browser";

export class HTMLScriptEntity extends BaseDOMNodeEntity<SyntheticDOMElement, HTMLElement> {
  private _fn: Function;
  async evaluate() {

    const src    = this.source.getAttribute("src");
    const window = this.sourceWindow;
    const importer = window.sandbox.importer;
    let scriptContent = "";

    if (src) {
      const filePath = await importer.resolve(src, this.module.fileName);
      const content = await importer.readFile(filePath);
      await importer.watchFile(filePath);
    } else {
      scriptContent = this.source.textContent;
    }

    const context = window;

    // dirty fetch of variable declarations. Need to define these on the context
    // so that the with statement works properly
    for (const variableDeclaration of (scriptContent.match(/(var|const)\s*\w+/g) || [])) {
      const variableName = variableDeclaration.match(/(var|const)\s*(\w+)/)[2];
      if (context[variableName] == null) context[variableName] = null;
    }

    const run = new Function("context", `
      with(context) {
        ${scriptContent}
      }
    `);

    run(context);
  }
}