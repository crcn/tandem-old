import * as React from 'react';
import assign from 'common/utils/object/assign';

export default class RegisterComponent extends React.Component<{fragments:any, ns:string}, {}> {
  render() {
    return <div>
      {
        this.props.fragments.query(this.props.ns).map((fragment, i) => {
          return fragment.create(assign({ key: i }, this.props));
        })
      }
    </div>;
  }
}