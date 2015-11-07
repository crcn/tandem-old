var React = require('react');

var Stage = React.createClass({
  getInitialState: function() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  componentDidMount: function() {
    document.addEventListener('resize', this.onResize);
  },
  onResize: function() {
    this.setState(this.getInitialState());
  },
  componentWillUnmount: function() {
    document.removeEventListener('resize', this.onResize);
  },
  render: function() {
    var w = this.state.width;
    var h = this.state.height;

    return <svg width={w} height={h} viewBox={[0, 0, w, h].join(' ')} preserveAspectRatio='none'>
      { this.props.children }
    </svg>;
  }
});

export default Stage;
