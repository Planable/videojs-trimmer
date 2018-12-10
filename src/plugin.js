// @ts-check

import videojs from "video.js";
import { version as VERSION } from "../package.json";
import { videojsAddClass, videojsRound, videojsRemoveClass } from "./utils.js";
import "./components";

const Plugin = videojs.getPlugin("plugin");

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class Trimmer extends Plugin {
  /**
   * Create a Trimmer plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);
    if (!this.options.hasOwnProperty("locked")) this.options.locked = false; // lock slider handles

    if (!this.options.hasOwnProperty("hidden")) this.options.hidden = true; // hide slider handles

    if (!this.options.hasOwnProperty("panel")) this.options.panel = true; // Show Second Panel

    if (!this.options.hasOwnProperty("controlTime"))
      this.options.controlTime = true; // Show Control Time to set the arrows in the edition

    this.components = {}; // holds any custom components we add to the player

    this.player.ready(() => {
      this.player.addClass("vjs-trimmer");
    });

    this.init();

    ///

    const initialVideoFinished = () => {
      const plugin = this;
      //All components will be initialize after they have been loaded by videojs
      for (var index in plugin.components) {
        plugin.components[index].init_();
      }

      this.player.on("timeupdate", () => {
        this.barProgress.update();
      });

      if (plugin.options.hidden) plugin.hide(); //Hide the Range Slider

      if (plugin.options.locked) plugin.lock(); //Lock the Range Slider

      if (plugin.options.panel == false) plugin.hidePanel(); //Hide the second Panel

      if (plugin.options.controlTime == false) plugin.hidecontrolTime(); //Hide the control time panel

      plugin._reset();
      player.trigger("loadedRangeSlider"); //Let know if the Range Slider DOM is ready
    };

    if (player.techName == "Youtube") {
      //Detect youtube problems
      player.one("error", function(e) {
        switch (player.error) {
          case 2:
            alert(
              "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks."
            );
          case 5:
            alert(
              "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred."
            );
          case 100:
            alert(
              "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private."
            );
            break;
          case 101:
            alert(
              "The owner of the requested video does not allow it to be played in embedded players."
            );
            break;
          case 150:
            alert(
              "The owner of the requested video does not allow it to be played in embedded players."
            );
            break;
          default:
            alert("Unknown Error");
            break;
        }
      });
      player.on("firstplay", initialVideoFinished);
    } else {
      player.one("playing", initialVideoFinished);
    }
  }
  /*Constructor*/
  init() {
    var player = this.player || {};

    this.updatePrecision = 3;

    //position in second of the arrows
    this.start = 0;
    this.end = 0;

    //components of the plugin
    var controlBar = player.controlBar;
    var seekBar = controlBar.progressControl.seekBar;

    // Add child components here
    const rsTimeBar = seekBar.addChild("RSTimeBar");
    const controlTimePanel = controlBar.addChild("ControlTimePanel");
    //

    this.components.RSTimeBar = rsTimeBar;
    this.components.ControlTimePanel = controlTimePanel;

    //Save local component
    this.rstb = this.components.RSTimeBar;
    this.box = this.components.SeekRSBar = this.rstb.SeekRSBar;

    this.bar = this.components.SelectionBar = this.box.SelectionBar;
    this.barProgress = this.components.SelectionBarProgress = this.bar.SelectionBarProgress;
    this.left = this.components.SelectionBarLeft = this.box.SelectionBarLeft;
    this.right = this.components.SelectionBarRight = this.box.SelectionBarRight;

    this.tp = this.components.TimePanel = this.box.TimePanel;
    this.tpl = this.components.TimePanelLeft = this.tp.TimePanelLeft;
    this.tpr = this.components.TimePanelRight = this.tp.TimePanelRight;

    this.ctp = this.components.ControlTimePanel;
    this.ctpl = this.components.ControlTimePanelLeft = this.ctp.ControlTimePanelLeft;
    this.ctpr = this.components.ControlTimePanelRight = this.ctp.ControlTimePanelRight;
  }

  lock() {
    this.options.locked = true;
    this.ctp.enable(false);
    if (typeof this.box != "undefined") videojsAddClass(this.box.el_, "locked");
  }

  unlock() {
    this.options.locked = false;
    this.ctp.enable();
    if (typeof this.box != "undefined")
      videojsRemoveClass(this.box.el_, "locked");
  }

  show() {
    this.options.hidden = false;
    if (typeof this.rstb != "undefined") {
      this.rstb.show();
      if (this.options.controlTime) this.showcontrolTime();
    }
  }

  hide() {
    this.options.hidden = true;
    if (typeof this.rstb != "undefined") {
      this.rstb.hide();
      this.ctp.hide();
    }
  }

  showPanel() {
    this.options.panel = true;
    if (typeof this.tp != "undefined")
      videojsRemoveClass(this.tp.el_, "disable");
  }

  hidePanel() {
    this.options.panel = false;
    if (typeof this.tp != "undefined") videojsAddClass(this.tp.el_, "disable");
  }

  showcontrolTime() {
    this.options.controlTime = true;
    if (typeof this.ctp != "undefined") this.ctp.show();
  }

  hidecontrolTime() {
    this.options.controlTime = false;
    if (typeof this.ctp != "undefined") this.ctp.hide();
  }

  setValue(index, seconds, writeControlTime) {
    //index = 0 for the left Arrow and 1 for the right Arrow. Value in seconds
    var writeControlTime =
      typeof writeControlTime != "undefined" ? writeControlTime : true;

    var percent = this._percent(seconds);
    var isValidIndex = index === 0 || index === 1;
    var isChangeable = !this.locked;
    if (isChangeable && isValidIndex)
      this.box.setPosition(index, percent, writeControlTime);
  }

  setValues(start, end, writeControlTime) {
    //index = 0 for the left Arrow and 1 for the right Arrow. Value in seconds
    var writeControlTime =
      typeof writeControlTime != "undefined" ? writeControlTime : true;

    this._reset();

    this._setValuesLocked(start, end, writeControlTime);
  }

  getValues() {
    //get values in seconds
    var values = {},
      start,
      end;
    start = this.start || this._getArrowValue(0);
    end = this.end || this._getArrowValue(1);
    return { start: start, end: end };
  }

  playBetween(start, end, setTimeAt, showRS) {
    showRS = typeof showRS == "undefined" ? true : showRS;

    this.player.currentTime(setTimeAt);
    this.player.play();

    if (showRS) {
      this.show();
      this._reset();
    } else {
      this.hide();
    }
    this._setValuesLocked(start, end);

    this.bar.activatePlay(start, end);
  }

  loop(start, end, setTimeAt, show) {
    var player = this.player;

    if (player) {
      player.on(
        "pause",
        videojs.bind(this, function() {
          this.looping = false;
        })
      );

      show = typeof show === "undefined" ? true : show;

      if (show) {
        this.show();
        this._reset();
      } else {
        this.hide();
      }
      this._setValuesLocked(start, end);

      this.timeStart = start;
      this.timeEnd = end;
      this.looping = true;

      this.player.currentTime(setTimeAt);
      this.player.play();

      this.player.on("timeupdate", videojs.bind(this, this.bar.process_loop));
    }
  }

  _getArrowValue(inpIndex) {
    var index = inpIndex || 0;
    var duration = this.player.duration();

    duration = typeof duration == "undefined" ? 0 : duration;

    var percentage = this[
      index === 0 ? "left" : "right"
    ].el_.style.left.replace("%", "");
    if (percentage == "") percentage = index === 0 ? 0 : 100;

    return videojsRound(
      this._seconds(percentage / 100),
      this.updatePrecision - 1
    );
  }

  _percent(seconds) {
    var duration = this.player.duration();
    if (isNaN(duration)) {
      return 0;
    }
    return Math.min(1, Math.max(0, seconds / duration));
  }

  _seconds(percent) {
    var duration = this.player.duration();
    if (isNaN(duration)) {
      return 0;
    }
    return Math.min(duration, Math.max(0, percent * duration));
  }

  _reset() {
    var duration = this.player.duration();
    this.tpl.el_.style.left = "0%";
    this.tpr.el_.style.left = "100%";
    this._setValuesLocked(0, duration);
  }

  _setValuesLocked(start, end, writeControlTime) {
    var triggerSliderChange = typeof writeControlTime != "undefined";
    var writeControlTime =
      typeof writeControlTime != "undefined" ? writeControlTime : true;
    if (this.options.locked) {
      this.unlock(); //It is unlocked to change the bar position. In the end it will return the value.
      this.setValue(0, start, writeControlTime);
      this.setValue(1, end, writeControlTime);
      this.lock();
    } else {
      this.setValue(0, start, writeControlTime);
      this.setValue(1, end, writeControlTime);
    }

    // Trigger slider change
    if (triggerSliderChange) {
      this._triggerSliderChange();
    }
  }

  _checkControlTime(index, TextInput, timeOld) {
    var h = TextInput[0],
      m = TextInput[1],
      s = TextInput[2],
      newHour = h.value,
      newMin = m.value,
      newSec = s.value,
      obj,
      objNew,
      objOld;
    index = index || 0;

    if (newHour != timeOld[0]) {
      obj = h;
      objNew = newHour;
      objOld = timeOld[0];
    } else if (newMin != timeOld[1]) {
      obj = m;
      objNew = newMin;
      objOld = timeOld[1];
    } else if (newSec != timeOld[2]) {
      obj = s;
      objNew = newSec;
      objOld = timeOld[2];
    } else {
      return false;
    }

    var duration = this.player.duration() || 0,
      durationSel;

    var intRegex = /^\d+$/; //check if the objNew is an integer
    if (!intRegex.test(objNew) || objNew > 60) {
      objNew = objNew == "" ? "" : objOld;
    }

    newHour = newHour == "" ? 0 : newHour;
    newMin = newMin == "" ? 0 : newMin;
    newSec = newSec == "" ? 0 : newSec;

    durationSel = videojs.TextTrack.prototype.parseCueTime(
      newHour + ":" + newMin + ":" + newSec
    );
    if (durationSel > duration) {
      obj.value = objOld;
      obj.style.border = "1px solid red";
    } else {
      obj.value = objNew;
      h.style.border = m.style.border = s.style.border =
        "1px solid transparent";
      this.setValue(index, durationSel, false);

      // Trigger slider change
      this._triggerSliderChange();
    }
    if (index === 1) {
      var oldTimeLeft = this.ctpl.el_.children,
        durationSelLeft = videojs.TextTrack.prototype.parseCueTime(
          oldTimeLeft[0].value +
            ":" +
            oldTimeLeft[1].value +
            ":" +
            oldTimeLeft[2].value
        );
      if (durationSel < durationSelLeft) {
        obj.style.border = "1px solid red";
      }
    } else {
      var oldTimeRight = this.ctpr.el_.children,
        durationSelRight = videojs.TextTrack.prototype.parseCueTime(
          oldTimeRight[0].value +
            ":" +
            oldTimeRight[1].value +
            ":" +
            oldTimeRight[2].value
        );
      if (durationSel > durationSelRight) {
        obj.style.border = "1px solid red";
      }
    }
  }

  _triggerSliderChange(side) {
    this.player.trigger({ type: "sliderchange", side: side });
  }
}

// Define default values for the plugin's `state` object here.
Trimmer.defaultState = {};

// Include the version number.
Trimmer.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin("trimmer", Trimmer);

export default Trimmer;
