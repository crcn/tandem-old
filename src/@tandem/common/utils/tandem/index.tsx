import * as React from "react";
import * as ReactDOM from "react-dom";

export const reactPreview = (render?: () => any) => {
  return function(ComponentClass: any): Promise<any> {
    const renderPreview = async () => {
      const element = document.createElement("div");
      ReactDOM.render(render ? await render() : <ComponentClass />, element);
      return element;
    }
    if (ComponentClass) {
      ComponentClass.$$renderPreview = renderPreview;
    } else {
      return renderPreview();
    }
  }
}