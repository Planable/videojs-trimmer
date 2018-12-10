import videojs from "video.js";

var videojsComponent = videojs.getComponent("Component");

/**
 * This is the time panel
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
var TimePanel = videojs.extend(videojsComponent, {
  /** @constructor */
  constructor: function(player, options) {
    videojsComponent.call(this, player, options);
  },
  init_: function() {
    this.rs = this.player_.trimmer();
  },

  options_: {
    children: {
      TimePanelLeft: {},
      TimePanelRight: {}
    }
  },

  createEl: function() {
    return videojsComponent.prototype.createEl.call(this, "div", {
      className: "vjs-timepanel-trimmer"
    });
  }
});

videojs.registerComponent("TimePanel", TimePanel);

export default TimePanel;
