import { expect } from "chai";
import { timeout } from "../utils";
import { openSyntheticEnvironmentWindow, SEnvWindowContext } from "../../environment";

export const openTestWindow = (htmlOrFiles: any = "", context: Partial<SEnvWindowContext> = {}) => {
  const files = typeof htmlOrFiles === "string" ? { "local://index.html": htmlOrFiles } : htmlOrFiles;
  
  const fetchFile = typeof files === "function" ? files : (info) => Promise.resolve(files[info]);

  return openSyntheticEnvironmentWindow("local://index.html", {
    fetch(info: string) {
      return Promise.resolve({
        text() {
          return fetchFile(info);
        }
      } as any);
    },
    ...(context as any)
  });
}

export const waitForDocumentComplete = (window: Window) => new Promise((resolve) => {
  window.document.onreadystatechange = () => {
    if (window.document.readyState === "complete") {
      resolve();
    }
  }
});

export const wrapHTML = (content = "") => `<html><head></head><body>${content}</body></html>`;

export * from "../utils";