export default function (methodName) {
  throw new Error(`"class ${this.constructor.name}" must override "${methodName}"`);
}
