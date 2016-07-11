import compileXML from 'common/compilers/xml';

export default function deserialize(source, { bus, fragmentDictionary }) {
  var createEntity = compileXML(source);
  var entity       = createEntity(function(type, ...rest) {
    var fragment;

    if (type === 'element') {
      fragment = fragmentDictionary.query(`entities/element/${rest[0]}`) ||
      fragmentDictionary.query(`entities/element`);
      return fragment.create({
        bus: bus,
        nodeName  : rest[0],
        attributes: rest[1],
        childNodes: rest[2]
      });
    } else if (type === 'text') {
      fragment = fragmentDictionary.query('entities/text');
      return fragment.create({ bus: bus, nodeValue: rest[0] });
    } else if (type === 'fragment') {
      fragment = fragmentDictionary.query('entities/element');
      return fragment.create({ bus: bus, nodeName: 'span', childNodes: rest[0]});
    }

    return fragment.create(rest);
  });

  return entity;
}
