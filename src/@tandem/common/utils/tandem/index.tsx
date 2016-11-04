import * as React from "react";
import * as ReactDOM from "react-dom";

export const reactPreview = (render?: () => any) => {
  return function(ComponentClass: any): any {
    const renderPreview = () => {
      const element = document.createElement("div");
      ReactDOM.render(render ? render() : <ComponentClass />, element);
      return element;
    }
    if (ComponentClass) {
      ComponentClass.$$renderPreview = renderPreview;
    } else {
      return renderPreview();
    }
  }
}