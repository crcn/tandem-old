declare module 'saffron-back-end' {

  interface Action {
    type:string;
  }

  interface Actor {
    execute(action:Action);
  }

  export default class Application {
    public actors:Array<Actor>;
    static create(properties:any):Application;
    initialize();
  }
}