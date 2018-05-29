import "./document.scss";
import * as React from "react";
import { compose, pure, lifecycle } from "recompose";
import { SyntheticFrame, Dependency, DependencyGraph } from "paperclip";

export type DocumentPreviewOuterProps = {
  frame: SyntheticFrame;
  dependency: Dependency<any>;
};

type DocumentPreviewInnerProps = {} & DocumentPreviewOuterProps;

const BaseDocumentPreviewComponent = ({ frame }) => {
  const bounds = frame.bounds;
  if (!bounds) {
    return null;
  }
  const style = {
    position: "absolute",
    left: bounds.left,
    top: bounds.top,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
    background: "white"
  } as any;

  return (
    <div className="m-preview-document" style={style}>
      <div ref="container" />
    </div>
  );
};

const enhance = compose<DocumentPreviewOuterProps, DocumentPreviewOuterProps>(
  pure,
  lifecycle({
    componentDidUpdate({ frame: oldFrame }: DocumentPreviewOuterProps) {
      const props: DocumentPreviewOuterProps = this.props;
      if (!oldFrame || oldFrame.$container !== props.frame.$container) {
        const container = this.refs.container as HTMLElement;
        while (container.childNodes.length) {
          container.removeChild(container.childNodes[0]);
        }
        if (props.frame.$container) {
          container.appendChild(props.frame.$container);
        }
      }
    },
    componentDidMount() {
      const container = this.refs.container as HTMLElement;
      if (container && this.props.frame.$container) {
        container.appendChild(
          (this.props as DocumentPreviewOuterProps).frame.$container
        );
      }
    }
  })
);

export const DocumentPreviewComponent = enhance(BaseDocumentPreviewComponent);
