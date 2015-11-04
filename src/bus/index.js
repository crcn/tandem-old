import { NoopBus } from 'mesh';

export default {
  create: function() {
    return NoopBus.create();
  }
}; 
