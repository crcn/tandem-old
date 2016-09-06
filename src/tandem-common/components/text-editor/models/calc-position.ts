export default function(item, items) {
  const n = items.indexOf(item);
  let p = 0;
  for (let i = 0; i < n; i++) p += items[i].length;
  return p;
}
