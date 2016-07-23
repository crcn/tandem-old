// TODO - ability to remove fragments
// possibly make querying more sophisticated

export class BaseFragment {
  constructor(public ns: string) {

  }
}

/**
 * Contains a collection of fragments
 */

export class FragmentDictionary {

  private _fragmentsByNs: any = {};

  constructor(...items: Array<BaseFragment>) {
    items.forEach(this.register);
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

  register = (fragment: BaseFragment) => {

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

