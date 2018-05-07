import "./document.scss";
import * as React from "react";
import { getAttribute } from "../../../../../../../common";
import { compose, pure, lifecycle } from "recompose";
import { SyntheticDocument, getModuleInfo, Dependency, DependencyGraph, getSyntheticNodeSourceNode, getComponentInfo } from "../../../../../../../paperclip";
import { PREVIEW_NAMESPACE } from "../../../../../../state";

export type DocumentPreviewOuterProps = {
  document: SyntheticDocument;
  dependency: Dependency;
};

type DocumentPreviewInnerProps = {

} & DocumentPreviewOuterProps;

const BaseDocumentPreviewComponent = ({ document }) => {
  const bounds = document.bounds;
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

  return <div className="m-preview-document" style={style}>
    <div ref="container">
    </div>
  </div>;
};

const enhance = compose<DocumentPreviewOuterProps, DocumentPreviewOuterProps>(
  pure,
  lifecycle({
    componentDidUpdate({ document: oldDocument }: DocumentPreviewOuterProps) {
      const props: DocumentPreviewOuterProps = this.props;
      if (!oldDocument || oldDocument.container !== props.document.container) {
        const container = this.refs.container as HTMLElement;
        while(container.childNodes.length) {
          container.removeChild(container.childNodes[0]);
        }
        container.appendChild(props.document.container);
      }
    },
    componentDidMount() {
      const container = this.refs.container as HTMLElement;
      if (container) {
        container.appendChild((this.props as DocumentPreviewOuterProps).document.container);
      }
    }
  })
);

export const DocumentPreviewComponent = enhance(BaseDocumentPreviewComponent);