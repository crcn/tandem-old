import { Component } from "paperclip";
import { upperFirst, camelCase } from "lodash";

export type ComponentTranspileInfo = {
  className: string;
  component: Component;
  propTypesName: string;
  enhancerName: string;
  enhancerTypeName: string;
};

export const getComponentTranspileInfo = (component: Component): ComponentTranspileInfo => {
  
    const className = upperFirst(camelCase(component.id));
  
    return {
      component,
      className,
      enhancerTypeName: `${className}Enhancer`,
      propTypesName: `${className}Props`,
      enhancerName: `enhance${className}`,
    };
  };
  