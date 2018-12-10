export const videojsAddClass = (element, className) => {
  element.classList.add(className);
};
export const videojsRemoveClass = (element, className) => {
  element.classList.remove(className);
};
export const videojsFindPosition = element => {
  return element.getBoundingClientRect();
};

export const videojsRound = (n, precision) => {
  return parseFloat(n.toFixed(precision));
};
export const videojsFormatTime = totalSeconds => {
  var minutes = Math.floor(totalSeconds / 60).toFixed(0);
  var seconds = (totalSeconds % 60).toFixed(0);

  if (seconds.length === 1) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
};
export const videojsBlockTextSelection = () => {
  // TODO
};
