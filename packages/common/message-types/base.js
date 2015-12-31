import { create } from 'common/utils/class';
import assert from 'assert';

/**
 * Base notifier message
 */

class BaseMessage {

    /**
     *
     * @param {String} type the type of message
     * @param {Object} properties properties of the message
     */

    constructor(type, properties = {}) {
        assert(type, 'Type must exist');
        this.type = type;
        Object.assign(this, properties);
    }

    /**
     * creates a new message
     */

    static create = create;
}

export default BaseMessage;