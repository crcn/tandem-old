export default function (instance:any, methodName:string) {
  throw new Error(`"class ${instance.constructor.name}" must override "${methodName}"`);
}
