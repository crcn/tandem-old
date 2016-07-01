import {
  ReferenceExpression,
  PathExpression,
  ImportExpression,
  StringExpression,
  BodyExpression,
  CommentExpression,
  GroupExpression,
  ClassExpression,
  CallExpression,
  NullExpression,
  ArrayExpression,
  FunctionCallExpression,
  FunctionExpression,
  AssignExpression,
  VarExpression,
  StatementExpression,
  ClassFunctionExpression
} from 'lang/ast/es6';

import {
  ElementExpression,
  TextExpression,
  CommentExpression as XMLCommentExpression,
  BlockExpression
} from 'lang/ast/xml';

export default function translate(ast) {
  return createRootExpression(ast);
}

function createRootExpression(ast) {

  var className = 'Component';

  var exprs = new GroupExpression(

    new AssignExpression(
      new VarExpression('React'),
      new CallExpression(new ReferenceExpression('require'), [new StringExpression('react')])
    ),

    new FunctionExpression(
      className,
      [],
      new BodyExpression(
        new StatementExpression(
          new CallExpression(
            new PathExpression(
              new ReferenceExpression('React'),
              new ReferenceExpression('Component'),
              new ReferenceExpression('apply')
            ),[
            new ReferenceExpression('this'),
            new ReferenceExpression('arguments')
          ])
        )
      )
    ),
    new AssignExpression(
      new PathExpression(
        new ReferenceExpression(className),
        new ReferenceExpression('prototype')
      ),
      new CallExpression(
        new PathExpression(
          new ReferenceExpression('Object'),
          new ReferenceExpression('create')
        ),
        [
          new PathExpression(
            new ReferenceExpression('React'),
            new ReferenceExpression('Component')
          )
        ]
      )
    ),
    new AssignExpression(
      new PathExpression(
        new ReferenceExpression(className),
        new ReferenceExpression('prototype'),
        new ReferenceExpression('render')
      ),
      new FunctionExpression(
        void 0,
        [],
        createRenderBodyExpression(ast)
      )
    ),

    new AssignExpression(
      new PathExpression(
        new ReferenceExpression('module'),
        new ReferenceExpression('exports')
      ),
      new ReferenceExpression(className)
    )
  );

  console.log(exprs.toString());

  return exprs;
}

function createRenderBodyExpression(ast) {

  var elements = [];
  var exprs = [elements];

  exprs.push(
    new StatementExpression(
      new AssignExpression(
        new VarExpression('elements'),
        new ArrayExpression()
      )
    )
  );

  var nodes = ast.length === 1 ? ast : [new ElementExpression('span', [], ast)];

  nodes.forEach(function(node) {

    // move over here -- might need to check node to see if it
    // has conditional logic built in.
    elements.push(node);

    exprs.push(
      new FunctionCallExpression(
        new PathExpression(
          new ReferenceExpression('elements'),
          new ReferenceExpression('push')
        ),

        createJSXElementExpression(node)
      )
    );
  });


  return new BodyExpression(
    ...exprs
  );
}

function createJSXElementExpression(node) {

  if (node instanceof ElementExpression) {
    return new FunctionCallExpression(
      new PathExpression(
        new ReferenceExpression('React'),
        new ReferenceExpression('createElement')
      ),
      new StringExpression(node.name),
      createJSXElementAttributesExpression(node.attributes),
      new ArrayExpression(...node.children.map(createJSXElementExpression))
    );
  } else if (node instanceof TextExpression) {
    return new StringExpression(node.value);
  } else if (node instanceof XMLCommentExpression) {
    return new CommentExpression(node.value);
  } else if (node instanceof BlockExpression) {
    return createJSXBlockExpression(node.value);
  }

  throw new Error(`Unknown expression ${node[0]}`);
}

function createJSXElementAttributesExpression(node) {
  return new NullExpression();
}

function createJSXBlockExpression(block) {
  return new NullExpression();
}
