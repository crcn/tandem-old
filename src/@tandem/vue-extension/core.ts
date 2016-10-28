import { MimeTypeDependency } from "@tandem/common";
import { VUE_MIME_TYPE } from "./constants";

export const createCoreVueDependencies = () => {
  return [
    new MimeTypeDependency("vue", VUE_MIME_TYPE)
  ];
}