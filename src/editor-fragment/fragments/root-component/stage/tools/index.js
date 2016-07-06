import { TemplateComponent, dom, createAttributeBinding } from 'paperclip';
import RegisteredComponent from 'common/components/registered';

export default class ToolsComponent extends TemplateComponent {
  static template = <div class='m-stage-tools'>
    <RegisteredComponent ns='components/tools/**' />
  </div>;
}
