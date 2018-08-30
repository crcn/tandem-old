import * as React from "react";
import { compose, pure, withHandlers } from "recompose";

export type Props = {
  value: boolean;
  onChange?: (value: boolean) => any;
  onChangeComplete?: (value: boolean) => any;
};

export default (Base: React.ComponentClass<any>) => {
  return class CheckboxController extends React.Component<Props> {
    onClick = event => {
      const { value, onChange, onChangeComplete } = this.props;

      event.stopPropagation();
      if (onChange) {
        onChange(value);
      }
      if (onChangeComplete) {
        onChangeComplete(!value);
      }
    };

    render() {
      return <Base onClick={this.onClick} {...this.props} />;
    }
  };
};

// export default compose<any, Props>(
//   pure,
//   withHandlers({
//     onClick: ({ value, onChange, onChangeComplete }) => event => {
//       event.stopPropagation();
//       if (onChange) {
//         onChange(value);
//       }
//       if (onChangeComplete) {
//         onChangeComplete(!value);
//       }
//     }
//   }),
//   (Base: React.ComponentClass<any>) => ({ onClick, onChange, onChangeComplete, ...rest }: InnerProps) => {
//     return <Base onClick={onClick} {...rest} />;
//   }
// );
