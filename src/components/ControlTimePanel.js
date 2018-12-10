import videojs from "video.js";

var videojsComponent = videojs.getComponent("Component");

/**
 * This is the control time panel
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
var ControlTimePanel = videojs.extend(videojsComponent, {
  /** @constructor */
  constructor: function(player, options) {
    videojsComponent.call(this, player, options);
  },
  init_: function() {
    this.rs = this.player_.trimmer();
  },

  options_: {
    children: {
      ControlTimePanelLeft: {},
      ControlTimePanelRight: {}
    }
  },

  createEl: function() {
    return videojsComponent.prototype.createEl.call(this, "div", {
      className: "vjs-controltimepanel-trimmer vjs-control"
    });
  },

  enable: function(enable) {
    var enable = typeof enable != "undefined" ? enable : true;
    this.rs.ctpl.el_.children[0].disabled = enable ? "" : "disabled";
    this.rs.ctpl.el_.children[1].disabled = enable ? "" : "disabled";
    this.rs.ctpl.el_.children[2].disabled = enable ? "" : "disabled";
    this.rs.ctpr.el_.children[0].disabled = enable ? "" : "disabled";
    this.rs.ctpr.el_.children[1].disabled = enable ? "" : "disabled";
    this.rs.ctpr.el_.children[2].disabled = enable ? "" : "disabled";
  }
});

videojs.registerComponent("ControlTimePanel", ControlTimePanel);

export default ControlTimePanel;
