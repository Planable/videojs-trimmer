import videojs from "video.js";

var videojsComponent = videojs.getComponent("Component");

/**
 * Range Slider Time Bar
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
var RSTimeBar = videojs.extend(videojsComponent, {
  /** @constructor */
  constructor: function(player, options) {
    videojsComponent.call(this, player, options);
  },
  init_: function() {
    this.rs = this.player_.trimmer();
  },

  options_: {
    children: {
      SeekRSBar: {}
    }
  },

  createEl: function() {
    return videojsComponent.prototype.createEl.call(this, "div", {
      className: "vjs-timebar-trimmer",
      innerHTML: ""
    });
  }
});

videojs.registerComponent("RSTimeBar", RSTimeBar);

export default RSTimeBar;
