import './index.scss';

import React from 'react';
import StyleReference from 'common/reference/style';
import UnitInputComponent from 'common/components/inputs/unit';
import OriginInputComponent from './origin';
import ScrollableLabelInput from 'common/components/inputs/scrollable-label'

class TransformPaneComponent extends React.Component {
  render() {
    var entity = this.props.entity;

    return <div className='m-transform-pane'>

      <div className='container'>
        <div className='row'>
          <div className='col-sm-4'>
            <label>x</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'left')} />
          </div>
          <div className='col-sm-4'>
            <label>y</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'top')} />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-4'>
            <label>w</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'width')} />
          </div>
          <div className='col-sm-4'>
            <label>h</label>
            <UnitInputComponent reference={StyleReference.create(entity, 'height')} />
          </div>
          <div className='col-sm-4'>
            <label>&nbsp;</label>
            <OriginInputComponent reference={{
              getValue() {

                // -- prefix - don't want to actually parse CSS here (yet)
                var origin = entity.getStyle()['--origin'];
                return origin ? origin : [0, 0];
              },
              setValue([x, y]) {

                // 0   = 0
                // 0.5/x -0.5/
                // 0.5 = (1-0)-.5
                //  1  = .5
                var map = {
                  0.5: -0.5,
                  0  : 0,
                  1  : 0.5
                };

                var left = map[x];
                var top  = map[y];

                entity.setStyle({
                  '--origin': [x, y],
                  'transform': 'translate(' + left * 100 + '%, ' + top * 100 + '%)'
                });
              }
            }} />
          </div>
        </div>

        <div className='row hidden'>
          <div className='col-sm-3'>
            <label>rx</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
            <label>ry</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
            <label>rz</label>
            <input type='text'></input>
          </div>
          <div className='col-sm-3'>
          </div>
        </div>
      </div>

    </div>;
  }
}
export default TransformPaneComponent;
