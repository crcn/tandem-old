import DiffDOM from 'diff-dom';

var dd = new DiffDOM();
export const diff = dd.diff.bind(dd);
export const patch = dd.apply.bind(dd);
