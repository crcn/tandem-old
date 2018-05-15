import "./index.scss";
import * as React from "react";
import * as cx from "classnames";
import { compose, pure, withHandlers, withState } from "recompose";
import { Dispatch } from "redux";
import { RootState } from "../../../../../state";
import { PaneComponent } from "../../../../pane";
import { FocusComponent } from "../../../../focus";
import { getAttribute } from "common";
import { getSyntheticNodeById, PCSourceAttributeNames, getSourceNodeById, getSyntheticSourceNode, PCSourceTagNames, getComponentInfo, getSyntheticNodeDocument } from "paperclip";
import { newStateNameEntered, componentStateNameDefaultToggleClick, componentStateRemoved, componentComponentStateNameChanged, componentComponentStateNameClicked } from "../../../../..";
const { States: BaseStates, StateItem: BaseStatesItem } = require("./index.pc");

type StateItemOuterProps = {
  name: string;
  useAsDefault: boolean;
  selected: boolean;
  onClick: () => any;
  onChange: (name: string, value: boolean) => any;
  onNameChange: (name: string, newName:string) => any;
  onRemove: (name: string) => any;
};

type StateItemInnerProps = {
  editingName: boolean;
  onCheckboxClick: any;
  onRemoveClick: any;
  onLabelDoubleClick: any;
  onNameInputKeyDown: any;
  onNameInputBlur: any;
} & StateItemOuterProps;

const StateItem = compose<StateItemInnerProps, StateItemOuterProps>(
  pure,
  withState("editingName", "setEditingName", false),
  withHandlers({
    onCheckboxClick: ({ onChange, name, useAsDefault }) => (event) => {
      onChange(name, !useAsDefault);
      event.stopPropagation();
    },
    onRemoveClick: ({ onRemove, name }) => (event) => {
      onRemove(name);
      event.stopPropagation();
    },
    onLabelDoubleClick: ({setEditingName}) => () => {
      setEditingName(true);
    },
    onNameInputKeyDown: ({ name, setEditingName, onNameChange }) => (event: React.KeyboardEvent<any>) => {
      if (event.key === "Enter") {
        onNameChange(name, String((event.target as any).value).trim());
        setEditingName(false);
      }
    },
    onNameInputBlur: ({ setEditingName }) => () => {
      setEditingName(false);
    },
    onClick: ({ onClick, name }) => (event) => {
      onClick(name);
    }
  })
)(({name, selected, useAsDefault, onCheckboxClick, onClick, editingName, onRemoveClick, onLabelDoubleClick, onNameInputBlur, onNameInputKeyDown}) => {
  const label = editingName ? <FocusComponent><input type="text" defaultValue={name} onKeyDown={onNameInputKeyDown} onBlur={onNameInputBlur} /></FocusComponent> : <span className="state-name" onDoubleClick={onLabelDoubleClick}>
    {name}
    <span className="options">
      <span onClick={onRemoveClick}>
        &times;
      </span>
    </span>
  </span>
  return <BaseStatesItem onClick={onClick} className={cx("state-item", { selected })} checkboxContainerChildren={<input type="checkbox" onClick={onCheckboxClick} checked={useAsDefault} />} labelContainerChildren={label} />;
});

type StatesPaneOuterProps = {
  root: RootState;
  dispatch: Dispatch<any>;
};

type StatePaneInnerProps = {
  inputNewStateMode: boolean;
  onStateToggle: (name: string, value: boolean) => any;
  onAddStateClick: any;
  onStateNameChange: any;
  onNewStateNameKeyDown: any;
  onNewStateNameBlur: any;
  onRemoveStateClick: any;
  onStateNameClick: any;
} & StatesPaneOuterProps;

export const StatesComponent = compose<StatePaneInnerProps, StatesPaneOuterProps>(
  pure,
  withState("inputNewStateMode", "setInputNewStateMode", false),
  withHandlers({
    onStateToggle: ({ dispatch }) => (name: string, value: boolean) => {
      dispatch(componentStateNameDefaultToggleClick(name, value));
    },
    onAddStateClick: ({ dispatch, setInputNewStateMode }) => (event: React.MouseEvent<any>) => {
      setInputNewStateMode(true);
    },
    onNewStateNameKeyDown: ({ dispatch, setInputNewStateMode }) => (event: React.KeyboardEvent<any>) => {
      if (event.key === "Enter") {
        const newStateName = String((event.target as any).value || "").trim();
        if (newStateName) {
          dispatch(newStateNameEntered(newStateName));
        }
        setInputNewStateMode(false);
      }
    },
    onNewStateNameBlur: ({ setInputNewStateMode }) => () => {
      setInputNewStateMode(false);
    },
    onRemoveStateClick: ({ dispatch }) => (name: string) => {
      dispatch(componentStateRemoved(name));
    },
    onStateNameChange: ({ dispatch }) => (oldName: string, newName: string) => {
      dispatch(componentComponentStateNameChanged(oldName, newName));
    },
    onStateNameClick: ({ dispatch }) => (name: string) => {
      dispatch(componentComponentStateNameClicked(name));
    }
  })
)(({root, onStateToggle, onAddStateClick, onStateNameClick, inputNewStateMode, onNewStateNameKeyDown, onNewStateNameBlur, onRemoveStateClick, onStateNameChange}) => {
  const selectedNodeId = root.selectedNodeIds[0];

  if (!selectedNodeId) {
    return null;
  }

  const document = getSyntheticNodeDocument(selectedNodeId, root.browser);
  const documentSourceNode = getSyntheticSourceNode(document.root.id, root.browser);

  if (documentSourceNode.name !== PCSourceTagNames.COMPONENT) {
    return null;
  }

  const info = getComponentInfo(documentSourceNode);

  const itemsContainerChildren = info.states.map(({name, isDefault}) => {
    return <StateItem selected={name === root.selectedComponentStateName} onClick={onStateNameClick} key={name} name={name} useAsDefault={isDefault} onChange={onStateToggle} onRemove={onRemoveStateClick} onNameChange={onStateNameChange} />;
  });

  if (inputNewStateMode) {
    itemsContainerChildren.push(
      <BaseStatesItem checkboxContainerChildren={<span></span>} labelContainerChildren={<FocusComponent>
        <input type="text" onKeyDown={onNewStateNameKeyDown} onBlur={onNewStateNameBlur} />
      </FocusComponent>} />
    );
  }

  const header = <span>
    States
    <div className="controls">
      <span className="add-state-button" onClick={onAddStateClick}>
        +
      </span>
    </div>
  </span>;

  return <PaneComponent className="m-states-pane" header={header}>
    <BaseStates itemsContainerChildren={itemsContainerChildren} />
  </PaneComponent>;
});