import "./document.scss";
import * as React from "react";
import { compose, pure, lifecycle } from "recompose";
import { SyntheticDocument, getModuleInfo } from "paperclip";

export type DocumentPreviewOuterProps = {
  document: SyntheticDocument
};

type DocumentPreviewInnerProps = {  

} & DocumentPreviewOuterProps;

const BaseDocumentPreviewComponent = ({ document }) => {
  return <div className="m-preview-document">
    <div ref="container">
    </div>
  </div>;
};

const enhance = compose<DocumentPreviewOuterProps, DocumentPreviewOuterProps>(
  pure,
  lifecycle({
    componentDidUpdate({ document: oldDocument }: DocumentPreviewOuterProps, { document: newDocument }: DocumentPreviewOuterProps) {
      if (!oldDocument || oldDocument.mount !== newDocument.mount) {
        const container = this.refs.container as HTMLElement;
        while(container.childNodes) {
          container.removeChild(container.childNodes[0]);
        }
        container.appendChild(newDocument.mount);
      }
    },
    componentDidMount() {
      const container = this.refs.container as HTMLElement;
      container.appendChild(this.props.document.mount);
    }
  })
);

export const DocumentPreviewComponent = enhance(BaseDocumentPreviewComponent);