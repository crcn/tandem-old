let seed = Date.now() + "";
let _i = 0;

export const generateId = () => `${seed}${_i++}`;