import videojs from "video.js";

var videojsComponent = videojs.getComponent("Component");

/**
 * This is the control right time panel
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
var ControlTimePanelRight = videojs.extend(videojsComponent, {
  /** @constructor */
  constructor: function(player, options) {
    videojsComponent.call(this, player, options);
    this.on("keyup", this.onKeyUp);
    this.on("keydown", this.onKeyDown);
  },
  init_: function() {
    this.rs = this.player_.trimmer();
    this.timeOld = {};
  },

  createEl: function() {
    return videojsComponent.prototype.createEl.call(this, "div", {
      className: "vjs-controltimepanel-right-trimmer",
      innerHTML:
        'End: <input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>'
    });
  },

  onKeyDown: function(event) {
    this.timeOld[0] = this.el_.children[0].value;
    this.timeOld[1] = this.el_.children[1].value;
    this.timeOld[2] = this.el_.children[2].value;
  },

  onKeyUp: function(event) {
    this.rs._checkControlTime(1, this.el_.children, this.timeOld);
  }
});

videojs.registerComponent("ControlTimePanelRight", ControlTimePanelRight);

export default ControlTimePanelRight;
