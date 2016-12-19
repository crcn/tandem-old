import { IMessage, IStreamableDispatcher, readOneChunk } from "@tandem/mesh";



// export class GetWorkerHostRequest implements IMessage {
//   static readonly GET_WORKER_HOST = "getWorkerHost";
//   readonly type = GetWorkerHostRequest.GET_WORKER_HOST;
//   static async dispatch(dispatcher: IStreamableDispatcher<any>): Promise<string> {
//     const host = (await readOneChunk(dispatcher.dispatch(new GetWorkerHostRequest()))).value;
//     return host;
//   }
// }