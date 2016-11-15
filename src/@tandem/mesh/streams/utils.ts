import { ReadableStream, ReadableStreamDefaultReader, WritableStream, TransformStream } from "./std";

export function readAll<T>({ readable, writable }: TransformStream<any, T>): Promise<T[]>;
export function readAll<T>(readable: ReadableStream<T>): Promise<T[]>;
export function readAll<T>(value: any): Promise<T[]> {

  let readable: ReadableStream<T> = (<TransformStream<any, T>>value).readable || value as ReadableStream<T>;

  return new Promise((resolve, reject) => {
    const result = [];
    readable.pipeTo(new WritableStream({
      write(chunk) {
        result.push(chunk);
      }
    })).then(resolve.bind(this, result)).catch(reject);
  });
}