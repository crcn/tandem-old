import "./document.scss";
import * as React from "react";
import { compose, pure, lifecycle } from "recompose";
import { FrameMode } from "../../../../../../../../state";
import {
  Frame,
  Dependency,
  DependencyGraph,
  SyntheticVisibleNode,
  getFrameByContentNodeId
} from "paperclip";
import { stripProtocol } from "tandem-common";

export type DocumentPreviewOuterProps = {
  frame: Frame;
  dependency: Dependency<any>;
  contentNode: SyntheticVisibleNode;
};

type DesignPreviewOuterProps = {
  frame: Frame;
  dependency: Dependency<any>;
};

const BaseDesignPreview = ({ frame }: DesignPreviewOuterProps) => {
  return <div ref="container" />;
};

const DesignPreview = compose<DesignPreviewOuterProps, DesignPreviewOuterProps>(
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
)(BaseDesignPreview);

type LivePreviewOuterProps = {
  livePreviewUrl: string;
  dependencyUri: string;
  contentNodeSourceId: string;
};

const LivePreview = ({
  livePreviewUrl,
  dependencyUri,
  contentNodeSourceId
}: LivePreviewOuterProps) => {
  const location =
    livePreviewUrl +
    "?entryPath=" +
    stripProtocol(dependencyUri) +
    "&componentId=" +
    contentNodeSourceId;
  console.log(location);
  return <iframe src={location} />;
};

export const DocumentPreviewComponent = compose<DocumentPreviewOuterProps, any>(
  pure
)(({ contentNode, frame, dependency }: DocumentPreviewOuterProps) => {
  if (!contentNode) {
    return null;
  }

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
      <DesignPreview frame={frame} dependency={dependency} />}
    </div>
  );
});
