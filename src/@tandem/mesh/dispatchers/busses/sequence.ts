import { IDispatcher } from "../base";

export class SequenceBus implements IDispatcher {
  constructor(private _dispatchers: IDispatcher[]) {

  }

  dispatch(message: any) {

    // TODO - return duplex response
    let output;
    let input;

    // copy dispatchers in case they get mutated
    const dispatchers = this._dispatchers.concat();
    let currentResponse;

    const next = (index) => {
      if (index === dispatchers.length) return output.close();
      const resp = currentResponse = castStream(dispatchers[index].dispatch(index));
      input.tee().pipeTo(resp);
      resp.pipeTo({
        write: output.write.bind(output),
        close: next.bind(this, index + 1),
        abort: output.abort.bind(output)
      });
    }

    const cancel = () => currentResponse && currentResponse.cancel();

    output.then(cancel, cancel);
    next(0);
  }
}


const castStream = (value) => {
  // TODO
  return {} as any;
}