import './index.scss';

import { TemplateComponent, dom, createAttributeBinding, createTextBinding } from 'paperclip';
import { ComponentFactoryFragment } from 'paperclip/fragments';

const x2 = 0;
const y2 = 200;
const rotation = 0;
const length = 100;
const d = [];

export default class OriginToolComponent extends TemplateComponent {
  static template = <div class='m-origin-tool'>
    {createTextBinding('application.selection.length')}
    <svg style={ c => {return {
      left: x2,
      top : y2,
      transform: 'rotate(' + rotation + 'deg)',
      transformOrigin: 'top center'
    }}} viewBox={[0, 0, 11, length]} width={11} height={length}>
      <path d={[
        'M6 ' + length,
        'L4 ' + (length - 5),
        'M6 ' + length,
        'L8 ' + (length - 5)
       ].join('')} stroke='#FF00FF' fill='transparent' />

      <path d={d.join('')} stroke='#FF00FF' fill='transparent' />
    </svg>
  </div>;
}

export const fragment = ComponentFactoryFragment.create('components/tools/origin', OriginToolComponent);
