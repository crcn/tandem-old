import { Renderer } from "./renderer";

const renderer = new Renderer();
document.body.appendChild(renderer.mount);

const onMessage = ({ data: event }: MessageEvent) => {
  renderer.handleEngineEvent(event);
};

window.onmessage = onMessage;
