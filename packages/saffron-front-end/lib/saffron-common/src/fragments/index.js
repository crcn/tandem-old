"use strict";
;
/**
 */
class Fragment {
    constructor(ns, priority = 0) {
        this.ns = ns;
        this.priority = priority;
        this.ns = ns;
    }
}
exports.Fragment = Fragment;
/**
 */
class FactoryFragment extends Fragment {
    constructor(ns, factory, priority = 0) {
        super(ns, priority);
        this.ns = ns;
        this.factory = factory;
    }
    create(...rest) {
        return this.factory.create(...rest);
    }
}
exports.FactoryFragment = FactoryFragment;
/**
 */
class ClassFactoryFragment extends FactoryFragment {
    constructor(ns, clazz, priority = 0) {
        super(ns, { create: (...rest) => new clazz(...rest) }, priority);
    }
}
exports.ClassFactoryFragment = ClassFactoryFragment;
/**
 */
class ApplicationServiceFragment extends Fragment {
    constructor(ns, clazz, priority = 0) {
        super(ns);
        this._factory = new ClassFactoryFragment(undefined, clazz, priority);
    }
    create(app) {
        return this._factory.create();
    }
}
exports.ApplicationServiceFragment = ApplicationServiceFragment;
//# sourceMappingURL=index.js.map