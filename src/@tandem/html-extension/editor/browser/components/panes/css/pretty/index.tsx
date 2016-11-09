import "./index.scss";
import * as React from "react";
import { SyntheticCSSStyleDeclaration } from "@tandem/synthetic-browser";

// TODO - background image editor - needs to have alignment tools. Also support drag & drop images, blend mode
export class CSSPrettyPaneComponent extends React.Component<{ style: SyntheticCSSStyleDeclaration }, any> {
  render() {
    return <div className="td-pretty-pane">

      <div className="td-container">
        <div className="row">
            <label>X</label>
            <input type="text" className="col-10" />
            <label>Y</label>
            <input type="text" className="col-10" />
        </div>
        <div className="row">
            <label>W</label>
            <input type="text" className="col-10" />
            <label>H</label>
            <input type="text" className="col-10" />
        </div>
      </div>

      <hr />

      <div className="td-container">
        <div className="td-section-subheader dim">Typography</div>
        <div className="row">
            <label>&nbsp;</label>
            <div className="col-3 select">
              Roboto <a href="#" className="button"><i className="ion-arrow-down-b"></i></a>
            </div>
            <label>&nbsp;</label>
            <div className="col-3 select">
              Medium <a href="#" className="button"><i className="ion-arrow-down-b"></i></a>
            </div>
        </div>
        <div className="row">
          <label>H</label>
          <input type="text" className="col-10" value="0.05em" />
          <label>V</label>
          <input type="text" className="col-10" value="12px" />
        </div>
        <div className="row">
          <label>H</label>
          <input type="text" className="col-10" value="0.9em" />
          <label>V</label>
          <input type="text" className="col-10" />
        </div>
      </div>

      <hr />

      <div className="td-container">
        <div className="td-section-subheader dim">
          Background
          <div className="pull-right">
            +
          </div>
        </div>
        <div className="row">
          <button href="#" className="css-background-preview" style={{background: "#F00"}} />
          <input className="col-3" type="text" value="Normal"></input>
        </div>
        <div className="row">
          <button href="#" className="css-background-preview" style={{background: "#0F0"}} />
          <input className="col-3" type="text" value="Multiply"></input>
        </div>
        <div className="row">
          <button href="#" className="css-background-preview" style={{background: "#00F"}} />
          <input className="col-3" type="text" value="Darken"></input>
        </div>
      </div>

      <hr />

      <div className="td-container">
        <div className="td-section-subheader dim">
          Shadows
          <div className="pull-right">
            +
          </div>
        </div>
        <div className="row">
          <button href="#" className="css-background-preview" style={{background: "#F00"}} />
          <input className="col-3" type="text" value="Normal"></input>
        </div>
      </div>

      <hr />

      <div className="td-container">
        <div className="td-section-subheader dim">
          Filters
          <div className="pull-right">
            +
          </div>
        </div>

        <div className="row">
          <label className="col-2">Blur</label>
        </div>

        <div className="row">
          <div className="slider">
            <a href="#" style={{left:"10%"}}>&nbsp;</a>
          </div>
        </div>

        <div className="row">
          <label className="col-2">Opacity</label>
        </div>

        <div className="row">
          <div className="slider">
            <a href="#" style={{left:"90%"}}>&nbsp;</a>
          </div>
        </div>

        <div className="row">
          <label className="col-2">Saturate</label>
        </div>

        <div className="row">
          <div className="slider">
            <a href="#" style={{left:"30%"}}>&nbsp;</a>
          </div>
        </div>
      </div>
    </div>
  }
}