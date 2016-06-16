
import Collection from 'common/collection/index';

var c = Collection.create([1, 2, 3]); 

console.log(c.constructor === Collection);

console.log(c instanceof Array, c, c.length);
console.log(c.concat([1, 2, 3]).length);

