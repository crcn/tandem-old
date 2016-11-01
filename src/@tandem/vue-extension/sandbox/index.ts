
import * as vueLoader from "vue-loader";
import { VUE_MIME_TYPE } from "../constants";
import { JS_MIME_TYPE } from "@tandem/common";

export const createVueSandboxProviders = () => {
  return [
    // new DependencyLoaderFactoryProvider(VUE_MIME_TYPE, createWebpackDependencyLoaderClass(vueLoader, JS_MIME_TYPE))
  ];
}