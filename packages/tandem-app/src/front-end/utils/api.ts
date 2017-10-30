import { ApplicationState } from "../state";
export const getAPIProxyUrl = (uri: string, state: ApplicationState) => (
  `${state.apiHost}/proxy/${encodeURIComponent(uri)}`
);

export const apiGetComponentPreviewURI = (componentId: string, state: ApplicationState) => { 
  return `${state.apiHost}/preview/${componentId}`;
}

export const apiWatchUris = async (uris: string[], state: ApplicationState) => {
  const response = await fetch(`${state.apiHost}/watch`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(uris)
  });

  return await response.json();
}