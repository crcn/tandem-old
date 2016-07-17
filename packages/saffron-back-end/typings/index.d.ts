declare module 'saffron-back-end' {

  import { Bus } from 'mesh';

  interface Action {
    type:string;
  }

  interface Actor {
    execute(action:Action);
  }

  export default class Application {
    public actors:Array<Actor>;
    public bus:Bus;
    static create(properties:any):Application;
    initialize();
  }
}