import * as SocketIOClient from "socket.io-client";

import { Action } from "@tandem/common/actions";
import { drawDocument } from "rasterizehtml";
import * as SocketIOBus from "mesh-socket-io-bus";
import { WrapBus } from "mesh";

export function start(channel: string) {

  const remoteBus = new SocketIOBus({
    channel: channel,
    connection:  SocketIOClient(`//${window.location.host}`)
  }, new WrapBus(onRemoteAction));

  function setHTML(content: string) {
    document.body.innerHTML = content;
  }

  function sendKeyFrame() {
    const canvas = document.createElement("canvas");
    drawDocument(document, canvas);
    document.body.appendChild(canvas);
    const dataUrl = canvas.toDataURL();
    console.log(dataUrl);
    remoteBus.execute(new Action("hello"));
  }

  function onRemoteAction(action: Action) {
    console.log("REMOTE ACTION");
  }

  setHTML("Hello World");

  sendKeyFrame();
}