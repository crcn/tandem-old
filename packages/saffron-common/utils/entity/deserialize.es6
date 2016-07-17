import compileXML from '../../compilers/xml';

function createTextNode(value) {
  return {
    async load(options) {
      var entity = await options.fragments.query('entities/text').create({
        ...options,
        nodeValue: value,
      });

      await entity.load();

      return entity;
    },
  };
}

function createFragment(childNodes) {
  if (childNodes.length === 1) {
    return childNodes[0];
  }

  return createElement('group', {}, childNodes);
}

function createBlock(run) {
  return {
    async load(options) {
      var entity = await options.fragments.query('entities/block').create({
        ...options,
        run: run,
      });

      await entity.load();
      return entity;
    },
  };
}

function createElement(nodeName, attributes, childNodes) {
  return {
    async load(options) {
      var fragment = options.fragments.query(`entities/${nodeName}`) || options.fragments.query('entities/element');

      var entity = fragment.create({
        ...options,
        nodeName,
        attributes,
      });

      await entity.load();

      for (const child of childNodes) {
        entity.appendChild(await child.load(options));
      }

      return entity;
    },
  };
}

export default function deserialize(source, options) {
  var createEntity  = compileXML(source);
  return createEntity(function (type, ...rest) {
    switch(type) {
      case 'text': return options.fragments.query('entities/text').create({
        ...options,
        nodeValue: rest[0]
      });
      case 'block': return options.fragments.query('entities/text').create({
        ...options,
        run: rest[0]
      });
      case 'element': return options.fragments.query('entities/element').create({
        ...options,
        nodeName: rest[0],
        attributes: rest[1],
        childNodes: rest[2]
      });
      case 'fragment': return options.fragments.query('entities/group').create({
        ...options,
        childNodes: rest[0]
      });
    }
  });
}
