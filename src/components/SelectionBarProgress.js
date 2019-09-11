import videojs from "video.js";
import { videojsRound } from "../utils";

var videojsComponent = videojs.getComponent("Component");

/**
 * This is the bar with the selection of the Trimmer
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
var SelectionBarProgress = videojs.extend(videojsComponent, {
  /** @constructor */
  constructor: function(player, options) {
    videojsComponent.call(this, player, options);
  },

  init_: function() {
    this.rs = this.player_.trimmer();
  },

  createEl: function() {
    return videojsComponent.prototype.createEl.call(this, "div", {
      className: "vjs-selectionbar-progress-trimmer vjs-play-progress"
    });
  },

  update: function(left, right) {
    var rightVal =
      this.rs.right.el_.style.left != "" ? this.rs.right.el_.style.left : 100;
    var right = parseFloat(rightVal) / 100;

    var leftVal =
      this.rs.left.el_.style.left != "" ? this.rs.left.el_.style.left : 0;
    var left = parseFloat(leftVal) / 100;

    const currentTime = this.player_.currentTime();
    const duration = this.player_.duration();
    const current = currentTime / duration;

    const width = (current - left) / (right - left);
    this.rs.barProgress.el_.style.width = `${width * 100}%`;
  }
});

videojs.registerComponent("SelectionBarProgress", SelectionBarProgress);

export default SelectionBarProgress;
