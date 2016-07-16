import Entity from 'common/entities/entity';
import { FactoryFragment } from 'common/fragments';
import FragmentSection from 'common/section/fragment';

export default class GroupEntity extends Entity {
  async load(options) {
    var section = this.section = FragmentSection.create();
    for (var childExpression of this.expression.childNodes) {
      await this.appendChild(await childExpression.load({
        ...options,
        section: this.section
      }));
    }
  }

  async update(options) {

    var childNodes = this.childNodes.concat();

    for (var i = 0, n = this.expression.childNodes.length; i < n; i++) {
      var cexpr = this.expression.childNodes[i];
      if (i < this.childNodes.length) {

        var child = childNodes.find(function(child) {
          return child.expression === cexpr;
        });

        if (child) {
          await child.update(options);

          if (child !== this.childNodes[i]) {
            // re-order
            this.insertBefore(child, this.childNodes[i]);
          }
        } else {
          var replChild = await cexpr.load({
            ...options,
            section: this.section
          });
          var oldChild = this.childNodes[i];
          this.insertBefore(replChild, oldChild);
          this.removeChild(oldChild);
        }
      } else {
        await this.appendChild(await cexpr.load({
          ...options,
          section: this.section
        }));
      }
    }
  }

  willUnmount() {
    this.section.remove();
  }
}

export const fragment = FactoryFragment.create({
  ns: 'entities/group',
  factory: GroupEntity,
});
