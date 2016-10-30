import { MimeTypeProvider } from "@tandem/common";
import { VUE_MIME_TYPE } from "./constants";

export const createCoreVueDependencies = () => {
  return [
    new MimeTypeProvider("vue", VUE_MIME_TYPE)
  ];
}