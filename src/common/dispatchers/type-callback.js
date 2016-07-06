export default class TypeCallbackDispatcher {
  constructor(type, callback) {
    this.type = type;
    this.callback = callback;
  }

  dispatch(event) {
    if (event.type === this.type) {
      return this.callback(event);
    }
  }
}
