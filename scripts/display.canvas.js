jewel.display = (function() {
  var dom = jewel.dom,
      $ = dom.$,
      canvas, ctx,
      cols, rows,
      jewelSize,
      jewels,
      cursor,
      previousCycle,
      animations = [],
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
    renderAnimations(time, previousCycle);

    // Update animation tracking / timing data
    previousCycle = time;
    requestAnimationFrame(cycle);
  }

  /**
   * Adds an animation to the active list
   */
  function addAnimation(runTime, fncs) {
    var anim = {
      runTime: runTime,
      startTime: Date.now(),
      pos: 0,
      fncs: fncs
    };

    animations.push(anim);
  }

  function renderAnimations(time, lastTime) {
    var anims = animations.slice(0),  // Copy the animation list
        n = anims.length,
        animTime,
        anim,
        i;

    // Call before()
    for (i = 0; i < n; ++i) {
      anim = anims[i];
      if (anim.fncs.before) {
        anim.fncs.before(anim.pos);
      }
      anim.lastPos = anim.pos;
      animTime = (lastTime - anim.startTime);
      anim.pos = animTime / anim.runTime;
      anim.pos = Math.max(0, Math.min(1, anim.pos));
    }

    animations = [];  // Empty the list

    // Run the animation
    for (i = 0; i < n; ++i) {
      anim = anims[i];
      anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
      if (anim.pos == 1) {
        if (anim.fncs.done) {
          anim.fncs.done();
        }
      }
      else {
        animations.push(anim);
      }
    }
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
  function drawJewel(type, x, y, scale, rot) {
    var image = jewel.images["images/jewels" + jewelSize + ".png"];

    ctx.save();
    if (typeof scale !== "undefined" && scale > 0) {
      ctx.beginPath();
      ctx.rect(x, y, 1, 1);
      ctx.clip();
      ctx.translate(x + 0.5, y + 0.5);
      ctx.scale(scale, scale);
      if (rot) {
        ctx.rotate(rot);
      }
      ctx.translate(-x - 0.5, -y - 0.5);
    }
    ctx.drawImage(image,
      type * jewelSize, 0, jewelSize, jewelSize,
      x, y,
      1, 1);
    ctx.restore();
  }

  /**
   * Processes the moved jewels on the board
   */
  function moveJewels(movedJewels, callback) {
    var n = movedJewels.length,
        oldCursor = cursor;
   
    cursor = null;

    movedJewels.forEach(function(e) {
      var x = e.fromX, y = e.fromY,
          dx = e.toX - e.fromX,
          dy = e.toY - e.fromY,
          dist = Math.abs(dx) + Math.abs(dy);

      addAnimation(200 * dist, {
        before: function(pos) {
          pos = Math.sin(pos * Math.PI / 2);
          clearJewel(x + dx * pos, y + dy * pos);
        },
        render: function(pos) {
          pos = Math.sin(pos * Math.PI / 2);
          drawJewel(e.type, 
            x + dx * pos, y + dy * pos
          );
        },
        done: function() {
          if (--n == 0) {
            cursor = oldCursor;
            callback();
          }
        }
      });
    });
  }

  /**
   * Processes the removed jewels on the board
   */
  function removeJewels(removedJewels, callback) {
    var n = removedJewels.length;

    removedJewels.forEach(function(e) {
      addAnimation(400, {
        before: function() {
          clearJewel(e.x, e.y);
        },
        render: function(pos) {
          ctx.save();
          ctx.globalAlpha = 1 - pos;
          drawJewel(
            e.type, e.x, e.y,
            1 - pos, pos * Math.PI * 2
          );
          ctx.restore();
        },
        done: function() {
          if (--n == 0) {
            callback();
          }
        }
      });
    });
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
      drawJewel(jewels[x][y], x, y, 1.1);
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