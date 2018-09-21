import * as React from "react";
import * as path from "path";
import * as cx from "classnames";
import { compose } from "recompose";
import { BaseFileNavigatorLayerProps } from "./view.pc";
import { FSItem, FSItemTagNames } from "tandem-common";
import { Dispatch } from "redux";
import {
  fileNavigatorItemClicked,
  fileNavigatorToggleDirectoryClicked
} from "actions";
import {
  withFileNavigatorContext,
  FileNavigatorContextProps
} from "./contexts";

export type Props = {
  item: FSItem;
  depth?: number;
} & BaseFileNavigatorLayerProps;

type ContextProps = {
  selected: boolean;
  dispatch: Dispatch<any>;
};

type InnerProps = Props & ContextProps;

const LAYER_PADDING = 16;

const ROOT_STYLE = {
  display: "inline-block",
  minWidth: "100%"
};

export default (Base: React.ComponentClass<BaseFileNavigatorLayerProps>) => {
  const FileNavigatorLayer = compose<BaseFileNavigatorLayerProps, Props>(
    withFileNavigatorContext<ContextProps, Props>(
      (props, { selectedFileNodeIds, dispatch }) => {
        return {
          selected: selectedFileNodeIds.indexOf(props.item.id) !== -1,
          dispatch
        };
      }
    ),
    (Base: React.ComponentClass<BaseFileNavigatorLayerProps>) => {
      return class FileNavigatorLayerController extends React.PureComponent<
        InnerProps
      > {
        onClick = () => {
          this.props.dispatch(fileNavigatorItemClicked(this.props.item));
        };
        onArrowClick = (event: React.MouseEvent<any>) => {
          this.props.dispatch(
            fileNavigatorToggleDirectoryClicked(this.props.item)
          );
          event.stopPropagation();
        };
        render() {
          const { item, depth = 1, dispatch, selected, ...rest } = this.props;
          const { onClick, onArrowClick } = this;
          const { expanded } = item;

          let children;

          if (expanded) {
            children = item.children.map(child => {
              return (
                <FileNavigatorLayer
                  key={child.id}
                  item={child as FSItem}
                  depth={depth + 1}
                />
              );
            });
          }

          return (
            <span style={ROOT_STYLE}>
              <Base
                {...rest}
                style={{
                  paddingLeft: LAYER_PADDING * depth
                }}
                onClick={onClick}
                arrowProps={{ onClick: onArrowClick }}
                variant={cx({
                  folder: item.name === FSItemTagNames.DIRECTORY,
                  file: item.name === FSItemTagNames.FILE,
                  expanded,
                  selected
                })}
                label={path.basename(item.uri)}
              />
              {children}
            </span>
          );
        }
      };
    }
  )(Base);

  return FileNavigatorLayer;
};
