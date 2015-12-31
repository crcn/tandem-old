import { create } from 'common/utils/class';
import BaseMessage from 'common/message-types/base';

/**
 * Base notifier class
 * @interface
 */

class BaseNotifier {

    /**
     * @abstract
     * @param {BaseMessage} message the notification message to be handled by listeners
     */

    notify(message) {
        // override me
    }

    /**
     * creates a new notifier
     */

    static create = create;
}

export default BaseNotifier;