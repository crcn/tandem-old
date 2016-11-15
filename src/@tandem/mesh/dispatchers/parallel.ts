// import { IBus, IDispatcher } from "./base";
// import { DuplexStream, ReadableStream, WritableStream, wrapDuplexStream, readAll } from "@tandem/mesh/streams";

// export class ParallelBus<T> implements IBus<T> {
//   constructor(private _dispatchers: IDispatcher<T>[]) { }

//   dispatch(message: T) {
//     return new DuplexStream((input, output) => {
//       const writer = output.getWriter();
//       writer.closed.catch(() => {});

//       let numRunning = this._dispatchers.length;

//       let spare: ReadableStream<any> = input, child: ReadableStream<any>;

//       for (let i = numRunning; i--;) {
//         [spare, child] = spare.tee();

//         child
//         .pipeThrough(wrapDuplexStream(this._dispatchers[i].dispatch(message)))
//         .pipeTo(new WritableStream({
//           write(chunk) {
//             return writer.write(chunk);
//           }
//         })).then(() => {
//           if (--numRunning) return;
//           return writer.close();
//         }).catch(writer.abort.bind(writer)).catch((e) => {

//         });
//       }

//       return {
//         cancel() {
//           // TODO
//         }
//       };
//     });
//   }
// }