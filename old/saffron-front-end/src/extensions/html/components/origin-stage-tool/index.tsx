import './index.scss';

import * as React from 'react';

import { ReactComponentFactoryFragment } from 'sf-front-end/fragments/index';

const d = [];
const x2 = 0;
const y2 = 200;
const length = 100;
const rotation = 0;

export default class OriginToolComponent extends React.Component<any, any> {
  render() {
    return (<div className='m-origin-tool'>
      <svg
        style={{
          left: x2,
          top : y2,
          transform: 'rotate(' + rotation + 'deg)',
          transformOrigin: 'top center',
        }}
        viewBox={[0, 0, 11, length]}
        width={11}
        height={length}
      >
        <path
          d={[
            'M6 ' + length,
            'L4 ' + (length - 5),
            'M6 ' + length,
            'L8 ' + (length - 5),
          ].join('')}
          stroke='#FF00FF'
          fill='transparent'
        />

        <path d={d.join('')} stroke='#FF00FF' fill='transparent' />
      </svg>
    </div>);
  }
}

export const fragment = new ReactComponentFactoryFragment('components/stage-tools/origin', OriginToolComponent);
