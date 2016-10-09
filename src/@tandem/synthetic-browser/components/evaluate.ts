import { Dependencies } from "@tandem/common";
import { SyntheticDOMNode } from "../dom";
import { SyntheticDOMNodeComponentClassDependency } from "../dependencies";
import { ISyntheticComponent, DefaultSyntheticComponent } from "./base";

export async function evaluateSyntheticComponent(node: SyntheticDOMNode, component: ISyntheticComponent, dependencies: Dependencies): Promise<ISyntheticComponent> {

  let currentComponent: ISyntheticComponent;

  if (component && component.source.compare(node)) {

    currentComponent = component;

    // keep the same component, but change the source
    currentComponent.source = node;
  } else {
    const dependency = SyntheticDOMNodeComponentClassDependency.find(node, dependencies);
    currentComponent = dependency ? dependency.create(node) : new DefaultSyntheticComponent(node);
  }

  node.target = currentComponent;

  for (let i = 0, n = node.children.length; i < n; i++) {

    const childNode      = node.children[i];
    const childComponent = currentComponent.children[i];

    let newChildComponent = await evaluateSyntheticComponent(childNode, childComponent, dependencies);

    if (newChildComponent === childComponent) continue;

    if (childComponent) {
      currentComponent.replaceChild(newChildComponent, childComponent);
    } else {
      currentComponent.appendChild(newChildComponent);
    }
  }

  while (currentComponent.children.length > node.children.length) {
    currentComponent.removeChild(currentComponent.lastChild);
  }

  await currentComponent.evaluate();

  return currentComponent;
}