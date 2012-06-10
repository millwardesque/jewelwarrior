jewel.screens['game-screen'] = (function() {
  var board = jewel.board,
      input = jewel.input,
      display = jewel.display,
      settings = jewel.settings,
      cursor,
      firstRun = true;

  function setup() {
    input.initialize();
    input.bind("selectJewel", selectJewel);
    input.bind("moveUp", moveUp);
    input.bind("moveDown", moveDown);
    input.bind("moveLeft", moveLeft);
    input.bind("moveRight", moveRight);
  }
  /**
   * Sets the cursor values
   */
  function setCursor(x, y, selected) {
    cursor.x = x;
    cursor.y = y;
    cursor.selected = selected;

    display.setCursor(x, y, selected);
  }

  /**
   * Moves the cursor by a certain distance
   */
  function moveCursor(x, y) {
    if (cursor.selected) {
      x += cursor.x;
      y += cursor.y;

      if (x >= 0 && x < settings.cols &&
          y >= 0 && y < settings.rows) {
        selectJewel(x, y);
      }
    }
    else {
      x = (cursor.x + x + settings.cols) % settings.cols;
      y = (cursor.y + y + settings.rows) % settings.rows;

      setCursor(x, y, false);
    }
  }

  /**
   * Moves the cursor up
   */
  function moveUp() {
    moveCursor(0, -1);
  }

  /**
   * Moves the cursor down
   */
  function moveDown() {
    moveCursor(0, 1);
  }

  /**
   * Moves the cursor left
   */
  function moveLeft() {
    moveCursor(-1, 0);
  }

  /**
   * Moves the cursor right
   */
  function moveRight() {
    moveCursor(1, 0);
  }

  /**
   * Selects a jewel
   */
  function selectJewel(x, y) {
    if (arguments.length == 0) {
      selectJewel(cursor.x, cursor.y);
      return;
    }

    if (cursor.selected) {  // If another jewel was previously selected, decide what to do
      var dx = Math.abs(x - cursor.x),
          dy = Math.abs(y - cursor.y),
          dist = dx + dy;

      if (dist == 0) {  // The same jewel was selected.
        setCursor(x, y, false); // Deselect the selected gem
      }
      else if (dist == 1) { // An adjacent jewel was selected. Swap and deselect the cursor
        board.swap(cursor.x, cursor.y, x, y, playBoardEvents);
        setCursor(x, y, false);
      }
      else {
        setCursor(x, y, true);
      }
    }
    else {
      setCursor(x, y, true);
    }
  }

  /**
   * Process events that have happened to the board
   */
  function playBoardEvents(events) {
    if (events.length > 0) {
      var boardEvent = events.shift(),
          next = function() {
            playBoardEvents(events);
          };

      // Process the event
      switch (boardEvent.type) {
        case "move":
          display.moveJewels(boardEvent.data, next);
          break;
        case "remove":
          display.removeJewels(boardEvent.data, next);
          break;
        case "refill":
          display.refill(boardEvent.data, next);
          break;
        default:
          next();
          break;
      }
    }
    else {
      display.redraw(board.getBoard(), function() {
        // Good to go again
      })
    }
  }

  /**
   * Processing for one cycle of the game
   */
  function run() {
    if (firstRun) {
      setup();
      firstRun = false;
    }

    board.initialize(function() {
      display.initialize(function() {
        cursor = {
          x: 0,
          y: 0,
          selected: false
        };

        display.redraw(board.getBoard(), function() {
          // @ToDo Add additional initialization
        });
      })
    });
  }

  return {
    run: run
  };
})();