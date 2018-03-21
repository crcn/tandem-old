"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
exports.CoreEvent = base_1.CoreEvent;
var serialize_1 = require("../serialize");
var mesh_ds7_1 = require("mesh-ds7");
var Message = /** @class */ (function () {
    function Message(type) {
        this.type = type;
    }
    return Message;
}());
exports.Message = Message;
var DisposeEvent = /** @class */ (function (_super) {
    __extends(DisposeEvent, _super);
    function DisposeEvent() {
        return _super.call(this, DisposeEvent.DISPOSE) || this;
    }
    DisposeEvent.DISPOSE = "dispose";
    return DisposeEvent;
}(base_1.CoreEvent));
exports.DisposeEvent = DisposeEvent;
var LoadApplicationRequest = /** @class */ (function (_super) {
    __extends(LoadApplicationRequest, _super);
    function LoadApplicationRequest() {
        return _super.call(this, LoadApplicationRequest.LOAD) || this;
    }
    LoadApplicationRequest.LOAD = "loadApplication";
    return LoadApplicationRequest;
}(Message));
exports.LoadApplicationRequest = LoadApplicationRequest;
var InitializeApplicationRequest = /** @class */ (function (_super) {
    __extends(InitializeApplicationRequest, _super);
    function InitializeApplicationRequest() {
        return _super.call(this, InitializeApplicationRequest.INITIALIZE) || this;
    }
    InitializeApplicationRequest.INITIALIZE = "initializeApplication";
    return InitializeApplicationRequest;
}(Message));
exports.InitializeApplicationRequest = InitializeApplicationRequest;
var ApplicationReadyMessage = /** @class */ (function (_super) {
    __extends(ApplicationReadyMessage, _super);
    function ApplicationReadyMessage() {
        return _super.call(this, ApplicationReadyMessage_1.READY) || this;
    }
    ApplicationReadyMessage_1 = ApplicationReadyMessage;
    ApplicationReadyMessage.READY = "applicationReady";
    ApplicationReadyMessage = ApplicationReadyMessage_1 = __decorate([
        serialize_1.serializable("ApplicationReadyMessage")
    ], ApplicationReadyMessage);
    return ApplicationReadyMessage;
    var ApplicationReadyMessage_1;
}(Message));
exports.ApplicationReadyMessage = ApplicationReadyMessage;
var DSUpsertRequest = /** @class */ (function (_super) {
    __extends(DSUpsertRequest, _super);
    function DSUpsertRequest(collectionName, data, query) {
        var _this = _super.call(this, DSUpsertRequest_1.DS_UPSERT, collectionName) || this;
        _this.data = data;
        _this.query = query;
        return _this;
    }
    DSUpsertRequest_1 = DSUpsertRequest;
    DSUpsertRequest.DS_UPSERT = "dsUpsert";
    DSUpsertRequest = DSUpsertRequest_1 = __decorate([
        serialize_1.serializable("DSUpsertRequest")
    ], DSUpsertRequest);
    return DSUpsertRequest;
    var DSUpsertRequest_1;
}(mesh_ds7_1.DSMessage));
exports.DSUpsertRequest = DSUpsertRequest;
var PostDSMessage = /** @class */ (function (_super) {
    __extends(PostDSMessage, _super);
    function PostDSMessage(type, collectionName, data, timestamp) {
        var _this = _super.call(this, type, collectionName) || this;
        _this.data = data;
        _this.timestamp = timestamp;
        return _this;
    }
    PostDSMessage_1 = PostDSMessage;
    PostDSMessage.createFromDSRequest = function (request, data) {
        return new PostDSMessage_1((_a = {},
            _a[mesh_ds7_1.DSInsertRequest.DS_INSERT] = PostDSMessage_1.DS_DID_INSERT,
            _a[mesh_ds7_1.DSUpdateRequest.DS_UPDATE] = PostDSMessage_1.DS_DID_UPDATE,
            _a[mesh_ds7_1.DSRemoveRequest.DS_REMOVE] = PostDSMessage_1.DS_DID_REMOVE,
            _a)[request.type], request.collectionName, data, request.timestamp);
        var _a;
    };
    PostDSMessage.DS_DID_INSERT = "dsDidInsert";
    PostDSMessage.DS_DID_REMOVE = "dsDidRemove";
    PostDSMessage.DS_DID_UPDATE = "dsDidUpdate";
    PostDSMessage = PostDSMessage_1 = __decorate([
        serialize_1.serializable("PostDSMessage")
    ], PostDSMessage);
    return PostDSMessage;
    var PostDSMessage_1;
}(mesh_ds7_1.DSMessage));
exports.PostDSMessage = PostDSMessage;
var MetadataChangeEvent = /** @class */ (function (_super) {
    __extends(MetadataChangeEvent, _super);
    function MetadataChangeEvent(key, value) {
        var _this = _super.call(this, MetadataChangeEvent.METADATA_CHANGE) || this;
        _this.key = key;
        _this.value = value;
        return _this;
    }
    MetadataChangeEvent.METADATA_CHANGE = "metadataChange";
    return MetadataChangeEvent;
}(base_1.CoreEvent));
exports.MetadataChangeEvent = MetadataChangeEvent;
//# sourceMappingURL=core.js.map