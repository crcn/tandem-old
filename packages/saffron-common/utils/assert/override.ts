export default function (methodName:string) {
  throw new Error(`"class ${this.constructor.name}" must override "${methodName}"`);
}
