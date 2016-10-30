import * as React from "react";
import * as ReactDOM from "react-dom";

export const reactPreview = (render?: () => any) => {
  return function(ComponentClass: any) {
    const renderPreview = () => {
      const element = document.createElement("div");
      ReactDOM.render(render ? render() : <ComponentClass />, element);
      return element;
    }
    Reflect.defineMetadata("tandem:renderPreview", ComponentClass, renderPreview);
  }
}