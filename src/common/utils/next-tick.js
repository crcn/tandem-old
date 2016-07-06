export default (
  global.requestAnimationFrame       ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame    ||
  process.nextTick
).bind(global);
