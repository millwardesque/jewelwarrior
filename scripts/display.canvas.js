jewel.display = (function() {
  var dom = jewel.dom,
      $ = dom.$,
      canvas, ctx,
      cols, rows,
      jewelSize,
      jewels,
      firstRun = true;

  /**
   * Setups up the display
   */
  function setup() {
    var boardElement = $("#game-screen .game-board")[0];

    cols = jewel.settings.cols;
    rows = jewel.settings.rows;
    jewelSize = jewel.settings.jewelSize;

    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    dom.addClass(canvas, "board");
    canvas.width = cols * jewelSize;
    canvas.height = rows * jewelSize;

    boardElement.appendChild(createBackground());
    boardElement.appendChild(canvas);
  }

  /**
   * Creates the board's background canvas
   */
  function createBackground() {
    var background = document.createElement("canvas"),
        bgctx = background.getContext("2d");

    dom.addClass(background, "background");
    background.width = cols * jewelSize;
    background.height = rows * jewelSize;

    bgctx.fillStyle = "rgba(225, 235, 255, 0.15)";
    for (var x = 0; x < cols; ++x) {
      for (var y = 0; y < rows; ++y) {
        if ((x + y) % 2) {
          bgctx.fillRect(
            x * jewelSize, y * jewelSize,
            jewelSize, jewelSize);
        }
      }
    }

    return background;
  }

  /**
   * Draws a jewel at a location on the board
   */
  function drawJewel(type, x, y) {
    var image = jewel.images["images/jewels" + jewelSize + ".png"];
    ctx.drawImage(image,
      type * jewelSize, 0, jewelSize, jewelSize,
      x * jewelSize, y * jewelSize,
      jewelSize, jewelSize);
  }

  /**
   * Redraws the board
   */
  function redraw(newJewels, callback) {
    var x, y,
        jewels = newJewels;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render the jewels
    for (x = 0; x < cols; ++x) {
      for (y = 0; y < rows; ++y) {
        drawJewel(jewels[x][y], x, y);
      }
    }

    callback();
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

  return {
    initialize: initialize,
    redraw: redraw
  };
})();