const path = require('path');
const fs   = require('fs');
const stripIndent = require('strip-indent');

module.exports = {
  projectFile: './index.tdm',

  fileHandlers: [
    {
      test: /tsx$/,
      dependencyGraph: {
        strategy: {
          name: "webpack"
        }
      },
      createPreview({ filePath }) {
        const basename = path.basename(filePath);

        const content = fs.readFileSync(filePath, 'utf8');
        const componentNameMatch = content.match(/(\w+) extends .*Component/);
        if (!componentNameMatch) {
          throw new Error(`Unable to find React component`);
        }

        const componentName = componentNameMatch[1];

        const sourceContent = stripIndent(`
          import * as React from "react";
          import * as ReactDOM from "react-dom";
          import { ${componentName} } from "./${basename.replace(".tsx", "")}";

          export const renderPreview = () => {
            const element = document.createElement("div");
            ReactDOM.render(<${componentName} />, element);
            return element;
          };
        `);

        return {
          filePath: filePath.replace(/\.tsx$/, "-preview.tsx"),
          content: sourceContent
        };
      }
    }
  ]
}

function template(strings, ...keys) {
  return function(context) {
    const result = [strings[0]];
    keys.forEach((key, i) => {
      result.push(context[keys[i]]);
      result.push(strings[i + 1]);
    });
    return result.join('');
  }
}