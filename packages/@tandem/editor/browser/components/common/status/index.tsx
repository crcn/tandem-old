import "./index.scss";
import React =  require("react");
import { Status } from "@tandem/common/status";

export class StatusComponent extends React.Component<{ status: Status, className?: string, style?: any }, any> {
  render() {
    const { status, className, style } = this.props;
    let section;

    if (status) {
      if (status.type === Status.LOADING) {
        section = <span className="spinner" />
      } else if (status.type === Status.ERROR) {
        section = <span className="error-icon" title={status.data.stack}>
          <i className="ion-alert-circled" />
        </span>
      } else if (status.type === Status.COMPLETED) {
        section = <span className="completed-icon">
          &nbsp;
        </span>
      }
    }

    return <span className={["status-component", className].join(" ")} style={style}>
      { section || <span>&nbsp;</span> }
    </span>;
  }
}

