import videojs from "video.js";
import { videojsFormatTime, videojsBlockTextSelection } from "../utils";

var videojsSeekBar = videojs.getComponent("SeekBar");
var videojsComponent = videojs.getComponent("Component");

/**
 * Seek Range Slider Bar and holder for the selection bars
 * @param {videojs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
var SeekRSBar = videojs.extend(videojsSeekBar, {
  /** @constructor */
  constructor: function(player, options) {
    videojsComponent.call(this, player, options);
    this.on("mousedown", this.onMouseDown);
    this.on("touchstart", this.onMouseDown);
  },

  init_: function() {
    this.rs = this.player_.trimmer();
  },

  options_: {
    children: {
      SelectionBar: {},
      SelectionBarLeft: {},
      SelectionBarRight: {},
      TimePanel: {}
    }
  },

  createEl: function() {
    return videojsComponent.prototype.createEl.call(this, "div", {
      className: "vjs-trimmer-holder"
    });
  },

  onMouseDown: function(event) {
    event.preventDefault();
    videojsBlockTextSelection();

    if (!this.rs.options.locked) {
      this.on(document, "mousemove", videojs.bind(this, this.onMouseMove));
      this.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
      this.on(document, "touchmove", videojs.bind(this, this.onMouseMove));
      this.on(document, "touchend", videojs.bind(this, this.onMouseUp));
    }
  },

  onMouseUp: function(event) {
    this.off(
      document,
      "mousemove",
      videojs.bind(this, this.onMouseMove),
      false
    );
    this.off(document, "mouseup", videojs.bind(this, this.onMouseUp), false);
    this.off(
      document,
      "touchmove",
      videojs.bind(this, this.onMouseMove),
      false
    );
    this.off(document, "touchend", videojs.bind(this, this.onMouseUp), false);
  },

  onMouseMove: function(event) {
    var left = this.calculateDistance(event);

    if (this.rs.left.pressed) this.setPosition(0, left);
    else if (this.rs.right.pressed) this.setPosition(1, left);

    // Trigger slider change
    if (this.rs.left.pressed) {
      this.rs._triggerSliderChange("left");
    } else if (this.rs.right.pressed) {
      this.rs._triggerSliderChange("right");
    }
  },

  setPosition: function(index, left, writeControlTime) {
    var writeControlTime =
      typeof writeControlTime != "undefined" ? writeControlTime : true;
    //index = 0 for left side, index = 1 for right side
    index = index || 0;

    // Position shouldn't change when handle is locked
    if (this.rs.options.locked) return false;

    // Check for invalid position
    if (isNaN(left)) return false;

    // Check index between 0 and 1
    if (!(index === 0 || index === 1)) return false;

    // Alias
    var ObjLeft = this.rs.left.el_,
      ObjRight = this.rs.right.el_,
      Obj = this.rs[index === 0 ? "left" : "right"].el_,
      tpr = this.rs.tpr.el_,
      tpl = this.rs.tpl.el_,
      bar = this.rs.bar,
      ctp = this.rs[index === 0 ? "ctpl" : "ctpr"].el_;

    //Check if left arrow is passing the right arrow
    if (index === 0 ? bar.updateLeft(left) : bar.updateRight(left)) {
      Obj.style.left = left * 100 + "%";
      index === 0 ? bar.updateLeft(left) : bar.updateRight(left);

      this.rs[index === 0 ? "start" : "end"] = this.rs._seconds(left);

      //Fix the problem  when you press the button and the two arrow are underhand
      //left.zIndex = 10 and right.zIndex=20. This is always less in this case:
      if (index === 0) {
        if (left >= 0.9) ObjLeft.style.zIndex = 25;
        else ObjLeft.style.zIndex = 10;
      }

      //-- Panel
      var TimeText = videojsFormatTime(this.rs._seconds(left)),
        tplTextLegth = tpl.children[0].innerHTML.length;
      var MaxP, MinP, MaxDisP;
      if (tplTextLegth <= 4)
        //0:00
        MaxDisP = this.player_.isFullScreen ? 3.25 : 6.5;
      else if (tplTextLegth <= 5)
        //00:00
        MaxDisP = this.player_.isFullScreen ? 4 : 8;
      //0:00:00
      else MaxDisP = this.player_.isFullScreen ? 5 : 10;
      if (TimeText.length <= 4) {
        //0:00
        MaxP = this.player_.isFullScreen ? 97 : 93;
        MinP = this.player_.isFullScreen ? 0.1 : 0.5;
      } else if (TimeText.length <= 5) {
        //00:00
        MaxP = this.player_.isFullScreen ? 96 : 92;
        MinP = this.player_.isFullScreen ? 0.1 : 0.5;
      } else {
        //0:00:00
        MaxP = this.player_.isFullScreen ? 95 : 91;
        MinP = this.player_.isFullScreen ? 0.1 : 0.5;
      }

      if (index === 0) {
        tpl.style.left =
          Math.max(MinP, Math.min(MaxP, left * 100 - MaxDisP / 2)) + "%";

        if (
          tpr.style.left.replace("%", "") - tpl.style.left.replace("%", "") <=
          MaxDisP
        )
          tpl.style.left =
            Math.max(
              MinP,
              Math.min(MaxP, tpr.style.left.replace("%", "") - MaxDisP)
            ) + "%";
        tpl.children[0].innerHTML = TimeText;
      } else {
        tpr.style.left =
          Math.max(MinP, Math.min(MaxP, left * 100 - MaxDisP / 2)) + "%";

        if (
          (tpr.style.left.replace("%", "") || 100) -
            tpl.style.left.replace("%", "") <=
          MaxDisP
        )
          tpr.style.left =
            Math.max(
              MinP,
              Math.min(MaxP, tpl.style.left.replace("%", "") - 0 + MaxDisP)
            ) + "%";
        tpr.children[0].innerHTML = TimeText;
      }
      //-- Control Time
      if (writeControlTime) {
        var time = TimeText.split(":"),
          h,
          m,
          s;
        if (time.length == 2) {
          h = 0;
          m = time[0];
          s = time[1];
        } else {
          h = time[0];
          m = time[1];
          s = time[2];
        }
        ctp.children[0].value = h;
        ctp.children[1].value = m;
        ctp.children[2].value = s;
      }
    }
    return true;
  }
});

videojs.registerComponent("SeekRSBar", SeekRSBar);

export default SeekRSBar;
