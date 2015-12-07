// import Schema       from './schema'
// import EmailAddress from 'common/data/types/email-address'
// // import expect       from 'expect.js'
//
// describe(__filename + '#', function() {
//
//   it('can be created', function() {
//     new Schema();
//   });
//
//   it('can specify fields on the schema', function() {
//
//     var schema = new Schema({
//       fields: {
//         emailAddress : EmailAddress,
//         name         : String,
//         createdAt    : Date
//       }
//     });
//
//     expect(schema.fields.emailAddress.type).to.be(EmailAddress);
//   });
//
//   it('can coerce an object into something else', function() {
//     var schema = new Schema({
//       fields: {
//         emailAddress: EmailAddress,
//         name: String
//       }
//     });
//
//     var data = schema.coerce({
//       emailAddress: 'a@b.com',
//       name: 'Blarg'
//     });
//
//     expect(data.emailAddress instanceof EmailAddress).to.be(true);
//   });
//
//   it('throws an exception if a coerced field value is invalid', function() {
//
//     var schema = new Schema({
//       fields: {
//         emailAddress: EmailAddress
//       }
//     });
//
//     var err;
//
//     try {
//       schema.coerce({ emailAddress: 'blob' });
//     } catch(e) {
//       err = e;
//     }
//
//     expect(err.message).to.be('emailAddress.invalid');
//   });
//
//   it('can define a collection as a field item', function() {
//
//     var schema = new Schema({
//       fields: {
//         emailAddresses: [EmailAddress]
//       }
//     });
//
//     var err;
//
//     try {
//       schema.coerce({emailAddresses:'a@b.com'});
//     } catch(e) {
//       err = e;
//     }
//
//     expect(err.message).to.be('emailAddresses.invalid');
//
//     var data = schema.coerce({ emailAddresses:['a@b.com', 'b@c.com']})
//
//     expect(data.emailAddresses[0] instanceof EmailAddress).to.be(true);
//     expect(data.emailAddresses[1] instanceof EmailAddress).to.be(true);
//   });
// });
