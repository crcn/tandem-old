import { ApplicationState } from "../state";
import { ExpressionLocation } from "aerial-common2";

export const apiGetComponentPreviewURI = (componentId: string, state: ApplicationState) => { 

  // NOTE -- host is not defined here because it can be dynamic for local development.
  return `/components/${componentId}/preview`;
}

export const apiWatchUris = async (uris: string[], state: ApplicationState) => {
  const response = await fetch(`${state.apiHost}/watch`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    } as any,
    body: JSON.stringify(uris)
  });

  return await response.json();
}

export const apiOpenSourceFile = async (source: ExpressionLocation, state: ApplicationState) => { 
  const response = await fetch(`${state.apiHost}/open`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    } as any,
    body: JSON.stringify(source)
  });

  return await response.json();
}

export type CreateComponentResult = {
  $id: string
};

export const apiCreateComponent = async (name: string, state: ApplicationState): Promise<CreateComponentResult> => { 
  const response = await fetch(`${state.apiHost}/components`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    } as any,
    body: JSON.stringify({
      name
    })
  });

  return await response.json();
}

export const apiDeleteComponent = async (componentId: string, state: ApplicationState): Promise<CreateComponentResult> => { 
  const response = await fetch(`${state.apiHost}/components/${componentId}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    } as any
  });

  return await response.json();
}