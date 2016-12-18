import { expect } from "chai";
import { createTestMasterApplication } from "@tandem/editor/test";
import { SyntheticBrowser } from "@tandem/synthetic-browser";

describe(__filename + "#", () => {

  const evaluateHTML = async (mockFiles: any) => {
    const app = createTestMasterApplication({
      sandboxOptions: {
        mockFiles: mockFiles
      }
    });

    const browser = new SyntheticBrowser(app.injector);
    await browser.open({
      uri: "index.html"
    });

    return browser.document;
  };

  const stripNewLines = (content: string) => {
      return content.replace(/[\n\r]+/g, "").replace(/\s+/g, " ");
  };
  
  it(`Can evaluate a simple hello world html element`, async () => {
    const document = await evaluateHTML({
      "index.html": `
        <div>
          hello world
        </div>
      `
    });
    expect(stripNewLines(document.body.innerHTML)).to.contain(`<div> hello world </div>`);
  });

  // TODO - order of script tags

  it(`Can evaluate a script tag`, async () => {
    const document = await evaluateHTML({
      "index.html": `
        <html>
          <head>
          </head>
          <body>
            <script>
              document.body.appendChild(document.createTextNode("Hello World"));
            </script>
          </body>
        </html>
      `
    });

    expect(stripNewLines(document.body.textContent)).to.contain(`document.body.appendChild(document.createTextNode("Hello World")); Hello World`);
  });

  it(`Can evaluate a script src tag`, async () => {
    const document = await evaluateHTML({
      "index.html": `
        <html>
          <head>
          </head>
          <body>
            <script type="text/javascript" src="./index.js"></script>
            <script src="./index.js"></script>
          </body>
        </html>
      `,
      "index.js": `
        document.body.appendChild(document.createTextNode("Hello World"));
      `
    });
    

    expect(stripNewLines(document.body.textContent)).to.contain(`Hello WorldHello World`);
  });

  it(`script can reference itself when executed`, async () => {
    const document = await evaluateHTML({
      "index.html": `
        <html>
          <head>
          </head>
          <body>
            <script>
              const scripts = document.getElementsByTagName("script");
              document.body.appendChild(document.createTextNode(scripts[scripts.length - 1].textContent.length));
            </script>
          </body>
        </html>
      `
    });

    expect(stripNewLines(document.body.textContent)).to.contain(`const scripts = document.getElementsByTagName("script"); document.body.appendChild(document.createTextNode(scripts[scripts.length - 1].textContent.length)); 198`);
  });

  it(`Executes scripts immediately after being appended to the document`, async () => {
    const document = await evaluateHTML({
      "index.html": `
        <html>
          <head>
          </head>
          <body>
            <script>
              document.body.appendChild(document.createTextNode("a"));
            </script>
            <script>
              document.body.appendChild(document.createTextNode("b"));
            </script>
          </body>
        </html>
      `,
      "index.js": `
        document.body.appendChild(document.createTextNode("Hello World"));
      `
    });

    expect(stripNewLines(document.body.textContent)).to.contain(`document.body.appendChild(document.createTextNode("a")); a document.body.appendChild(document.createTextNode("b")); b`);
  });
  

  it(`can evaluate a simple link`, async () => {
    const document = await evaluateHTML({
      "index.html": `<html>
        <head>
          <link rel="stylesheet" href="test.css">
        </head>
        <body>
        </body>
      </html>
      `,
      "test.css": `
        body {
          color: red;
        }
      `
    });

    
  });
});
