import * as React from 'react';
import BaseApplication from 'common/application/base';
import assign from 'common/utils/object/assign';

export default class RegisterComponent extends React.Component<{app:BaseApplication, ns:string}, {}> {
  render() {
    return <div>
      {
        this.props.app.fragments.query(this.props.ns).map((fragment, i) => {
          return fragment.create(assign({ key: i }, this.props));
        })
      }
    </div>;
  }
}