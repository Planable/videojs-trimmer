import videojs from "video.js";
import { videojsRound } from "../utils";

var videojsComponent = videojs.getComponent("Component");

/**
 * This is the bar with the selection of the Trimmer
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
var SelectionBar = videojs.extend(videojsComponent, {
  /** @constructor */
  constructor: function(player, options) {
    videojsComponent.call(this, player, options);
    this.on("mouseup", this.onMouseUp);
    this.on("touchend", this.onMouseUp);
    this.fired = false;
  },

  options_: {
    children: {
      SelectionBarProgress: {}
    }
  },

  init_: function() {
    this.rs = this.player_.trimmer();
  },

  createEl: function() {
    return videojsComponent.prototype.createEl.call(this, "div", {
      className: "vjs-selectionbar-trimmer"
    });
  },

  onMouseUp: function() {
    var start = this.rs.left.el_.style.left.replace("%", ""),
      end = this.rs.right.el_.style.left.replace("%", ""),
      duration = this.player_.duration(),
      precision = this.rs.updatePrecision,
      segStart = videojsRound((start * duration) / 100, precision),
      segEnd = videojsRound((end * duration) / 100, precision);
    this.player_.currentTime(segStart);
    this.player_.play();
    this.rs.bar.activatePlay(segStart, segEnd);
  },

  updateLeft: function(left) {
    var rightVal =
      this.rs.right.el_.style.left != "" ? this.rs.right.el_.style.left : 100;
    var right = parseFloat(rightVal) / 100;

    var width = videojsRound(right - left, this.rs.updatePrecision); //round necessary for not get 0.6e-7 for example that it's not able for the html css width

    //(right+0.00001) is to fix the precision of the css in html
    if (left <= right + 0.00001) {
      this.rs.bar.el_.style.left = left * 100 + "%";
      this.rs.bar.el_.style.width = width * 100 + "%";
      return true;
    }
    return false;
  },

  updateRight: function(right) {
    var leftVal =
      this.rs.left.el_.style.left != "" ? this.rs.left.el_.style.left : 0;
    var left = parseFloat(leftVal) / 100;

    var width = videojsRound(right - left, this.rs.updatePrecision); //round necessary for not get 0.6e-7 for example that it's not able for the html css width

    //(right+0.00001) is to fix the precision of the css in html
    if (right + 0.00001 >= left) {
      this.rs.bar.el_.style.width = width * 100 + "%";
      this.rs.bar.el_.style.left = (right - width) * 100 + "%";
      return true;
    }
    return false;
  },

  activatePlay: function(start, end) {
    this.timeStart = start;
    this.timeEnd = end;

    this.suspendPlay();

    this.player_.on("timeupdate", videojs.bind(this, this._processPlay));
  },

  suspendPlay: function() {
    this.fired = false;
    this.player_.off("timeupdate", videojs.bind(this, this._processPlay));
  },

  _processPlay: function() {
    //Check if current time is between start and end
    if (
      this.player_.currentTime() >= this.timeStart &&
      (this.timeEnd < 0 || this.player_.currentTime() < this.timeEnd)
    ) {
      if (this.fired) {
        //Do nothing if start has already been called
        return;
      }
      this.fired = true; //Set fired flag to true
    } else {
      if (!this.fired) {
        //Do nothing if end has already been called
        return;
      }
      this.fired = false; //Set fired flat to false
      this.player_.pause(); //Call end function
      this.player_.currentTime(this.timeEnd);
      this.suspendPlay();
    }
  },

  process_loop: function() {
    var player = this.player;
    console.log("porcess");
    this.SelectionBarProgress.update();

    if (player && this.looping) {
      var current_time = player.currentTime();

      if (
        current_time < this.timeStart ||
        (this.timeEnd > 0 && this.timeEnd < current_time)
      ) {
        player.currentTime(this.timeStart);
      }
    }
  }
});

videojs.registerComponent("SelectionBar", SelectionBar);

export default SelectionBar;
