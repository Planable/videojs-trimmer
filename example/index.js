function basic(options) {
  if (options.customClass) {
    this.addClass(options.customClass);
  }

  this.on("playing", function() {
    videojs.log("playback began!");
  });
}

videojs.registerPlugin("basic", basic);

// const player = videojs('example-player');

// player.basic({customClass: 'hello-world'});

// Once the player begins playing, the "playback began!" message will be logged.
// player.play();

// TEst above

//Player 1

//Example of options ={hidden:false,locked:true,panel:false}
var mplayer = videojs("vid1", { inactivityTimeout: 0 });
mplayer.basic({ customeClass: "hello-world" });
const rsPlugin = mplayer.trimmer({ hidden: false });
console.log({ rsPlugin });
showhideControlTime();
disableProgressBar();

// console.log(smallPlayer)

function disableProgressBar() {
  mplayer.controlBar.progressControl.disable();
}

function getStartEnd() {
  var start = +document.getElementById("Start").value;
  var end = +document.getElementById("End").value;

  return [start, end];
}

function playBetween(side) {
  const [start, end] = getStartEnd();

  var timeAt = side === "right" ? end - 1 : start;

  rsPlugin.playBetween(start, end, timeAt);
}

function loopBetween(side) {
  const [start, end] = getStartEnd();

  var timeAt = side === "right" ? end - 1 : start;

  rsPlugin.loopBetween(start, end, timeAt);
}
function getValues() {
  var values = rsPlugin.getValues();
  const start = values.start.toFixed(2);
  const end = values.end.toFixed(2);

  document.getElementById("Start").value = start;
  document.getElementById("End").value = end;

  return [start, end];
}

function showhide() {
  if (rsPlugin.hidden) rsPlugin.show();
  else rsPlugin.hide();
}
function lockunlock() {
  if (rsPlugin.locked) rsPlugin.unlock();
  else rsPlugin.lock();
}
function showhidePanel() {
  if (!rsPlugin.panel) rsPlugin.showPanel();
  else rsPlugin.hidePanel();
}
function showhideControlTime() {
  if (!rsPlugin.controlTime) rsPlugin.showcontrolTime();
  else rsPlugin.hidecontrolTime();
}

// Player 2

var smallPlayer = videojs("vid2");

console.log(smallPlayer, { inactivityTimeout: 0 });

const offsetPlugin = smallPlayer.offset({
  start: 4,
  end: 6,
  restart_beginning: false
});

// setTimeout(() => {
//   console.log(offsetPlugin);
//   offsetPlugin._offsetEnd = 9;
// }, 2000);

// Both stuff

mplayer.on("sliderchange", data => {
  const [start, end] = getValues();
  playBetween(data.side);

  const startFloat = parseFloat(start);
  const endFloat = parseFloat(end);

  smallPlayer._offsetStart = startFloat;
  smallPlayer._offsetEnd = endFloat;

  smallPlayer.currentTime(0);

  smallPlayer.play();

  // smallPlayer.offset({
  //   start,
  //   end,
  //   restart_beginning: false
  // });
});
