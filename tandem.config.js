module.exports = {
  fileHandlers: [
    {
      test: /tsx$/,
      preview: {
        template: template`
          import * as React from "react";
          import * as ReactDOM from "react-dom";
          import * as Component from "${"relativePath"}";

          export const renderPreview = () => {
            const element = document.createElement("div");
            ReactDOM.render(<Component />, element);
          }
        `
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