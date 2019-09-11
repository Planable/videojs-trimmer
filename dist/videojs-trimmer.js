/*! @name videojs-trimmer @version 0.1.2 @license UNLICENSED */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
  typeof define === 'function' && define.amd ? define(['video.js'], factory) :
  (global.videojsTrimmer = factory(global.videojs));
}(this, (function (videojs) { 'use strict';

  videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var version = "0.1.2";

  var videojsAddClass = function videojsAddClass(element, className) {
    element.classList.add(className);
  };
  var videojsRemoveClass = function videojsRemoveClass(element, className) {
    element.classList.remove(className);
  };
  var videojsRound = function videojsRound(n, precision) {
    return parseFloat(n.toFixed(precision));
  };
  var videojsFormatTime = function videojsFormatTime(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60).toFixed(0);
    var seconds = (totalSeconds % 60).toFixed(0);

    if (seconds.length === 1) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  };

  var videojsComponent = videojs.getComponent("Component");
  /**
   * This is the control time panel
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var ControlTimePanel = videojs.extend(videojsComponent, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent.call(this, player, options);
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    options_: {
      children: {
        ControlTimePanelLeft: {},
        ControlTimePanelRight: {}
      }
    },
    createEl: function createEl() {
      return videojsComponent.prototype.createEl.call(this, "div", {
        className: "vjs-controltimepanel-trimmer vjs-control"
      });
    },
    enable: function enable(_enable) {
      var _enable = typeof _enable != "undefined" ? _enable : true;

      this.rs.ctpl.el_.children[0].disabled = _enable ? "" : "disabled";
      this.rs.ctpl.el_.children[1].disabled = _enable ? "" : "disabled";
      this.rs.ctpl.el_.children[2].disabled = _enable ? "" : "disabled";
      this.rs.ctpr.el_.children[0].disabled = _enable ? "" : "disabled";
      this.rs.ctpr.el_.children[1].disabled = _enable ? "" : "disabled";
      this.rs.ctpr.el_.children[2].disabled = _enable ? "" : "disabled";
    }
  });
  videojs.registerComponent("ControlTimePanel", ControlTimePanel);

  var videojsComponent$1 = videojs.getComponent("Component");
  /**
   * This is the control left time panel
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var ControlTimePanelLeft = videojs.extend(videojsComponent$1, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$1.call(this, player, options);
      this.on("keyup", this.onKeyUp);
      this.on("keydown", this.onKeyDown);
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
      this.timeOld = {};
    },
    createEl: function createEl() {
      return videojsComponent$1.prototype.createEl.call(this, "div", {
        className: "vjs-controltimepanel-left-trimmer",
        innerHTML: 'Start: <input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>'
      });
    },
    onKeyDown: function onKeyDown(event) {
      this.timeOld[0] = this.el_.children[0].value;
      this.timeOld[1] = this.el_.children[1].value;
      this.timeOld[2] = this.el_.children[2].value;
    },
    onKeyUp: function onKeyUp(event) {
      this.rs._checkControlTime(0, this.el_.children, this.timeOld);
    }
  });
  videojs.registerComponent("ControlTimePanelLeft", ControlTimePanelLeft);

  var videojsComponent$2 = videojs.getComponent("Component");
  /**
   * This is the control right time panel
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var ControlTimePanelRight = videojs.extend(videojsComponent$2, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$2.call(this, player, options);
      this.on("keyup", this.onKeyUp);
      this.on("keydown", this.onKeyDown);
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
      this.timeOld = {};
    },
    createEl: function createEl() {
      return videojsComponent$2.prototype.createEl.call(this, "div", {
        className: "vjs-controltimepanel-right-trimmer",
        innerHTML: 'End: <input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>:<input type="text" id="controltimepanel" maxlength="2" value="00"/>'
      });
    },
    onKeyDown: function onKeyDown(event) {
      this.timeOld[0] = this.el_.children[0].value;
      this.timeOld[1] = this.el_.children[1].value;
      this.timeOld[2] = this.el_.children[2].value;
    },
    onKeyUp: function onKeyUp(event) {
      this.rs._checkControlTime(1, this.el_.children, this.timeOld);
    }
  });
  videojs.registerComponent("ControlTimePanelRight", ControlTimePanelRight);

  var videojsComponent$3 = videojs.getComponent("Component");
  /**
   * Range Slider Time Bar
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var RSTimeBar = videojs.extend(videojsComponent$3, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$3.call(this, player, options);
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    options_: {
      children: {
        SeekRSBar: {}
      }
    },
    createEl: function createEl() {
      return videojsComponent$3.prototype.createEl.call(this, "div", {
        className: "vjs-timebar-trimmer",
        innerHTML: ""
      });
    }
  });
  videojs.registerComponent("RSTimeBar", RSTimeBar);

  var videojsSeekBar = videojs.getComponent("SeekBar");
  var videojsComponent$4 = videojs.getComponent("Component");
  /**
   * Seek Range Slider Bar and holder for the selection bars
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var SeekRSBar = videojs.extend(videojsSeekBar, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$4.call(this, player, options);
      this.on("mousedown", this.onMouseDown);
      this.on("touchstart", this.onMouseDown);
    },
    init_: function init_() {
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
    createEl: function createEl() {
      return videojsComponent$4.prototype.createEl.call(this, "div", {
        className: "vjs-trimmer-holder"
      });
    },
    onMouseDown: function onMouseDown(event) {
      event.preventDefault();

      if (!this.rs.options.locked) {
        this.on(document, "mousemove", videojs.bind(this, this.onMouseMove));
        this.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
        this.on(document, "touchmove", videojs.bind(this, this.onMouseMove));
        this.on(document, "touchend", videojs.bind(this, this.onMouseUp));
      }
    },
    onMouseUp: function onMouseUp(event) {
      this.off(document, "mousemove", videojs.bind(this, this.onMouseMove), false);
      this.off(document, "mouseup", videojs.bind(this, this.onMouseUp), false);
      this.off(document, "touchmove", videojs.bind(this, this.onMouseMove), false);
      this.off(document, "touchend", videojs.bind(this, this.onMouseUp), false);
    },
    onMouseMove: function onMouseMove(event) {
      var left = this.calculateDistance(event);
      if (this.rs.left.pressed) this.setPosition(0, left);else if (this.rs.right.pressed) this.setPosition(1, left); // Trigger slider change

      if (this.rs.left.pressed) {
        this.rs._triggerSliderChange("left");
      } else if (this.rs.right.pressed) {
        this.rs._triggerSliderChange("right");
      }
    },
    setPosition: function setPosition(index, left, writeControlTime) {
      var writeControlTime = typeof writeControlTime != "undefined" ? writeControlTime : true; //index = 0 for left side, index = 1 for right side

      index = index || 0; // Position shouldn't change when handle is locked

      if (this.rs.options.locked) return false; // Check for invalid position

      if (isNaN(left)) return false; // Check index between 0 and 1

      if (!(index === 0 || index === 1)) return false; // Alias

      var ObjLeft = this.rs.left.el_,
          ObjRight = this.rs.right.el_,
          Obj = this.rs[index === 0 ? "left" : "right"].el_,
          tpr = this.rs.tpr.el_,
          tpl = this.rs.tpl.el_,
          bar = this.rs.bar,
          ctp = this.rs[index === 0 ? "ctpl" : "ctpr"].el_; //Check if left arrow is passing the right arrow

      if (index === 0 ? bar.updateLeft(left) : bar.updateRight(left)) {
        Obj.style.left = left * 100 + "%";
        index === 0 ? bar.updateLeft(left) : bar.updateRight(left);
        this.rs[index === 0 ? "start" : "end"] = this.rs._seconds(left); //Fix the problem  when you press the button and the two arrow are underhand
        //left.zIndex = 10 and right.zIndex=20. This is always less in this case:

        if (index === 0) {
          if (left >= 0.9) ObjLeft.style.zIndex = 25;else ObjLeft.style.zIndex = 10;
        } //-- Panel


        var TimeText = videojsFormatTime(this.rs._seconds(left)),
            tplTextLegth = tpl.children[0].innerHTML.length;
        var MaxP, MinP, MaxDisP;
        if (tplTextLegth <= 4) //0:00
          MaxDisP = this.player_.isFullScreen ? 3.25 : 6.5;else if (tplTextLegth <= 5) //00:00
          MaxDisP = this.player_.isFullScreen ? 4 : 8; //0:00:00
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
          tpl.style.left = Math.max(MinP, Math.min(MaxP, left * 100 - MaxDisP / 2)) + "%";
          if (tpr.style.left.replace("%", "") - tpl.style.left.replace("%", "") <= MaxDisP) tpl.style.left = Math.max(MinP, Math.min(MaxP, tpr.style.left.replace("%", "") - MaxDisP)) + "%";
          tpl.children[0].innerHTML = TimeText;
        } else {
          tpr.style.left = Math.max(MinP, Math.min(MaxP, left * 100 - MaxDisP / 2)) + "%";
          if ((tpr.style.left.replace("%", "") || 100) - tpl.style.left.replace("%", "") <= MaxDisP) tpr.style.left = Math.max(MinP, Math.min(MaxP, tpl.style.left.replace("%", "") - 0 + MaxDisP)) + "%";
          tpr.children[0].innerHTML = TimeText;
        } //-- Control Time


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

  var videojsComponent$5 = videojs.getComponent("Component");
  /**
   * This is the bar with the selection of the Trimmer
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var SelectionBar = videojs.extend(videojsComponent$5, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$5.call(this, player, options);
      this.on("mouseup", this.onMouseUp);
      this.on("touchend", this.onMouseUp);
      this.fired = false;
    },
    options_: {
      children: {
        SelectionBarProgress: {}
      }
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    createEl: function createEl() {
      return videojsComponent$5.prototype.createEl.call(this, "div", {
        className: "vjs-selectionbar-trimmer"
      });
    },
    onMouseUp: function onMouseUp() {
      var start = this.rs.left.el_.style.left.replace("%", ""),
          end = this.rs.right.el_.style.left.replace("%", ""),
          duration = this.player_.duration(),
          precision = this.rs.updatePrecision,
          segStart = videojsRound(start * duration / 100, precision),
          segEnd = videojsRound(end * duration / 100, precision);
      this.player_.currentTime(segStart);
      this.player_.play();
      this.rs.bar.activatePlay(segStart, segEnd);
    },
    updateLeft: function updateLeft(left) {
      var rightVal = this.rs.right.el_.style.left != "" ? this.rs.right.el_.style.left : 100;
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
    updateRight: function updateRight(right) {
      var leftVal = this.rs.left.el_.style.left != "" ? this.rs.left.el_.style.left : 0;
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
    activatePlay: function activatePlay(start, end) {
      this.timeStart = start;
      this.timeEnd = end;
      this.suspendPlay();
      this.player_.on("timeupdate", videojs.bind(this, this._processPlay));
    },
    suspendPlay: function suspendPlay() {
      this.fired = false;
      this.player_.off("timeupdate", videojs.bind(this, this._processPlay));
    },
    _processPlay: function _processPlay() {
      //Check if current time is between start and end
      if (this.player_.currentTime() >= this.timeStart && (this.timeEnd < 0 || this.player_.currentTime() < this.timeEnd)) {
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
    process_loop: function process_loop() {
      var player = this.player;
      console.log("porcess");
      this.SelectionBarProgress.update();

      if (player && this.looping) {
        var current_time = player.currentTime();

        if (current_time < this.timeStart || this.timeEnd > 0 && this.timeEnd < current_time) {
          player.currentTime(this.timeStart);
        }
      }
    }
  });
  videojs.registerComponent("SelectionBar", SelectionBar);

  var videojsComponent$6 = videojs.getComponent("Component");
  /**
   * This is the bar with the selection of the Trimmer
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var SelectionBarProgress = videojs.extend(videojsComponent$6, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$6.call(this, player, options);
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    createEl: function createEl() {
      return videojsComponent$6.prototype.createEl.call(this, "div", {
        className: "vjs-selectionbar-progress-trimmer vjs-play-progress"
      });
    },
    update: function update(left, right) {
      var rightVal = this.rs.right.el_.style.left != "" ? this.rs.right.el_.style.left : 100;
      var right = parseFloat(rightVal) / 100;
      var leftVal = this.rs.left.el_.style.left != "" ? this.rs.left.el_.style.left : 0;
      var left = parseFloat(leftVal) / 100;
      var currentTime = this.player_.currentTime();
      var duration = this.player_.duration();
      var current = currentTime / duration;
      var width = (current - left) / (right - left);
      this.rs.barProgress.el_.style.width = width * 100 + "%";
    }
  });
  videojs.registerComponent("SelectionBarProgress", SelectionBarProgress);

  var videojsComponent$7 = videojs.getComponent("Component");
  /**
   * This is the left arrow to select the Trimmer
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var SelectionBarLeft = videojs.extend(videojsComponent$7, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$7.call(this, player, options);
      this.on("mousedown", this.onMouseDown);
      this.on("touchstart", this.onMouseDown);
      this.pressed = false;
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    createEl: function createEl() {
      return videojsComponent$7.prototype.createEl.call(this, "div", {
        className: "vjs-trimmer-handle vjs-selectionbar-left-trimmer",
        innerHTML: '<div class="vjs-selectionbar-arrow-trimmer"></div><div class="vjs-selectionbar-line-trimmer"></div>'
      });
    },
    onMouseDown: function onMouseDown(event) {
      event.preventDefault();

      if (!this.rs.options.locked) {
        this.pressed = true;
        this.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
        this.on(document, "touchend", videojs.bind(this, this.onMouseUp));
        videojsAddClass(this.el_, "active");
      }
    },
    onMouseUp: function onMouseUp(event) {
      this.off(document, "mouseup", videojs.bind(this, this.onMouseUp), false);
      this.off(document, "touchend", videojs.bind(this, this.onMouseUp), false);
      videojsRemoveClass(this.el_, "active");

      if (!this.rs.options.locked) {
        this.pressed = false;
      }
    }
  });
  videojs.registerComponent("SelectionBarLeft", SelectionBarLeft);

  var videojsComponent$8 = videojs.getComponent("Component");
  /**
   * This is the right arrow to select the Trimmer
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var SelectionBarRight = videojs.extend(videojsComponent$8, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$8.call(this, player, options);
      this.on("mousedown", this.onMouseDown);
      this.on("touchstart", this.onMouseDown);
      this.pressed = false;
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    createEl: function createEl() {
      return videojsComponent$8.prototype.createEl.call(this, "div", {
        className: "vjs-trimmer-handle vjs-selectionbar-right-trimmer",
        innerHTML: '<div class="vjs-selectionbar-arrow-trimmer"></div><div class="vjs-selectionbar-line-trimmer"></div>'
      });
    },
    onMouseDown: function onMouseDown(event) {
      event.preventDefault();

      if (!this.rs.options.locked) {
        this.pressed = true;
        this.on(document, "mouseup", videojs.bind(this, this.onMouseUp));
        this.on(document, "touchend", videojs.bind(this, this.onMouseUp));
        videojsAddClass(this.el_, "active");
      }
    },
    onMouseUp: function onMouseUp(event) {
      this.off(document, "mouseup", videojs.bind(this, this.onMouseUp), false);
      this.off(document, "touchend", videojs.bind(this, this.onMouseUp), false);
      videojsRemoveClass(this.el_, "active");

      if (!this.rs.options.locked) {
        this.pressed = false;
      }
    }
  });
  videojs.registerComponent("SelectionBarRight", SelectionBarRight);

  var videojsComponent$9 = videojs.getComponent("Component");
  /**
   * This is the time panel
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var TimePanel = videojs.extend(videojsComponent$9, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$9.call(this, player, options);
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    options_: {
      children: {
        TimePanelLeft: {},
        TimePanelRight: {}
      }
    },
    createEl: function createEl() {
      return videojsComponent$9.prototype.createEl.call(this, "div", {
        className: "vjs-timepanel-trimmer"
      });
    }
  });
  videojs.registerComponent("TimePanel", TimePanel);

  var videojsComponent$a = videojs.getComponent("Component");
  /**
   * This is the left time panel
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var TimePanelLeft = videojs.extend(videojsComponent$a, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$a.call(this, player, options);
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    createEl: function createEl() {
      return videojsComponent$a.prototype.createEl.call(this, "div", {
        className: "vjs-timepanel-left-trimmer",
        innerHTML: '<span class="vjs-time-text">00:00</span>'
      });
    }
  });
  videojs.registerComponent("TimePanelLeft", TimePanelLeft);

  var videojsComponent$b = videojs.getComponent("Component");
  /**
   * This is the right time panel
   * @param {videojs.Player|Object} player
   * @param {Object=} options
   * @constructor
   */

  var TimePanelRight = videojs.extend(videojsComponent$b, {
    /** @constructor */
    constructor: function constructor(player, options) {
      videojsComponent$b.call(this, player, options);
    },
    init_: function init_() {
      this.rs = this.player_.trimmer();
    },
    createEl: function createEl() {
      return videojsComponent$b.prototype.createEl.call(this, "div", {
        className: "vjs-timepanel-right-trimmer",
        innerHTML: '<span class="vjs-time-text">00:00</span>'
      });
    }
  });
  videojs.registerComponent("TimePanelRight", TimePanelRight);

  var Plugin = videojs.getPlugin("plugin"); // Default options for the plugin.

  var defaults = {};
  /**
   * An advanced Video.js plugin. For more information on the API
   *
   * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
   */

  var Trimmer =
  /*#__PURE__*/
  function (_Plugin) {
    _inheritsLoose(Trimmer, _Plugin);

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
    function Trimmer(player, options) {
      var _this;

      // the parent class will add player under this.player
      _this = _Plugin.call(this, player) || this;
      _this.options = videojs.mergeOptions(defaults, options);
      if (!_this.options.hasOwnProperty("locked")) _this.options.locked = false; // lock slider handles

      if (!_this.options.hasOwnProperty("hidden")) _this.options.hidden = true; // hide slider handles

      if (!_this.options.hasOwnProperty("panel")) _this.options.panel = true; // Show Second Panel

      if (!_this.options.hasOwnProperty("controlTime")) _this.options.controlTime = true; // Show Control Time to set the arrows in the edition

      _this.components = {}; // holds any custom components we add to the player

      _this.player.ready(function () {
        _this.player.addClass("vjs-trimmer");
      });

      _this.init(); ///


      var initialVideoFinished = function initialVideoFinished() {
        var plugin = _assertThisInitialized(_assertThisInitialized(_this)); //All components will be initialize after they have been loaded by videojs


        for (var index in plugin.components) {
          plugin.components[index].init_();
        }

        _this.player.on("timeupdate", function () {
          _this.barProgress.update();
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
        player.one("error", function (e) {
          switch (player.error) {
            case 2:
              alert("The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.");

            case 5:
              alert("The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.");

            case 100:
              alert("The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.");
              break;

            case 101:
              alert("The owner of the requested video does not allow it to be played in embedded players.");
              break;

            case 150:
              alert("The owner of the requested video does not allow it to be played in embedded players.");
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

      return _this;
    }
    /*Constructor*/


    var _proto = Trimmer.prototype;

    _proto.init = function init() {
      var player = this.player || {};
      this.updatePrecision = 3; //position in second of the arrows

      this.start = 0;
      this.end = 0; //components of the plugin

      var controlBar = player.controlBar;
      var seekBar = controlBar.progressControl.seekBar; // Add child components here

      var rsTimeBar = seekBar.addChild("RSTimeBar");
      var controlTimePanel = controlBar.addChild("ControlTimePanel"); //

      this.components.RSTimeBar = rsTimeBar;
      this.components.ControlTimePanel = controlTimePanel; //Save local component

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
    };

    _proto.lock = function lock() {
      this.options.locked = true;
      this.ctp.enable(false);
      if (typeof this.box != "undefined") videojsAddClass(this.box.el_, "locked");
    };

    _proto.unlock = function unlock() {
      this.options.locked = false;
      this.ctp.enable();
      if (typeof this.box != "undefined") videojsRemoveClass(this.box.el_, "locked");
    };

    _proto.show = function show() {
      this.options.hidden = false;

      if (typeof this.rstb != "undefined") {
        this.rstb.show();
        if (this.options.controlTime) this.showcontrolTime();
      }
    };

    _proto.hide = function hide() {
      this.options.hidden = true;

      if (typeof this.rstb != "undefined") {
        this.rstb.hide();
        this.ctp.hide();
      }
    };

    _proto.showPanel = function showPanel() {
      this.options.panel = true;
      if (typeof this.tp != "undefined") videojsRemoveClass(this.tp.el_, "disable");
    };

    _proto.hidePanel = function hidePanel() {
      this.options.panel = false;
      if (typeof this.tp != "undefined") videojsAddClass(this.tp.el_, "disable");
    };

    _proto.showcontrolTime = function showcontrolTime() {
      this.options.controlTime = true;
      if (typeof this.ctp != "undefined") this.ctp.show();
    };

    _proto.hidecontrolTime = function hidecontrolTime() {
      this.options.controlTime = false;
      if (typeof this.ctp != "undefined") this.ctp.hide();
    };

    _proto.setValue = function setValue(index, seconds, writeControlTime) {
      //index = 0 for the left Arrow and 1 for the right Arrow. Value in seconds
      var writeControlTime = typeof writeControlTime != "undefined" ? writeControlTime : true;

      var percent = this._percent(seconds);

      var isValidIndex = index === 0 || index === 1;
      var isChangeable = !this.locked;
      if (isChangeable && isValidIndex) this.box.setPosition(index, percent, writeControlTime);
    };

    _proto.setValues = function setValues(start, end, writeControlTime) {
      //index = 0 for the left Arrow and 1 for the right Arrow. Value in seconds
      var writeControlTime = typeof writeControlTime != "undefined" ? writeControlTime : true;

      this._reset();

      this._setValuesLocked(start, end, writeControlTime);
    };

    _proto.getValues = function getValues() {
      //get values in seconds
      var start,
          end;
      start = this.start || this._getArrowValue(0);
      end = this.end || this._getArrowValue(1);
      return {
        start: start,
        end: end
      };
    };

    _proto.playBetween = function playBetween(start, end, setTimeAt, showRS) {
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
    };

    _proto.loop = function loop(start, end, setTimeAt, show) {
      var player = this.player;

      if (player) {
        player.on("pause", videojs.bind(this, function () {
          this.looping = false;
        }));
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
    };

    _proto._getArrowValue = function _getArrowValue(inpIndex) {
      var index = inpIndex || 0;
      var duration = this.player.duration();
      duration = typeof duration == "undefined" ? 0 : duration;
      var percentage = this[index === 0 ? "left" : "right"].el_.style.left.replace("%", "");
      if (percentage == "") percentage = index === 0 ? 0 : 100;
      return videojsRound(this._seconds(percentage / 100), this.updatePrecision - 1);
    };

    _proto._percent = function _percent(seconds) {
      var duration = this.player.duration();

      if (isNaN(duration)) {
        return 0;
      }

      return Math.min(1, Math.max(0, seconds / duration));
    };

    _proto._seconds = function _seconds(percent) {
      var duration = this.player.duration();

      if (isNaN(duration)) {
        return 0;
      }

      return Math.min(duration, Math.max(0, percent * duration));
    };

    _proto._reset = function _reset() {
      var duration = this.player.duration();
      this.tpl.el_.style.left = "0%";
      this.tpr.el_.style.left = "100%";

      this._setValuesLocked(0, duration);
    };

    _proto._setValuesLocked = function _setValuesLocked(start, end, writeControlTime) {
      var triggerSliderChange = typeof writeControlTime != "undefined";
      var writeControlTime = typeof writeControlTime != "undefined" ? writeControlTime : true;

      if (this.options.locked) {
        this.unlock(); //It is unlocked to change the bar position. In the end it will return the value.

        this.setValue(0, start, writeControlTime);
        this.setValue(1, end, writeControlTime);
        this.lock();
      } else {
        this.setValue(0, start, writeControlTime);
        this.setValue(1, end, writeControlTime);
      } // Trigger slider change


      if (triggerSliderChange) {
        this._triggerSliderChange();
      }
    };

    _proto._checkControlTime = function _checkControlTime(index, TextInput, timeOld) {
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
      durationSel = videojs.TextTrack.prototype.parseCueTime(newHour + ":" + newMin + ":" + newSec);

      if (durationSel > duration) {
        obj.value = objOld;
        obj.style.border = "1px solid red";
      } else {
        obj.value = objNew;
        h.style.border = m.style.border = s.style.border = "1px solid transparent";
        this.setValue(index, durationSel, false); // Trigger slider change

        this._triggerSliderChange();
      }

      if (index === 1) {
        var oldTimeLeft = this.ctpl.el_.children,
            durationSelLeft = videojs.TextTrack.prototype.parseCueTime(oldTimeLeft[0].value + ":" + oldTimeLeft[1].value + ":" + oldTimeLeft[2].value);

        if (durationSel < durationSelLeft) {
          obj.style.border = "1px solid red";
        }
      } else {
        var oldTimeRight = this.ctpr.el_.children,
            durationSelRight = videojs.TextTrack.prototype.parseCueTime(oldTimeRight[0].value + ":" + oldTimeRight[1].value + ":" + oldTimeRight[2].value);

        if (durationSel > durationSelRight) {
          obj.style.border = "1px solid red";
        }
      }
    };

    _proto._triggerSliderChange = function _triggerSliderChange(side) {
      this.player.trigger({
        type: "sliderchange",
        side: side
      });
    };

    return Trimmer;
  }(Plugin); // Define default values for the plugin's `state` object here.


  Trimmer.defaultState = {}; // Include the version number.

  Trimmer.VERSION = version; // Register the plugin with video.js.

  videojs.registerPlugin("trimmer", Trimmer);

  return Trimmer;

})));
