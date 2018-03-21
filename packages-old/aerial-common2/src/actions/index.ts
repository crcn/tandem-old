
export const isPublicAction = (action) => action["$public"];
export const publicActionFactory = <TFunc extends Function>(factory: TFunc): TFunc => ((...args) => ({
  ...factory(...args),
  $public: true
})) as any;