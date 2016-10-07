import { BaseRenderer } from "./base";
import { IActor, BoundingRect } from "@tandem/common";
import { SyntheticMarkupElement } from "@tandem/synthetic-browser";
import * as io from "socket.io-client";

export class TetherRenderer extends BaseRenderer {
  private _connection: SocketIOClient.Socket;
  private _canvas: HTMLCanvasElement;

  constructor() {
    super();
    this._connection = io(`${window.location.host}`);
    this._connection.on("tether:connect", this.onTetherConnected.bind(this));
    this._connection.on("tether:paint", this.paint.bind(this));
    this._connection.on("tether:rects", this.setRemoteRects.bind(this));
    this._canvas = document.createElement("canvas");
    this.element.appendChild(this._canvas);
    this._canvas.width = window.outerWidth;
    this._canvas.height = window.outerHeight;
  }

  update() {


    const rect = this.element.getBoundingClientRect();

    this._connection.emit("tether:render", {
      width: rect.width,
      height: rect.height,
      html: this.target.toString()
    });
  }

  private onTetherConnected() {
    this.update();
  }

  private setRemoteRects(rects: any) {
    const conv = {};
    for (const uid in rects) {
      const [left, top, right, bottom] = rects[uid];
      conv[uid] = new BoundingRect(left, top, right, bottom);
    }
    this.setRects(conv);
  }

  private paint({ data, left, top, width, height }) {
    const img = new Image();
    img.src = data;
    img.onload = () => {
      const ctx = this._canvas.getContext("2d");
      ctx.clearRect(left, top, width, height);
      ctx.drawImage(img, left, top);
    }
  }
}