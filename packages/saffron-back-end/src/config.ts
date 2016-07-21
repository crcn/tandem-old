import { ALL } from 'saffron-common/lib/logger/levels';

export default {
  frontEndEntry: require.resolve('saffron-front-end'),
  socketio: {
    port: 8090
  },
  logger: {
    level: ALL
  },
};
