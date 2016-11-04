import * as React from "react";
import { FocusComponent } from "@tandem/editor/browser/components/common";

// TODO - add some color for the CSS rules
export class KeyValueInputComponent extends React.Component<{ name: string, value: string, setKeyValue: (name: string, value: any, oldName?: string) => any }, { editName: boolean }> {

  constructor() {
    super();
    this.state = {
      editName: false
    };
  }

  editName = () => {
    this.setState({ editName: true })
  }

  onNameChange = (event: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    const oldName = this.props.name;
    const newName = event.currentTarget.value;

    if (oldName !== newName) {
      this.props.setKeyValue(newName, this.props.value, oldName);
    }
  }

  onNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.onNameChange(event);
    this.setState({ editName: false });
  };

  onValueChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const oldName = this.props.name;
    this.props.setKeyValue(this.props.name, event.currentTarget.value);
  }

  render() {
    const { name, value } = this.props;
    return <div className="row">
      <div className="col-xs-5 no-wrap td-cell-key" title={name} onDoubleClick={this.editName}>
        { !name || this.state.editName ? <FocusComponent select={true}><input type="text" onBlur={this.onNameBlur} defaultValue={name} onChange={this.onNameChange} /></FocusComponent> : name }
      </div>
      <div className="col-xs-7">
        <input type="text" defaultValue={value} onChange={this.onValueChange}></input>
      </div>
    </div>
  }
}

export interface IKeyInputComponentProps {
  items: { name: string, value: string }[];
  setKeyValue: (key: string, value: string, oldKey?: string) => any;
}

// TODO - add some color for the CSS rules
export class HashInputComponent extends React.Component<IKeyInputComponentProps, any> {
  render() {
    const { items } = this.props;
    return <div className="container td-cells">
      {
        // index important here since the name can change
        items.map((item, index) => {
          return <KeyValueInputComponent name={item.name} key={index} value={item.value} setKeyValue={this.props.setKeyValue} />;
        })
      }
    </div>
  }
}