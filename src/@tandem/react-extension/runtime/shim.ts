import {
  EnvironmentKind,
  SyntheticObject,
  NativeFunction,
  ModuleShimFactoryDependency,
} from "@tandem/runtime";

async function createReactShim() {
  return new SyntheticObject({
    "createClass": new NativeFunction(function(proto) {
      return proto;
    }),
    "Component": new NativeFunction(function() { })
  });
}

export const reactModuleShimFactoryDependency = new ModuleShimFactoryDependency(EnvironmentKind.JavaScript, "react", createReactShim);