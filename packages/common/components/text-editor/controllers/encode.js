// TODO - add params to this

export default function(text) {
  return text
  .replace(/\t/g, '&nbsp;&nbsp;')
  .replace(/\s/g, '&nbsp;');
}
