import { ApplicationState } from "../state";
export const getAPIProxyUrl = (uri: string, state: ApplicationState) => (
  `${window.location.protocol}//${state.apiHost}/proxy/${encodeURIComponent(uri)}`
);

export const apiGetComponentPreviewURI = (componentId: string, state: ApplicationState) => { 
  return `${window.location.protocol}//localhost:8082/preview/${componentId}`;
}