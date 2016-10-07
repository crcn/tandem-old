import * as io from "socket.io-client";
import * as html2canvas from "html2canvas";

export function start(channel: string) {

  const connection = io(`${window.location.host}`);
  connection.emit("tether:connect");

  const targetElement = document.body;

  connection.on("tether:render", render);

  function render({ html, width, height }) {
    targetElement.innerHTML = html;
    renderCanvas();
    emitRects();
  }

  let previousCanvas: HTMLCanvasElement;

  function renderCanvas() {
    html2canvas(document.body).then((canvas) => {
      if (previousCanvas && false) {
        paintChanges(previousCanvas, canvas);
      } else {
        clear();
        paint(canvas, 0, 0);
      }

      previousCanvas = canvas;
    })
  }

  function clear() {
    connection.emit("tether:clear");
  }

  function paintChanges(oldCanvas: HTMLCanvasElement, newCanvas: HTMLCanvasElement) {
    const oldCtx  = oldCanvas.getContext("2d");
    const newCtx  = newCanvas.getContext("2d");
    const oldData = oldCtx.getImageData(0, 0, oldCanvas.width, oldCanvas.height).data;
    const newData = oldCtx.getImageData(0, 0, newCanvas.width, newCanvas.height).data;

    console.log(oldData.length, oldCanvas.width, oldCanvas.height);

  }

  function paint(canvas: HTMLCanvasElement, left: number, top: number) {
    connection.compress(true).emit("tether:paint", {
      left: left,
      top: top,
      width: canvas.width,
      height: canvas.height,
      dataUrl: canvas.toDataURL()
    });
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