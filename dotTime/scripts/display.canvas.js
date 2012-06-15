dotTime.display = (function() {
  var dom = jewel.dom,
      $ = dom.$,
      canvas, ctx,
      firstRun = true;

  /**
   * Setups up the display
   */
  function setup() {
    var gameViewportElement = $("#game-screen .game-viewport")[0];

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    dom.addClass(canvas, "viewport");

    gameViewportElement.appendChild(canvas);
  }

  /**
   * Clears the whole display
   */
  function clearDisplay() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Renders the game time
   */
  function renderTime(gameTime, x, y) {
    ctx.fillStyle = "#f00";
    ctx.font = 'italic bold 12px sans-serif';
    ctx.textBaseline = 'bottom';

    ctx.fillText(gameTime.toString(), x, y);
  }

  /**
   * Renders text
   */
  function renderText(text, x, y) {
    ctx.fillStyle = "#f00";
    ctx.font = 'italic bold 12px sans-serif';
    ctx.textBaseline = 'bottom';

    ctx.fillText(text, x, y);
  }

  /**
   * Initialize the display
   */
  function initialize(callback) {
    if (firstRun) {
      setup();
      firstRun = false;
    }

    callback();
  }

  /**
   * Gets the context 
   */
  function getContext() {
    return ctx;
  }

  return {
    initialize: initialize,
    clearDisplay: clearDisplay,
    renderTime: renderTime,
    renderText: renderText,
    getContext: getContext
  };
})();