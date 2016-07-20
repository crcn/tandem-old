"use strict";
class Action {
    constructor(type) {
        this.type = type;
        this._canPropagate = true;
    }
    set currentTarget(value) {
        // always maintain the initial target so that actions
        // can be tracked back to their origin
        if (!this._target) {
            this._target = value;
        }
        this._currentTarget = value;
    }
    get target() {
        return this._target;
    }
    get currentTarget() {
        return this._currentTarget;
    }
    get canPropagate() {
        return this._canPropagate;
    }
    stopPropagation() {
        this._canPropagate = false;
    }
}
exports.Action = Action;
exports.CHANGE = 'change';
class ChangeAction extends Action {
    constructor(changes) {
        super(exports.CHANGE);
        this.changes = changes;
    }
}
exports.ChangeAction = ChangeAction;
exports.LOAD = 'load';
class LoadAction extends Action {
    constructor() {
        super(exports.LOAD);
    }
}
exports.LoadAction = LoadAction;
exports.INITIALIZE = 'initialize';
class InitializeAction extends Action {
    constructor() {
        super(exports.INITIALIZE);
    }
}
exports.InitializeAction = InitializeAction;
exports.LOG = 'log';
class LogAction extends Action {
    constructor(level, text) {
        super(exports.LOG);
        this.level = level;
        this.text = text;
    }
}
exports.LogAction = LogAction;
class DBAction extends Action {
    constructor(type, collectionName) {
        super(type);
        this.type = type;
        this.collectionName = collectionName;
    }
}
exports.DBAction = DBAction;
exports.INSERT = 'insert';
class InsertAction extends DBAction {
    constructor(collectionName, data) {
        super(exports.INSERT, collectionName);
        this.data = data;
    }
}
exports.InsertAction = InsertAction;
exports.UPDATE = 'update';
class UpdateAction extends DBAction {
    constructor(collectionName, data, query) {
        super(exports.INSERT, collectionName);
        this.data = data;
        this.query = query;
    }
}
exports.UpdateAction = UpdateAction;
exports.FIND = 'find';
class FindAction extends DBAction {
    constructor(collectionName, query, multi = false) {
        super(exports.FIND, collectionName);
        this.query = query;
    }
}
exports.FindAction = FindAction;
class FindAllAction extends FindAction {
    constructor(collectionName) {
        super(exports.FIND, collectionName, {}, true);
    }
}
exports.FindAllAction = FindAllAction;
exports.REMOVE = 'remove';
class RemoveAction extends DBAction {
    constructor(collectionName, query) {
        super(exports.REMOVE, collectionName);
        this.query = query;
    }
}
exports.RemoveAction = RemoveAction;
exports.UPSERT = 'upsert';
class UpsertAction extends DBAction {
    constructor(collectionName, data, query) {
        super(exports.UPSERT, collectionName);
        this.data = data;
        this.query = query;
    }
}
exports.UpsertAction = UpsertAction;
exports.DID_INSERT = 'didInsert';
exports.DID_REMOVE = 'didRemove';
exports.DID_UPDATE = 'didUpdate';
class PostDBAction extends DBAction {
    constructor(type, collectionName, data) {
        super(type, collectionName);
        this.data = data;
    }
    static createFromDBAction(action, data) {
        return new PostDBAction({
            [exports.INSERT]: exports.DID_INSERT,
            [exports.UPDATE]: exports.DID_UPDATE,
            [exports.REMOVE]: exports.DID_REMOVE
        }[action.type], action.collectionName, data);
    }
}
exports.PostDBAction = PostDBAction;
//# sourceMappingURL=index.js.map