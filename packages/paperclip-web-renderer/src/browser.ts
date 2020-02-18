import { Renderer } from "./renderer";

const thisScript = Array.from(document.querySelectorAll("script")).pop();

const renderer = new Renderer(
  String(thisScript.src)
    .split(":")
    .shift() + ":"
);

document.body.appendChild(renderer.mount);

const onMessage = ({ data: event }: MessageEvent) => {
  renderer.handleEngineEvent(JSON.parse(event));
};

window.onmessage = onMessage;
