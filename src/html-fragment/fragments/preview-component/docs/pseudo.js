var tpl = `
  <saffron>
    <link href='./tpl.sfn' />
  </saffron>
`;

class Link extends Element {
  async load() {
    var source = await this.bus.execute({ type: 'loadFileGlob', href: this.attributes.href });
    deserialieEntity(source, this.app.fragmentDictionary);
    return await super.load();
  }
}
