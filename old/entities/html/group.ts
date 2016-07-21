import Entity from 'saffron-front-end/src/entities/base';
import { ClassFactoryFragment } from 'saffron-common/src/fragments/index';
import FragmentSection from 'saffron-front-end/src/section/fragment';
// import NodeSection from 'saffron-common/src/selection/node';
import IEntity from 'saffron-front-end/src/entities/interface';

interface IContainerExpression extends IEntity {
  childNodes:Array<IContainerExpression>;
}


export default class GroupEntity<T extends IContainerExpression> extends Entity<T> {

  public section:FragmentSection;

  async load(options) {
    this.section = new FragmentSection();
    for (var childExpression of this.expression.childNodes) {
      await this.appendChild(await childExpression.load(Object.assign({}, options, {
        section: this.section
      })));
    }
  }

  async update(options) {

    var childNodes = this.childNodes.concat();

    for (var i = 0, n = this.expression.childNodes.length; i < n; i++) {
      var cexpr = this.expression.childNodes[i];
      if (i < this.childNodes.length) {

        var child = childNodes.find((childNode) => (
          (childNode as any).expression === cexpr
        ));

        if (child) {
          await (child as any).update(options);

          if (child !== this.childNodes[i]) {
            // re-order
            this.insertBefore(child, this.childNodes[i]);
          }
        } else {
          var replChild = await cexpr.load(Object.assign({}, options, {
            section: this.section
          }));
          var oldChild = this.childNodes[i];
          this.insertBefore(replChild, oldChild);
          this.removeChild(oldChild);
        }
      } else {
        await this.appendChild(await cexpr.load(Object.assign({}, options, {
          section: this.section
        })));
      }
    }
  }

  willUnmount() {
    (this.section as any).remove();
  }
}
