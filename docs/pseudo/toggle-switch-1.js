Project.create({
  children: [
    Property.create({
      name: 'value'
    }),
    Connection.create({
      // between: ['value', 'cvalue']
      from: { target: 'value'  },
      to  : { target: 'cvalue' }
    }),
    Connection.create({
      // between: ['value', 'cvalue']
      from: { target: 'condition', property: 'true' },
      to  : { target: 'cvalue' }
    }),
    Propert.create({
      name: 'label'
    }),
    Condition.create({
      name: 'condition',
      children: [
        Property.create({ name: 'cvalue' })
      ]
      output: [

        // might want to generalize targets here so that it can be anything such as a condition
        { subscribe: 'true', target: 'button1', type: 'call', property: 'show'},
        { subscribe: 'false', target: 'button2', type: 'call', property: 'show' }
      ]
    }),
    Button.create({
      name: 'button1'
    })
  ]
})
