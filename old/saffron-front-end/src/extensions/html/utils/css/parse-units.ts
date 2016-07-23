export default (value) => {
  const match = value.match(/([-\d\.]+)(\D+)?/);
  return [Number(match[1]), match[2] || 'px'];
};
