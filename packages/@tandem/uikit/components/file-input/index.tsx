import "./index.scss";
import React =  require("react");

export class FileInputComponent extends React.Component<{ className?: string, accept: string, label: string, onChange: (event: React.SyntheticEvent<any>) => any }, any> {

  render() {
    return <div className="file-input">
      <input type="file" accept={this.props.accept} onChange={this.props.onChange} />
      <a href="#" className={["button", this.props.className].join(" ")}>{this.props.label}</a>
    </div>
  }
}