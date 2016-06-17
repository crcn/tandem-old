// export function parse(source:String):void;

interface IParser {
  parse(value:String):any;
}

declare var parser:IParser;

export default parser;

