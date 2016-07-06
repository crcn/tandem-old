export default function createCallback(property) {
  return function(...args) {
    var view = args.pop();
    return view.context[property].apply(view.context, args);
  }
}
