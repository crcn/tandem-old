

export function create({ app }) {

  var factory = app.fragments.queryOne({
    id: 'elementEntity'
  }).factory;

  app.setProperties({
    rootEntity: factory.create({
      tagName: 'div'
    }, [
      factory.create({
        tagName: 'div',
        attributes: {
          style: {
            position: 'absolute',
            left: '300px',
            top: '200px',
            width: '100px',
            height: '150px'
          }
        }
      }),

      factory.create({
        tagName: 'div',
        attributes: {
          style: {
            position: 'absolute',
            left: '400px',
            top: '200px',
            width: '100px',
            height: '150px'
          }
        }
      })
    ])
  })
}