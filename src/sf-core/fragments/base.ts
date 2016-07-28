import { flattenDeep } from "lodash";

export interface IFragment {
  ns: string;
}

export class BaseFragment implements IFragment {
  constructor(readonly ns: string) { }
}

/**
 */

export interface IFactory {
  create(...rest): any;
}


/**
 * Factory fragment for creating new instances of things
 */

export class FactoryFragment extends BaseFragment implements IFactory {
  constructor(ns: string, public factory: IFactory) {
    super(ns);
  }

  create(...rest: Array<any>): any {
    return this.factory.create(...rest);
  }
}

/**
 * factory fragment for classes
 */

export class ClassFactoryFragment extends FactoryFragment {
  constructor(ns: string, clazz: { new(...rest): any }) {
    super(ns, { create: (...rest) => new clazz(...rest) });
  }
}

/**
 * Contains a collection of fragments
 */

export class FragmentDictionary {

  private _fragmentsByNs: any = {};

  constructor(...items: Array<BaseFragment>) {
    this.register(...items);
  }

  /**
   */

  get length() {
    return this.queryAll("/**").length;
  }

  /**
   * Queries for one fragment with the given namespace
   * @param {string} ns namespace to query.
   */

  query<T>(ns: string) {
    return this.queryAll<T>(ns)[0];
  }

  /**
   * queries for all fragments with the given namespace
   */

  queryAll<T>(ns: string) {
    return <T[]>(this._fragmentsByNs[ns] || []);
  }

  /**
   */

  createChild() {
    return new FragmentDictionary(...this.queryAll<any>("/**"));
  }

  /**
   */

  register(...fragments: Array<BaseFragment|Array<any>>) {

    const flattenedFragments: Array<BaseFragment> = flattenDeep(fragments);

    for (const fragment of flattenedFragments) {

        // check if the fragment already exists to ensure that there are no collisions
        if (this._fragmentsByNs[fragment.ns]) {
          throw new Error(`Fragment with namespace "${fragment.ns}" already exists.`);
        }

        // the last part of the namespace is the unique id. Example namespaces:
        // entities/text, entitiesControllers/div, components/item
        this._fragmentsByNs[fragment.ns] = [fragment];

        // store the fragment in a spot where it can be queried with globs (**).
        // This is much faster than parsing this stuff on the fly when calling query()
        const nsParts = fragment.ns.split("/");
        for (let i = 0, n = nsParts.length; i < n; i++) {
          const ns = nsParts.slice(0, i).join("/") + "/**";

          if (!this._fragmentsByNs[ns]) {
            this._fragmentsByNs[ns] = [];
          }

          this._fragmentsByNs[ns].push(fragment);
        }
    }
  }
}

