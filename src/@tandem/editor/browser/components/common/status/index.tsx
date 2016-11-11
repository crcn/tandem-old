import "./index.scss";
import * as React from "react";
import { Status } from "@tandem/common/status";

export class StatusComponent extends React.Component<{ status: Status, className?: string, style?: any }, any> {
  render() {
    const { status, className, style } = this.props;
    if (!status) return null;

    let section;

    if (status.type === Status.LOADING) {
      section = <span className="spinner" />
    } else if (status.type === Status.ERROR) {
      section = <span className="error-icon" title={status.data.stack}>
        <i className="ion-alert-circled" />
      </span>
    } else if (status.type === Status.COMPLETED) {
      // section = <span className="completed-icon">
      //   <i className="ion-checkmark-round" />
      // </span>
    }

    return <span className={["status-component", className].join(" ")} style={style}>
      { section }
    </span>;
  }
}

