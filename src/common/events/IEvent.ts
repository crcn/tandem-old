interface IEvent {

  /**
   * the type of event being emitted
   */

  type:String;

  /**
   * the target event dispatcher
   */

  target:any;

  /**
   * stops the event from bubbling up
   */

  stopPropagation():void;

  /**
   */

  canPropagate():Boolean;

  /**
   * stops event from bubbling, and executing against sibling
   */

  stopImmmediatePropagation():void;

};

export default IEvent;