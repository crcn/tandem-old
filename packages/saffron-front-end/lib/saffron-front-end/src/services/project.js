"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const loggable_1 = require('saffron-common/src/decorators/loggable');
const public_1 = require('saffron-common/src/actors/decorators/public');
const sift = require('sift');
const observable_1 = require('saffron-common/src/decorators/observable');
const collection_1 = require('saffron-common/src/object/collection');
const ArrayDsBus = require('mesh-array-ds-bus');
const base_application_service_1 = require('saffron-common/src/services/base-application-service');
const mesh_1 = require('mesh');
const index_1 = require('saffron-common/src/fragments/index');
const index_2 = require('saffron-common/src/actions/index');
let Projects = class Projects extends collection_1.default {
};
Projects = __decorate([
    observable_1.default
], Projects);
const COLLECTION_NAME = 'files';
let ProjectService = class ProjectService extends base_application_service_1.default {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            var createModel = (data) => {
                return this.app
                    .fragments
                    .query(`models/${data.ext}-file`)
                    .create(Object.assign({}, data, {
                    fragments: this.app.fragments,
                    app: this.app,
                    bus: this.bus
                }));
            };
            this.app.setProperties({
                projects: this._projects = new Projects((yield this.bus.execute(new index_2.FindAllAction(COLLECTION_NAME)).readAll()).map(createModel))
            });
            this._projectsBus = mesh_1.AcceptBus.create(sift({ collectionName: COLLECTION_NAME }), ArrayDsBus.create(this._projects, {
                remove() { },
                update: (model, data) => {
                    model.setProperties(data);
                    if (model === this.app.currentFile) {
                        model.load();
                    }
                    return model;
                },
                insert: createModel
            }), undefined);
            this.logger.info('loaded %d files', this._projects.length);
            if (this._projects.length) {
                this._projects[0].load();
                this.app.setProperties({
                    currentFile: this._projects[0]
                });
            }
        });
    }
    remove(action) {
        return this._projectsBus.execute(action);
    }
    update(action) {
        return this._projectsBus.execute(action);
    }
};
__decorate([
    public_1.default
], ProjectService.prototype, "remove", null);
__decorate([
    public_1.default
], ProjectService.prototype, "update", null);
ProjectService = __decorate([
    loggable_1.default
], ProjectService);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProjectService;
exports.fragment = new index_1.ApplicationServiceFragment('application/services/project', ProjectService);
//# sourceMappingURL=project.js.map