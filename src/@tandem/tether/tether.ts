import * as SocketIOClient from "socket.io-client";

import * as io from "socket.io-client";
import { Action } from "@tandem/common/actions";
import * as html2canvas from "html2canvas";

export function start(channel: string) {

  const connection = io(`${window.location.host}`);
  connection.emit("tether:connect");

  const targetElement = document.body;

  connection.on("tether:render", render);

  function render({ html, width, height }) {
    targetElement.innerHTML = html;
    paint();
    emitRects();
  }

  async function paint() {
    html2canvas(document.body).then((canvas) => {
      connection.compress(true).emit("tether:paint", {
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
        data: canvas.toDataURL()
      });
    })
  }

  function emitRects() {
    const rects = {};
    for (let element of targetElement.querySelectorAll("*")) {
      const rect = element.getBoundingClientRect();
      rects[element["dataset"].uid] = [rect.left, rect.top, rect.right, rect.bottom];
    }
    connection.emit("tether:rects", rects);
  }
}