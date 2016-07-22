import { Diff, applyPatch } from 'diff';
import StringScanner from '../string/scanner';


const htmlDiff = new Diff();
htmlDiff.tokenize = function(value) {
  var scanner = new StringScanner(value);
  var tokens = [];
  var i = 0;
  function addToken(search) {
    if (scanner.scan(search)) {
      tokens.push(scanner.getCapture());
      return true;
    }
    return false;
  } 

  while(!scanner.hasTerminated() && i++ < 1000) {
    
    // whitespace
    if (addToken(/^[\s\r\n\t]+/)) continue;

    // whole words
    if (addToken(/^[\w0-9-]+/)) continue;
    
    // everything else
    if (addToken(/^./)) continue;
  }

  return tokens;
};

export default function (oldStr, newStr) {
  var changes = htmlDiff.diff(oldStr, newStr);
  var output = '';

  for (const { value, removed } of changes) {


    // do not remove ws
    if (removed && !/^[\s\r\n\t]+$/.test(value)) {  
      continue; 
    }

    output += value;
  }

  return output;
}