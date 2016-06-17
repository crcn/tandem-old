import IEvent from 'common/events/IEvent';

interface IDispatcher {
  dispatch(event:IEvent):any;
}

export default IDispatcher;