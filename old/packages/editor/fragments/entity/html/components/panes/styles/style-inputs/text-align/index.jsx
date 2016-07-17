import React from 'react';
import { RadioGroupInputComponent, RadioGroupItemComponent } from 'saffron-common/components/inputs/radio-group';

class TextAlignStyleInputComponent extends React.Component {
  render() {
    return <RadioGroupInputComponent {...this.props}>
      <RadioGroupItemComponent value='left'>
        <i className='s s-align-left'></i>
      </RadioGroupItemComponent>
      <RadioGroupItemComponent value='justify'>
        <i className='s s-align-justify'></i>
      </RadioGroupItemComponent>
      <RadioGroupItemComponent value='center'>
        <i className='s s-align-center'></i>
      </RadioGroupItemComponent>
      <RadioGroupItemComponent value='right'>
        <i className='s s-align-right'></i>
      </RadioGroupItemComponent>
    </RadioGroupInputComponent>;
  }
}

export default TextAlignStyleInputComponent;
