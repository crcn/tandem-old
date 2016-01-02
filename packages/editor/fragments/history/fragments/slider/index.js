
import {
  ComponentFragment
} from 'editor/fragment/types';

import HistorySliderComponent from './slider';

export function create({ history }) {
  return [
    ComponentFragment.create({
      history        : history,
      id             : 'historySliderComponent',
      paneType       : 'footer',
      componentClass : HistorySliderComponent
    })
  ];
}