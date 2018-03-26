import "./document.scss";
import * as React from "react";
import { getAttribute } from "common";
import { compose, pure, lifecycle } from "recompose";
import { SyntheticDocument, getModuleInfo, Dependency, DependencyGraph, getSyntheticNodeSourceNode, getComponentInfo } from "paperclip";
import { PREVIEW_NAMESPACE } from "../../../../../../state";

export type DocumentPreviewOuterProps = {
  document: SyntheticDocument;
  dependency: Dependency;
};

type DocumentPreviewInnerProps = {  

} & DocumentPreviewOuterProps;

const BaseDocumentPreviewComponent = ({ document, dependency }) => {
  const componentNode = getSyntheticNodeSourceNode(document.root, dependency.content);
  const style = getAttribute(componentNode, "style", PREVIEW_NAMESPACE);

  return <div className="m-preview-document" style={style}>
    <div ref="container">
    </div>
  </div>;
};

const enhance = compose<DocumentPreviewOuterProps, DocumentPreviewOuterProps>(
  pure,
  lifecycle({
    // componentDidUpdate({ document: oldDocument }: DocumentPreviewOuterProps, { document: newDocument }: DocumentPreviewOuterProps = { document: null }) {
    //   if (!oldDocument || oldDocument.container !== newDocument.container) {
    //     const container = this.refs.container as HTMLElement;
    //     while(container.childNodes) {
    //       container.removeChild(container.childNodes[0]);
    //     }
    //     container.appendChild(newDocument.container);
    //   }
    // },
    componentDidMount() {
      const container = this.refs.container as HTMLElement;
      container.appendChild((this.props as DocumentPreviewOuterProps).document.container);
    }
  })
);

export const DocumentPreviewComponent = enhance(BaseDocumentPreviewComponent);