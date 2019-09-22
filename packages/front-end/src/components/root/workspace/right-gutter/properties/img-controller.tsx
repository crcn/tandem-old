import * as React from "react";
import {
  DependencyGraph,
  PCComponent,
  HtmlAttribute,
  PCComponentInstanceElement,
  PCElement
} from "paperclip";
import { Dispatch } from "redux";
import { BaseImgPropertiesProps, ElementProps } from "./view.pc";
import { kvpGetValue } from "tandem-common";
import {
  imageSourceInputChanged,
  imageBrowseButtonClicked
} from "../../../../../actions";

export type Props = {
  baseName: string;
  sourceNode: PCElement | PCComponentInstanceElement | PCComponent;
  dispatch: Dispatch<any>;
  graph: DependencyGraph;
} & ElementProps;

export default (Base: React.ComponentClass<BaseImgPropertiesProps>) =>
  class ImgPropertyController extends React.PureComponent<Props> {
    onPathChangeComplete = (value: string) => {
      this.props.dispatch(imageSourceInputChanged(value));
    };
    onUploadButtonClick = () => {
      this.props.dispatch(imageBrowseButtonClicked());
    };
    render() {
      const { baseName, sourceNode, ...rest } = this.props;
      const { onUploadButtonClick, onPathChangeComplete } = this;

      if (baseName !== "img") {
        return null;
      }

      return (
        <Base
          {...rest}
          pathInputProps={{
            value: kvpGetValue(HtmlAttribute.src, sourceNode.attributes),
            onChangeComplete: onPathChangeComplete
          }}
          uploadButtonProps={{
            onClick: onUploadButtonClick
          }}
        />
      );
    }
  };
