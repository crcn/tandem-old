export function create(...propNames) {
  return {
    shouldComponentUpdate(props) {
      return this._hasChanges;
    },

    componentWillReceiveProps(props, state) {
      if (!this._updateCounts) this._updateCounts = {};

      var uc = {};
      var hasChanges = false;

      for (var i = 0, n = propNames.length; i < n; i++) {
        var pn = propNames[i];

        if (this._updateCounts[pn] !== (uc[pn] = props[pn]._updateCount)) {
          hasChanges = true;
        }
      }

      if (state._updateCount !== this._updateCounts.state._updateCount) {
        hasChanges = true;
      }

      this._updateCounts = uc;
      this._hasChanges   = true;
      return hasChanges;
    },

    setState(state) {
      state._updateCount = (this.state._updateCount || 0) + 1;
      return super.setState(state);
    }
  }
}