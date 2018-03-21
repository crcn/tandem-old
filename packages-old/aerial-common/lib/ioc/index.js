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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
// TODO - add more static find methods to each Provider here
__export(require("./base"));
/**
 */
function createSingletonBusProviderClass(name) {
    var id = ["bus", name].join("/");
    return _a = /** @class */ (function (_super) {
            __extends(BusProvider, _super);
            function BusProvider(bus) {
                return _super.call(this, id, bus) || this;
            }
            BusProvider.getInstance = function (providers) {
                var provider = providers.query(id);
                if (!provider) {
                    throw new Error("Cannot get a singleton provider instance of \"" + id + "\"");
                }
                return provider.value;
            };
            return BusProvider;
        }(base_1.Provider)),
        _a.ID = id,
        _a;
    var _a;
}
exports.createSingletonBusProviderClass = createSingletonBusProviderClass;
/**
 * Private bus that can only be used within the application. This typically contains messages
 * that are junk for other outside resources.
 *
 * Bubbles messages to the protected bus.
 */
exports.PrivateBusProvider = createSingletonBusProviderClass("private");
var MainDispatcherProvider = /** @class */ (function (_super) {
    __extends(MainDispatcherProvider, _super);
    function MainDispatcherProvider(dispatcher) {
        return _super.call(this, MainDispatcherProvider.ID, dispatcher) || this;
    }
    MainDispatcherProvider.getInstance = function (kernel) {
        var provider = kernel.query(this.ID);
        return provider.value;
    };
    MainDispatcherProvider.ID = "MAIN_DISPATCHER";
    return MainDispatcherProvider;
}(base_1.Provider));
exports.MainDispatcherProvider = MainDispatcherProvider;
/**
 */
var KernelProvider = /** @class */ (function (_super) {
    __extends(KernelProvider, _super);
    function KernelProvider() {
        return _super.call(this, KernelProvider.ID, null) || this;
    }
    KernelProvider.prototype.clone = function () {
        return new KernelProvider();
    };
    Object.defineProperty(KernelProvider.prototype, "owner", {
        get: function () {
            return this.value;
        },
        set: function (value) {
            this.value = value;
        },
        enumerable: true,
        configurable: true
    });
    KernelProvider.ID = "providers";
    return KernelProvider;
}(base_1.Provider));
exports.KernelProvider = KernelProvider;
/**
 */
var i = 0;
var CommandFactoryProvider = /** @class */ (function (_super) {
    __extends(CommandFactoryProvider, _super);
    function CommandFactoryProvider(messageFilter, clazz, priority) {
        var _this = _super.call(this, [CommandFactoryProvider.NS, i++].join("/"), clazz, priority) || this;
        _this.clazz = clazz;
        if (typeof messageFilter === "string") {
            _this.messageFilter = function (message) { return message.type === messageFilter; };
        }
        else {
            _this.messageFilter = messageFilter;
        }
        return _this;
    }
    CommandFactoryProvider.prototype.create = function () {
        return _super.prototype.create.call(this);
    };
    CommandFactoryProvider.findAll = function (providers) {
        return providers.queryAll([CommandFactoryProvider.NS, "**"].join("/"));
    };
    CommandFactoryProvider.findAllByMessage = function (message, providers) {
        return this.findAll(providers).filter(function (dep) { return dep.messageFilter(message); });
    };
    CommandFactoryProvider.prototype.clone = function () {
        return new CommandFactoryProvider(this.messageFilter, this.clazz, this.priority);
    };
    CommandFactoryProvider.NS = "commands";
    return CommandFactoryProvider;
}(base_1.ClassFactoryProvider));
exports.CommandFactoryProvider = CommandFactoryProvider;
/**
 */
var MimeTypeProvider = /** @class */ (function (_super) {
    __extends(MimeTypeProvider, _super);
    function MimeTypeProvider(fileExtension, mimeType) {
        var _this = _super.call(this, [MimeTypeProvider.NS, fileExtension].join("/"), mimeType) || this;
        _this.fileExtension = fileExtension;
        _this.mimeType = mimeType;
        return _this;
    }
    MimeTypeProvider.prototype.clone = function () {
        return new MimeTypeProvider(this.fileExtension, this.mimeType);
    };
    MimeTypeProvider.findAll = function (providers) {
        return providers.queryAll([MimeTypeProvider.NS, "**"].join("/"));
    };
    MimeTypeProvider.lookup = function (uri, providers) {
        var extension = uri.split(".").pop();
        var dep = providers.query([MimeTypeProvider.NS, extension].join("/"));
        return dep ? dep.value : undefined;
    };
    MimeTypeProvider.NS = "mimeType";
    return MimeTypeProvider;
}(base_1.Provider));
exports.MimeTypeProvider = MimeTypeProvider;
var MimeTypeAliasProvider = /** @class */ (function (_super) {
    __extends(MimeTypeAliasProvider, _super);
    function MimeTypeAliasProvider(mimeType, aliasMimeType) {
        var _this = _super.call(this, MimeTypeAliasProvider.getNamespace(mimeType), aliasMimeType) || this;
        _this.mimeType = mimeType;
        _this.aliasMimeType = aliasMimeType;
        return _this;
    }
    MimeTypeAliasProvider.prototype.clone = function () {
        return new MimeTypeAliasProvider(this.mimeType, this.aliasMimeType);
    };
    MimeTypeAliasProvider.getNamespace = function (mimeType) {
        return [MimeTypeAliasProvider.NS, mimeType].join("/");
    };
    MimeTypeAliasProvider.lookup = function (uriOrMimeType, providers) {
        var mimeType = MimeTypeProvider.lookup(uriOrMimeType, providers);
        var dep = (mimeType && providers.query(this.getNamespace(mimeType))) || providers.query(this.getNamespace(uriOrMimeType));
        return (dep && dep.value) || mimeType || uriOrMimeType;
    };
    MimeTypeAliasProvider.NS = "mimeTypeAliases";
    return MimeTypeAliasProvider;
}(base_1.Provider));
exports.MimeTypeAliasProvider = MimeTypeAliasProvider;
var StoreProvider = /** @class */ (function () {
    function StoreProvider(name, _clazz) {
        this.name = name;
        this._clazz = _clazz;
        this.overridable = false;
        this.id = StoreProvider.getId(name);
    }
    Object.defineProperty(StoreProvider.prototype, "value", {
        get: function () {
            return this._value || (this._value = new this._clazz());
        },
        enumerable: true,
        configurable: true
    });
    StoreProvider.prototype.clone = function () {
        return new StoreProvider(this.name, this._clazz);
    };
    StoreProvider.getId = function (name) {
        return [this.NS, name].join("/");
    };
    StoreProvider.NS = "store";
    return StoreProvider;
}());
exports.StoreProvider = StoreProvider;
function createSingletonProviderClass(id) {
    return _a = /** @class */ (function () {
            function SingletonProvider(clazz) {
                this.overridable = true;
                this.id = id;
                this._clazz = clazz;
            }
            Object.defineProperty(SingletonProvider.prototype, "value", {
                get: function () {
                    return this._value || (this._value = this.owner.create(this._clazz, []));
                },
                enumerable: true,
                configurable: true
            });
            SingletonProvider.prototype.clone = function () {
                return new SingletonProvider(this._clazz);
            };
            SingletonProvider.getInstance = function (kernel) {
                var dep = kernel.query(id);
                return dep ? dep.value : undefined;
            };
            return SingletonProvider;
        }()),
        _a.ID = id,
        _a;
    var _a;
}
exports.createSingletonProviderClass = createSingletonProviderClass;
var DSProvider = /** @class */ (function (_super) {
    __extends(DSProvider, _super);
    function DSProvider(value) {
        return _super.call(this, DSProvider.ID, value) || this;
    }
    DSProvider.ID = "ds";
    return DSProvider;
}(base_1.Provider));
exports.DSProvider = DSProvider;
//# sourceMappingURL=index.js.map