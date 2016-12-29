declare var __webpack_require__;
import "./vendor/ionicons-2.0.1/css/ionicons.min.css";
import "./scss/main";
import "./preview.scss";


import React = require("react");
import ReactDOM = require("react-dom");

import { 
  Modal,
  Button,
  Banner,
  Popover 
} from "./components";

/**
 * Preview of all components for visual development in Tandem.
 */

class ComponentsPreview extends React.Component<any, any> {
  render() {
    return <div className="preview space-children">
      <div className="group">
        <div className="title">
          Buttons
        </div>
        <Button>button</Button>
        <Button disabled={true}>disabled button</Button>
        <Button className="primary">primary button</Button>
        <Button className="warning">warning button</Button>
        <Button className="error">error button</Button>
      </div>
       <div className="group">
        <div className="title">
          Banners
        </div>
        
        <Banner>Banner</Banner>
        <Banner className="notice">Notice</Banner>
        <Banner className="warning">Warning</Banner>
        <Banner className="failure">Failure</Banner>
      </div>
    </div>;
  }
}

const mount = document.createElement("div");
document.body.appendChild(mount);

ReactDOM.render(<ComponentsPreview />, mount);
