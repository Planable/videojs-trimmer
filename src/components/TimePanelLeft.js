import videojs from "video.js";

var videojsComponent = videojs.getComponent("Component");

/**
 * This is the left time panel
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
var TimePanelLeft = videojs.extend(videojsComponent, {
  /** @constructor */
  constructor: function(player, options) {
    videojsComponent.call(this, player, options);
  },
  init_: function() {
    this.rs = this.player_.trimmer();
  },

  createEl: function() {
    return videojsComponent.prototype.createEl.call(this, "div", {
      className: "vjs-timepanel-left-trimmer",
      innerHTML: '<span class="vjs-time-text">00:00</span>'
    });
  }
});

videojs.registerComponent("TimePanelLeft", TimePanelLeft);

export default TimePanelLeft;
