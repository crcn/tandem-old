
import * as vueLoader from "vue-loader";
import { VUE_MIME_TYPE } from "../constants";
import { JS_MIME_TYPE } from "@tandem/common";

export const createVueSandboxProviders = () => {
  return [
    // new BundlerLoaderFactoryProvider(VUE_MIME_TYPE, createWebpackBundleLoaderClass(vueLoader, JS_MIME_TYPE))
  ];
}