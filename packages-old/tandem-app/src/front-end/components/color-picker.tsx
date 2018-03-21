
    .color-picker {
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      position: relative;
      display: inline-block;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border: 1px solid var(--background-highlight);
    }

    .top {
      display: flex;
      flex-direction: column;
    }

    #pallete {
      position: relative;
      box-sizing: border-box;
      display: inline-block;
    }

    #spectrum {
      display: inline-block;
    }
    canvas {
      border-radius: 2px;
    }

    .inputs {
      display: flex;
      width: 100%;
    }

    input {
      border: 1px solid var(--border-color);
      border-radius: 2px;
      height: 30px;
      padding: 0px 8px;
      width: 100%;
    }

    .dropper {
      left: 0;
      top: 0;
      display: inline-block;
      box-shadow: 0px 0px 0px 1px #000;
      cursor: pointer;
      box-sizing: border-box;
      border: 1px solid white;
      position: absolute;
      width: var(--base11);
      height: var(--base11);
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    
    .controls {
      flex: 1;
    }

    .needle {
      width: var(--base6);
      height: 30px;
      background: white;
      box-shadow: 0px 0px 0px 1px #000;
      border: 1px solid white;
      border-radius: 2px;
      position: absolute;
      transform: translate(-50%);
      top: -1px;
      left: 0;
    }
    

    .presets {
      flex-grow: 0;
      height: 20px;
    }

    .preset {
      border-radius: 2px;
      width: var(--base4);
      height: var(--base4);
      display: inline-block;
      margin: var(--base2);
      margin-left: 0px;
    }

    td-draggable {
      position: relative;
      margin-bottom: 8px;
      float: left;
    }

    td-slider canvas {
      height: 20px;
    }
    

  </style>
  <script type="text/typescript">

    const dispatch = (event) => {
      const { color, dragging } = this.state;
      this.state = reduceState(this.state, event);
      if (dragging && !this.state.dragging) {
        this.dispatch({ type: "VALUE_CHANGED", value: color });
      }
    }

    const reduceState = (state = {}, event) => {
      switch(event.type) {
        case "HSL_PICKER_EVENT": {
          return hslPickerReducer(state, event.event);
        }
        case "HUE_PICKER_EVENT": {
          return huePickerReducer(state, event.event);
        }
        case "OPACITY_PICKER_EVENT": {
          return opacityPickerReducer(state, event.event);
        }
        case "INPUT_CHANGED": {
          const { color } = event;
          return updateColor(color, state, colorToRgba(color)[3]);
        }
        case "PROP_CHANGED": {
          const { name, value } = event;
          if (name === "color") {
            return {
              ...state,
              ...updateColor(value, state, colorToRgba(value)[3])
            };
          }
        }
      }
      return state;
    };

    const hslPickerReducer = (state, event) => {
      switch(event.type) {
        case "DRAG": {
          const { color, hue } = state;
          const { point, bounds, nativeEvent } = event;
          const canvas = this.hslPicker.getContext('2d');
          const p = canvas.getImageData(Math.min(point.left, this.hslPicker.width - 1), point.top, 1, 1).data;
          const hsl = rgbToHsl(...p);
          return {
            ...state,
            ...updateColor(rgbToHex(hslToRgb(hue, hsl[1], hsl[2])), state),
            dropperPoint: point,
            hue,
            dragging: true
          }
        }
        case "DRAG_STOP": {
          return {
            ...state,
            dragging: false
          }
        }
      }
      return state;
    }

    const huePickerReducer = (state, event) => {
      switch(event.type) {
        case "DRAG": {
          const { color } = state;
          const { point, bounds, nativeEvent } = event;
          const hue = point.left / bounds.width;
          const hsl = getColorHSL(color);
          return {
            ...state,
            ...updateColor(rgbToHex(hslToRgb(hue, hsl[1], hsl[2])), state),
            hue,
            dragging: true
          }
        }
        case "DRAG_STOP": {
          return {
            ...state,
            dragging: false
          }
        }
      }
      return state;
    }

    const opacityPickerReducer = (state, event) => {
      switch(event.type) {
        case "DRAG": {
          const { color } = state;
          const { point, bounds, nativeEvent } = event;
          return {
            ...state,
            ...updateColor(color, state, point.left / bounds.width),
            dragging: true
          };
        }
        case "DRAG_STOP": {
          return {
            ...state,
            dragging: false
          }
        }
      }
      return state;
    }

    const rgbToHex = (rgb) => {
      var v = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
      return '#' + (0x1000000 + v).toString(16).slice(1)
    }
    const colorToRgba = (color) => {
      if (color.indexOf("rgba") !== -1) {
        return (color.match(/[\d\.]+/g) || [0, 0, 0, 1]).map(Number);
      }
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        1
       ] : [0, 0, 0, 1];
    };

    const rgbToHsl = (r, g, b) => {
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if (max == min) {
          h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return [h, s, l];
    };

    function hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    const updateColor = (hex, state, opacity) => {

      let newColor;

      if (!opacity) {
        opacity = colorToRgba(state.color)[3];
      }

      if (opacity === 1) {
        newColor = hex;
      } else {
        const rgba = colorToRgba(hex);
        newColor = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${opacity && opacity.toFixed(2)})`;
      }

      return {
        ...state,
        color: newColor,
        hue: getColorHSL(newColor)[0]
      }
    }

    const getColorHSL = (color) => rgbToHsl(...colorToRgba(color));

    const getOpacity = () => {
      return colorToRgba(this.state.color)[3];
    }

    const drawHSL = (hue) => {
      var ctx = this.hslPicker.getContext('2d');
      const { width, height } = this;
      
      for(var row = 0; row <= height; row++) {
        var grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(1, `hsl(${hue}, 0%, ${((height - row) / height) * 100}%)`);
        grad.addColorStop(0, `hsl(${hue}, 100%, ${((height - row) / height) * 50}%)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, row, width, 1);
      }
    };
    
    const drawSpectrum = () => {
      var ctx = this.spectrumPicker.getContext('2d');
      const { width } = this;
      for (var row = 0; row <= width; row++) {
        ctx.fillStyle = `hsl(${((row - width) / width) * 360}, 100%, 50%)`;
        ctx.fillRect(row, 0, 1,  this.spectrumPicker.height);
      }
    }

    const drawOpacity = () => {
      var ctx = this.opacityPicker.getContext('2d');
      const { width } = this;
      for (var row = 0; row <= width; row++) {
        ctx.fillStyle = `hsl(${this.state.hue * 360}, 100%, ${((width - row)/width) * 50 + 50}%)`;
        ctx.fillRect(row, 0, 1,  this.spectrumPicker.height);
      }
    }

    const rgbToHsv = (r, g, b) => {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var rr, gg, bb,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            }else if (g === v) {
                h = (1 / 3) + rr - bb;
            }else if (b === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }else if (h > 1) {
                h -= 1;
            }
        }
        return [
          h,
          s,
          v
        ];
    }

    const draw = () => {
      drawHSL(this.state.hue * 360);
      drawSpectrum();
      drawOpacity();
    };

    const onInputFocus = (event) => {
      event.target.select();
    }

    const onInputChange = ({ target }) => {
      setTimeout(() => {
        const color = (target.value || "").trim();
        const rgb = colorToRgba(color);
        if (!rgb) {
          return;
        }

        dispatch({ type: "INPUT_CHANGED", color });
      });
    }

    let color;

    const update = () => {
      draw();
    };

    const resetInputs = () => {
      updateColorPoint();
      //this.hue = getColorHSL()[0];
    };

    // TODO
    const updateColorPoint = () => {
      if (this.state.color) {
        const [h, s, v] = rgbToHsv(...colorToRgba(this.state.color));
        this.dropperPoint = {
          left: (1 - s) * 100 + "%",
          top: (1 - v) * 100 + "%"
        }
      }
    }

    this.propertyChangedCallback = (name, oldValue, value) => {
      dispatch({ type: "PROP_CHANGED", name, value });
    }

    this.didMount = update;
    this.didUpdate = update;
    
    this.state = {
      dropperPoint: {},
      color: this.value,
      hue: getColorHSL(this.value)[0]
    };