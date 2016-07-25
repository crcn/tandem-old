class TemplateComponent {

}

class RepeatComponent {

  constructor(expression:IExpression) {

  }

  shouldUpdate(expression:IExpression) {

  }

  async render() {
    var children = [];
    for (const item of this.attributes.each) {
      for (const childExpression of expression.childNodes) {
        children.push(expression);
      }
    }
    return children;
  }
}

class ImportComponent {
  shouldUpdate(props) {

  }
  async render(expression:IExpression) {

  }
}

class DivComponent {
  didMount() {

  }
}

render({ repeat: RepeatComponent }, exprssion);