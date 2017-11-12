const ts = require("typescript");
const { weakMemo } = require("aerial-common2");
const { transpileJSSource } = require("../tandem-paperclip-dev-tools/index");

const transpileTypescript = weakMemo((source, uri) => {
  const output = ts.transpileModule(source, {}).outputText;
  return transpileJSSource(output);
});

module.exports = {
  port: Number(process.env.PORT || 8080),
  vscode: {
    tandemcodeDirectory: __dirname,
    devServerScript: ["node", "../tandem-paperclip-dev-tools"] 
  },

  paperclip: {
    entry: __dirname + "./src/index.ts",
    componentsDirectory: __dirname + "/src/front-end/components",
    transpilers: {
      "text/typescript": transpileTypescript,
      "ts": transpileTypescript
    },
    moduleDirectories: ["node_modules"],
    extensions: ["", ".js", ".ts", ".pc", "/index.ts", "/index.js"]
  },

  // TODO - possible
  editSourceContent: require("./lib/webpack/edit-pc-content"),
  sourceFilePattern: __dirname + "/src/**/*-preview.tsx",
  webpackConfigPath: __dirname + "/webpack-dev.config.js",
  getEntryIndexHTML: ({ entryName, filePath }) => `
    <html>
      <head>
        <title>${filePath}</title>
        <link rel="stylesheet" href="/${entryName}.bundle.css">
      </head>
      <body>
        <div id="mount"></div>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom.js"></script>
        <script>
          if (entry) {
            ReactDOM.render(
              React.createElement(entry.default || entry.Preview),
              document.getElementById("mount")
            );
          } else {
            document.body.appendChild(
              document.createTextNode("Could not load preview")
            )
          }
        </script>
      </body>
    </html>
  `
};