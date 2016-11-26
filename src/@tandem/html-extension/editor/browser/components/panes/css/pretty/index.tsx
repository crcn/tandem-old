import "./index.scss";
import * as React from "react";
import { SyntheticCSSStyle } from "@tandem/synthetic-browser";


// TODO - background image editor - needs to have alignment tools. Also support drag & drop images, blend mode
export class CSSPrettyPaneComponent extends React.Component<{ style: SyntheticCSSStyle }, any> {
  render() {
    return <div className="td-pretty-pane">

      <div className="td-container">
        <div className="row">
            <label className="col">X</label>
            <input type="text" className="col-10" />
            <label className="col">Y</label>
            <input type="text" className="col-10" />
        </div>
        <div className="row">
            <label className="col">W</label>
            <input type="text" className="col-10" />
            <label className="col">H</label>
            <input type="text" className="col-10" />
        </div>
      </div>

      <hr />

      <div className="td-container">
        <div className="td-section-subheader dim">Typography</div>
        <div className="row">
            <label className="col">&nbsp;</label>
            <div className="col-10 select">
              Roboto <a href="#" className="button"><i className="ion-arrow-down-b"></i></a>
            </div>
            <label className="col">&nbsp;</label>
            <div className="col-10 select">
              Medium <a href="#" className="button"><i className="ion-arrow-down-b"></i></a>
            </div>
        </div>
        <div className="row">
          <label className="col"><i className="glyphicon glyphicon-text-size" /></label>
          <input type="text" className="col-10" value="0.05em" />
          <label className="col">V</label>
          <input type="text" className="col-10" value="12px" />
        </div>
        <div className="row">
          <label className="col"><i className="glyphicon glyphicon-text-width" /></label>
          <input type="text" className="col-10" value="0.9em" />
          <label className="col"><i className="glyphicon glyphicon-text-height" /></label>
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
          <button href="#" className="col css-background-preview" style={{background: "#F00"}} />
          <input className="col-10" type="text" value="Normal"></input>
        </div>
        <div className="row">
          <button href="#" className="col css-background-preview" style={{background: "#0F0"}} />
          <input className="col-10" type="text" value="Multiply"></input>
        </div>
        <div className="row">
          <button href="#" className="col css-background-preview" style={{background: "#00F"}} />
          <input className="col-10" type="text" value="Darken"></input>
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
          <input className="col-10" type="text" value="Normal"></input>
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