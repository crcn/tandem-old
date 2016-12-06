import React =  require("React");
import { DraggableComponent } from "../draggable";
import { throttle, Cancelable } from "lodash";

const MAX_DECIMALS = 2;

export class NumberSliderInput extends React.Component<{ value: number, onChange: (value) => any}, any> {

  private _prevCursor: string;
  private _startValue: number;
  private _multiplier: number;
  private _startMouseLeft: number;

  onStartDrag = (event: React.MouseEvent<any>) => {
    this._startMouseLeft = event.clientX;
    this._startValue = this.props.value;
    const sv = String(this._startValue);
    this._multiplier = sv.indexOf(".") === -1 ? 1 : 1/Math.pow(10, Math.min(MAX_DECIMALS, sv.split(".").length));
    this._prevCursor = document.body.style.cursor;
    document.body.style.cursor = "col-resize";
  }

  onDrag = throttle((event: MouseEvent) => {
    const delta = event.clientX - this._startMouseLeft;
    this.props.onChange(Number(Number(this._startValue + delta * this._multiplier).toFixed(MAX_DECIMALS)));
  }, 100)

  onStopDrag = () => {
    document.body.style.cursor = this._prevCursor;
  }

  render() {
    return <DraggableComponent style={{ cursor: "col-resize" }} tabIndex={-1} onDrag={this.onDrag} onStartDrag={this.onStartDrag} onStopDrag={this.onStopDrag}>
      { this.props.children || this.props.value }
    </DraggableComponent>
  }
}