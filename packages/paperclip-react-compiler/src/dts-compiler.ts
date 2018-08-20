import { PCModule, DependencyGraph, PCDependency, isComponent, PCComponent } from "paperclip";
import { TranslateContext, addScopedLayerLabel, addLine, getPublicComponentClassName } from "./utils";

export const translatePaperclipModuleToReactTSDefinition = (entry: PCDependency, graph: DependencyGraph) => {
  return translateModule(entry.content, {
    options: {},
    entry,
    buffer: "",
    graph,
    definedObjects: {},
    scopedLabelRefs: {},
    depth: 0,
    warnings: []
  }).buffer
}

const translateModule = (module: PCModule, context: TranslateContext) => {
  const components = module.children.filter(isComponent);
  for (const component of components) {
    context = translateComponent(component, context);
  }
  return context;
};

const translateComponent = (component: PCComponent, context: TranslateContext) => {
  context = addScopedLayerLabel(component.label, component.id, context);
  const componentClassName = getPublicComponentClassName(component, context);
  context = addLine(`export const ${componentClassName} = (props: any) => any;\n`, context);
  return context;
};

const translateComponentProps = (component: PCComponent, context: TranslateContext) => {

};