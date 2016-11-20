import "./index.scss";
import * as React from "react";
import { getRectDiagLine, getShortestLine, getRectCenterPoint, getOuterRectCenterPoints, getRectPoints, getRectCornerPoints } from "./box-intersections";
import { Workspace } from "@tandem/editor/browser/models";
import { MetadataKeys } from "@tandem/editor/browser/constants";
import { SyntheticHTMLElement } from "@tandem/synthetic-browser";
import { BoundingRect, Point, Line } from "@tandem/common";
import { BaseApplicationComponent } from "@tandem/common";


class SVGLineModel {
  constructor(readonly line: Line, readonly dashed?: boolean, readonly label?: string) {

  }
}


// const intersectsHorizontal(from: )

export class ElementMeasurementComponent extends React.Component<{ from: SyntheticHTMLElement, to: SyntheticHTMLElement, zoom: number }, any> {
  render() {
    const { from, to, zoom } = this.props;

    const fromBounds = from.getAbsoluteBounds();
    const toBounds   = to.getAbsoluteBounds();

    const lineModels = [];

    if (fromBounds.intersectsHorizontal(toBounds)) {

      const line = getShortestLine(getRectCornerPoints(fromBounds), getRectCornerPoints(toBounds));

      const rect = new BoundingRect(
        Math.min(line.from.left, line.to.left),
        Math.max(fromBounds.top, toBounds.top),
        Math.max(line.from.left, line.to.left),
        Math.min(fromBounds.bottom, toBounds.bottom)
      );

      const distLine = new Line(new Point(rect.left, rect.top + rect.height / 2), new Point(rect.right, rect.top + rect.height / 2));

      lineModels.push(
        new SVGLineModel(
          distLine,
          false,
          `${Math.round(distLine.length)}px`
        )
      );
    } else if (fromBounds.intersectsVertical(toBounds)) {
      const line = getShortestLine(getRectCornerPoints(fromBounds), getRectCornerPoints(toBounds));

      const rect = new BoundingRect(
        Math.max(fromBounds.left, toBounds.left),
        Math.min(line.from.top, line.to.top),
        Math.min(fromBounds.right, toBounds.right),
        Math.max(line.from.top, line.to.top)
      );

      const distLine = new Line(new Point(rect.left + rect.width / 2, rect.top), new Point(rect.left + rect.width / 2, rect.bottom));

      lineModels.push(
        new SVGLineModel(
          distLine,
          false,
          `${Math.round(distLine.length)}px`
        )
      );
    } else {


      const shortestLine = getShortestLine([getRectCenterPoint(fromBounds)], getRectCornerPoints(toBounds));

      const verticalDistanceLine   = new Line(new Point(shortestLine.from.left, shortestLine.to.top > shortestLine.from.top ? fromBounds.bottom : fromBounds.top), new Point(shortestLine.from.left, shortestLine.to.top));
      const horizontalDistanceLine = new Line(new Point(shortestLine.to.left > shortestLine.from.left ? fromBounds.right : fromBounds.left, shortestLine.from.top), new Point(shortestLine.to.left, shortestLine.from.top));


      lineModels.push(

        // vertical
        new SVGLineModel(
          verticalDistanceLine,
          false,
          `${Math.round(verticalDistanceLine.length)}px`
        ),

        // horizontal
        new SVGLineModel(
          horizontalDistanceLine,
          false,
          `${Math.round(horizontalDistanceLine.length)}px`
        ),

        // vertical
        new SVGLineModel(
          new Line(new Point(shortestLine.to.left, shortestLine.to.top), new Point(shortestLine.to.left, shortestLine.from.top)),
          true
        ),

        // horizontal
        new SVGLineModel(
          new Line(new Point(shortestLine.to.left, shortestLine.to.top), new Point(shortestLine.from.left, shortestLine.to.top)),
          true
        ),
      );
    }

    const strokeWidth = 2 / zoom;
    const canvasSize = 2000;
    const fontSize   = 10 / zoom;
    const padding    = 3 / zoom;
    const charWidth  = 5;
    const letterSpacing = 2 / zoom;


    const dashSize = 5 / zoom;
    return <div className="td-element-measurement">
      <svg width={canvasSize} height={canvasSize} style={{left:0, top:0, overflow: "visible"}}>
        {
          lineModels.map(({ line, dashed, label }, i) => {
            const rect = line.getBoundingRect();
            return <g key={i}>
              <path stroke="#F0F" strokeWidth={strokeWidth} d={`M ${line.from.left} ${line.from.top} L ${line.to.left} ${line.to.top}`}  strokeDasharray={dashed ? `${dashSize}, ${dashSize}` : ""} />
              { label ? <text style={{fill:"#F0F", letterSpacing: letterSpacing}} x={rect.left + (rect.width ? rect.width / 2 - (label.length * charWidth) / 2 : padding)} y={rect.top + (rect.height ? rect.height / 2 + fontSize/2 : padding + fontSize)} fontSize={fontSize} color="#F0F">{label}</text> : null }
            </g>
          })
        }
      </svg>
    </div>
  }
}

export class MeasurementStageToolComponent extends React.Component<{ workspace: Workspace }, { showMeasurements: boolean }> {

  state = {
    showMeasurements: process.env.SANDBOXED ? true : false
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 18) {
      this.setState({ showMeasurements: true });
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 18) {
      this.setState({ showMeasurements: false });
    }
  }

  render() {
    const { document, selection, documentQuerier, zoom, transform } = this.props.workspace;
    if (!this.state.showMeasurements || !document || !selection.length) return null;

    const selectedElements = selection.filter((selection: SyntheticHTMLElement) => {
      return !!selection.getAbsoluteBounds;
    }) as SyntheticHTMLElement[];

    const hoveredElements = documentQuerier.queriedElements.filter((element) => {
      return element.metadata.get(MetadataKeys.HOVERING);
    });

    const sections = [];

    for (const from of selectedElements) {
      for (const to of hoveredElements) {
        sections.push(<ElementMeasurementComponent key={from.uid + to.uid} from={from} to={to} zoom={zoom} />);
      }
    }

    return <div className="td-measurement-stage-tool">
      { sections }
    </div>
  }
}