import * as React from "react";
import { FocusComponent, TextEditorComponent } from "@tandem/editor/browser/components/common";
import { ITokenizer, inject, InjectorProvider, Injector, BaseApplicationComponent } from "@tandem/common";

export interface IKeyValueItem {
  name: string;
  readonly?: boolean;
  value: any;
  overriden?: boolean;
}

export interface IKeyValueInputComponentProps {
  item: IKeyValueItem;
  setKeyValue: (name: string, value: any, oldName?: string) => any;
  onValueEnter: (item) =>  any;
  className?: string;
  valueTokenizer?: ITokenizer;
  style?: any;
}

// TODO - add some color for the CSS rules
export class KeyValueInputComponent extends BaseApplicationComponent<IKeyValueInputComponentProps, { editName: boolean, currentValue: string }> {

  private _currentValue: any;

  state = {
    editName: false,
    currentValue: undefined
  };

  editName = () => {
    this.setState({ editName: true, currentValue: undefined })
  }

  onNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/13/.test(String(event.keyCode))) return;
    this.saveName(event);
  }

  get item() {
    return this.props.item;
  }

  saveName = (event: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    const oldName = this.item.name;
    const newName = event.currentTarget.value;

    // unset
    if (newName === "") {
      return this.props.setKeyValue(undefined, undefined, oldName);
    }

    if (oldName !== newName) {
      this.props.setKeyValue(newName, this.item.value, oldName);
    }
  }

  onNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.saveName(event);
    this.setState({ editName: false, currentValue: undefined });
  };

  onValueChange = (value: string) => {
    const oldName = this.item.name;
    this.props.setKeyValue(this.item.name, this.state.currentValue = value);
  }

  onValueFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ currentValue: this.item.value, editName: this.state.editName });
    // event.currentTarget.select();
  }

  onValueBlur = (event: React.FocusEvent<any>) => {

    // unset
    if (this.state.currentValue === "") {
      this.props.setKeyValue(this.item.name, undefined);
    }

    this.setState({ currentValue: undefined, editName: this.state.editName });
  }

  onValueKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) this.props.onValueEnter(this.props.item);
  }

  render() {
    const { className, style, valueTokenizer } = this.props;
    const { name, value, readonly, overriden } = this.item;

    return <div style={style} className={["row font-regular", className].join(" ")}>
      <div className="col-4 no-wrap dim" title={name} onDoubleClick={!readonly && this.editName}>
        { !name || this.state.editName ? <FocusComponent select={true}><input type="text" onBlur={this.onNameBlur} defaultValue={name} onKeyDown={this.onNameKeyDown} /></FocusComponent> : name }
      </div>
      <TextEditorComponent
        className="col-6"
        value={this.state.currentValue || value}
        injector={this.injector}
        style={{textDecoration: overriden ? "line-through" : undefined}}
        onKeyDown={this.onValueKeyDown}
        tokenizer={valueTokenizer}
        onChange={this.onValueChange}
        onFocus={this.onValueFocus}
        onBlur={this.onValueBlur}
        />
    </div>
  }
}

export interface IKeyInputComponentProps {
  items: IKeyValueItem[];
  valueTokenizer?: ITokenizer;
  setKeyValue: (key: string, value: string, oldKey?: string) => any;
  renderItemComponent?: (props: IKeyValueInputComponentProps) => any;
}

// TODO - add some color for the CSS rules
export class HashInputComponent extends React.Component<IKeyInputComponentProps, any> {

  onValueEnter = (item) => {

    // TODO - possibly insert new prop here - this.setKeyValue("", "", index)
    if (this.props.items.indexOf(item) === this.props.items.length - 1) {
      this.props.setKeyValue("", "");
    }
  }

  render() {
    const { items, renderItemComponent, valueTokenizer } = this.props;
    return <div className="table">
      {
        // index important here since the name can change
        items.map((item, index) => {
          const props = {
            item: item,
            valueTokenizer: valueTokenizer,
            setKeyValue: this.props.setKeyValue,
            onValueEnter: this.onValueEnter
          }
          return <span key={index}>
            { renderItemComponent ? renderItemComponent(props) : <KeyValueInputComponent {...props} /> }
          </span>;
        })
      }
    </div>
  }
}