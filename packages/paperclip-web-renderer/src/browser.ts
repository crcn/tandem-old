import { Renderer } from "./renderer";

declare var vscode;

const thisScript = Array.from(document.querySelectorAll("script")).pop();

const parent = typeof vscode != "undefined" ? vscode : window;

const renderer = new Renderer(
  String(thisScript.src)
    .split(":")
    .shift() + ":"
);

renderer.onMetaClick(element => {
  parent.postMessage(
    {
      type: "metaElementClicked",
      sourceUri: element.sourceUri,
      sourceLocation: element.sourceLocation
    },
    location.origin
  );
});

document.body.appendChild(renderer.mount);

const onMessage = ({ data: event }: MessageEvent) => {
  renderer.handleEngineEvent(JSON.parse(event));
};

window.onmessage = onMessage;
