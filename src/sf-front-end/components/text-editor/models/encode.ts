
export default function(text) {
  return text
  .replace(/\t/g, '&nbsp;&nbsp;')
  .replace(/\s/g, '&nbsp;');
}
