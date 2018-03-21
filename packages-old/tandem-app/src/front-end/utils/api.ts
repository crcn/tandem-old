import { Mutation } from "source-mutation";
import { ApplicationState } from "../state";
import { VMObjectExpressionSource } from "paperclip";

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

export const getComponentPreview = async (componentId: string, previewName: string, state: ApplicationState) => {
  const base = `${state.apiHost}/components/${componentId}/preview`;
  const response = await fetch((previewName ? base + "/" + previewName : base) + ".json");

  return await response.json();
};

export const getDocumentPreviewDiff = async (componentId: string, previewName: string, checksum: string, state: ApplicationState) => {
  let uri = `${state.apiHost}/components/${componentId}/preview`;
  uri += (previewName ? previewName + "/" : "/") + "diff/" + checksum + "/latest.json";
  const response = await fetch(uri);

  return await response.json();
};

export const apiOpenSourceFile = async (componentId: string, previewName: string, checksum: string, path: any[], state: ApplicationState) => { 
  const response = await fetch(`${state.textEditorHost}/open`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    } as any,
    body: JSON.stringify({
      componentId,
      previewName,
      checksum,
      vmObjectPath: path
    })
  });

  const res = await response.json();
  if (response.status !== 200) {
    throw res;
  }

  return res;
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
    }
  });

  return await response.json();
};

export const apiEditComponent = async (componentId: string, previewName: string, checksum: string, mutations: Mutation<any>[], state: ApplicationState) => {
  const response = await fetch(`${state.apiHost}/components/${componentId}`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      componentId,
      previewName,
      checksum,
      mutations
    })
  });

  return await response.json();
};