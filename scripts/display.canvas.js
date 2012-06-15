jewel.display = (function() {
  var dom = jewel.dom,
      $ = dom.$,
      canvas, ctx,
      cols, rows,
      jewelSize,
      jewels,
      cursor,
      previousCycle,
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
    canvas.width = cols * jewelSize;
    canvas.height = rows * jewelSize;

    ctx = canvas.getContext("2d");
    ctx.scale(jewelSize, jewelSize);

    dom.addClass(canvas, "board");
    
    boardElement.appendChild(createBackground());
    boardElement.appendChild(canvas);

    previousCycle = Date.now();
    requestAnimationFrame(cycle);
  }

  /**
   * Animation cycle
   */
  function cycle(time) {
    renderCursor(time);
    
    // Update animation tracking / timing data
    previousCycle = time;
    requestAnimationFrame(cycle);
  }

  /**
   * Clears the jewel at the cursor's position
   */
  function clearCursor() {
    if (cursor) {
      var x = cursor.x,
          y = cursor.y;

      clearJewel(x, y);
      drawJewel(jewels[x][y], x, y);
    }
  }

  /**
   * Visually clears the spot where a jewel would be
   */
  function clearJewel(x, y) {
    ctx.clearRect(x, y, 1, 1);
  }

  /**
   * Sets the cursor to a given position, and redraws it
   */
  function setCursor(x, y, selected) {
    clearCursor();
    if (arguments.length > 0) {
      cursor = {
        x: x,
        y: y,
        selected: selected
      };
    }
    else {
      cursor = null;
    }
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
      x, y,
      1, 1);
  }

  /**
   * Processes the moved jewels on the board
   */
  function moveJewels(movedJewels, callback) {
    var n = movedJewels.length,
        mover, i;

    // Clear each moved jewel
    for (i = 0; i < n; ++i) {
      mover = movedJewels[i];
      clearJewel(mover.fromX, mover.fromY);
    }

    // Draw the jewel in its new location
    for (i = 0; i < n; ++i) {
      mover = movedJewels[i];
      drawJewel(mover.type, mover.toX, mover.toY);
    }

    callback();
  }

  /**
   * Processes the removed jewels on the board
   */
  function removeJewels(removedJewels, callback) {
    var n = removedJewels.length;

    for (var i = 0; i < n; ++i) {
      clearJewel(removedJewels[i].x, removedJewels[i].y);
    }

    callback();
  }

  /**
   * Redraws the board
   */
  function redraw(newJewels, callback) {
    var x, y;
    
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
   * Renders the cursor
   */
  function renderCursor(time) {
    if (!cursor) {
      return;
    }

    var x = cursor.x,
        y = cursor.y,
        t1 = (Math.sin(time / 200) + 1) / 2,
        t2 = (Math.sin(time / 400) + 1) / 2;

    clearCursor();

    if (cursor.selected) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.8 * t1;
      drawJewel(jewels[x][y], x, y);
      ctx.restore();
    }

    ctx.save();
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = "rgba(250, 250, 150, " + (0.5 + 0.5 * t2) + ")";
    ctx.strokeRect(
      x + 0.05, y + 0.05,
      0.9, 0.9);
    ctx.restore();
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
    redraw: redraw,
    moveJewels: moveJewels,
    removeJewels: removeJewels,
    refill: redraw,
    setCursor: setCursor
  };
})();