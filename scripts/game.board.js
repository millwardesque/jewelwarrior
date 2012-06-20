jewel.board = (function() {
  var settings,
      jewels,
      cols,
      rows,
      baseScore,
      numJewelTypes;

  /**
   * Initialize the game board
   *
   * @param callback
   *  A callback function to call when the initialization is finished
   */
  function initialize(callback) {
    settings = jewel.settings;
    numJewelTypes = settings.numJewelTypes;
    baseScore = settings.baseScore;
    rows = settings.rows;
    cols = settings.cols;
    fillBoard();

    callback();
  }

  /**
   * Prints the board to the console
   */
  function print() {
    var output = "";
    for (var y = 0; y < rows; ++y) {
      for (var x = 0; x < cols; ++x) {
        output += getJewel(x, y) + " ";
      }
      output += "\r\n";
    }
    console.log(output);
  }

  /**
   * Fills the board with jewels
   */
  function fillBoard() {
    var x, y, type;
    jewels = [];

    for (x = 0; x < cols; x++) {
      jewels[x] = [];
      for (y = 0; y < rows; ++y) {
        type = randomJewel();

        // Ensure that no chains are created on the initial board fill
        while ((type === getJewel(x - 1, y) && type === getJewel(x - 2, y)) ||
               (type === getJewel(x, y - 1) && type === getJewel(x, y - 2))) {
          type = randomJewel();
        }

        jewels[x][y] = type;
      }
    }

    // Recursively fill if the generated board has no moves
    if (!hasMoves()) {
      fillBoard();
    }
  }

  /**
   * Returns a random jewel type
   */
  function randomJewel() {
    return Math.floor(Math.random() * numJewelTypes);
  }

  /**
   * Gets a jewel at the given coordinates.  Returns -1 if the coordinates are invalid
   */
  function getJewel(x, y) {
    if (x < 0 || x > cols - 1 || y < 0 || y > rows - 1) {
      return -1;
    }
    else {
      return jewels[x][y];
    }
  }

  /**
   * Returns the number of jewels in teh longest chain that includes (x, y)
   */
  function checkChain(x, y) {
    var type = getJewel(x, y),
        left = 0, right = 0,
        down = 0, up = 0;

    // Check right
    while (type === getJewel(x + right + 1, y)) {
      right++;
    }

    // Check left
    while (type === getJewel(x - left - 1, y)) {
      left++;
    }

    // Check up
    while (type === getJewel(x, y - up - 1)) {
      up++;
    }

    // Check down
    while (type === getJewel(x, y + down + 1)) {
      down++;
    }

    // Return the largest axis chain
    return Math.max(left + 1 + right, up + 1 + down);
  }

  /**
   * Returns true if (x1, y1) can be swapped with (x2, y2) to create a new match
   */
  function canSwap(x1, y1, x2, y2) {
    var type1 = getJewel(x1, y1),
        type2 = getJewel(x2, y2),
        isChained;

    if (!isAdjacent(x1, y1, x2, y2)) {
      return false;
    }

    // Temporarily swap jewels
    jewels[x1][y1] = type2;
    jewels[x2][y2] = type1;

    isChained = (checkChain(x2, y2) > 2 ||
             checkChain(x1, y1) > 2);

    // Swap back
    jewels[x1][y1] = type1;
    jewels[x2][y2] = type2;

    return isChained;
  }

  /**
   * Returns true if two sets of coordinates are neighbours, else false
   */
  function isAdjacent(x1, y1, x2, y2) {
    var dx = Math.abs(x1 - x2),
        dy = Math.abs(y1 - y2);

    return (dx + dy === 1);
  }

  /**
   * Checks the whole board for chains
   */
  function getChains() {
    var x, y,
        chains = [];

    for (x = 0; x < cols; ++x) {
      chains[x] = [];
      for (y = 0; y < rows; ++y) {
        chains[x][y] = checkChain(x, y);
      }
    }

    return chains;
  }

  /**
   * Returns true if at least one valid move on the board exists
   */
  function hasMoves() {
    for (var x = 0; x < cols; ++x) {
      for (var y = 0; y < cols; ++y) {
        if (canJewelMove(x, y)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if a jewel can be swapped
   */
  function canJewelMove(x, y) {
    return ((x > 0 && canSwap(x, y, x - 1, y)) || 
            (x < cols - 1 && canSwap(x, y, x + 1, y)) ||
            (y > 0 && canSwap(x, y, x, y - 1)) ||
            (y < rows - 1 && canSwap(x, y, x, y + 1)));
  }

  /**
   * Checks the state of the board for any chains, and updates the board / score accordingly
   */
  function check(events) {
    var chains = getChains(),
        hadChains = false,
        score = 0,
        removed = [], moved = [], gaps = [],
        events = events || [];

    // Process all the positions on the board and fill in any gaps that were created from the bottom up
    for (var x = 0; x < cols; ++x) {
      gaps[x] = 0;
      for (var y = rows - 1; y >= 0; --y) {
        if (chains[x][y] > 2) {
          hadChains = true;
          gaps[x]++;
          removed.push({
            x: x,
            y: y,
            type: getJewel(x, y)
          });

          // Add points to the score
          score += baseScore * Math.pow(2, (chains[x][y] - 3));
        }
        else if (gaps[x] > 0) {
          moved.push({
            toX: x, toY: y + gaps[x],
            fromX: x, fromY: y,
            type: getJewel(x, y)
          });
          jewels[x][y + gaps[x]] = getJewel(x, y);
        }
      }

      // Fill in any newly created gaps at the top of the board
      for (y = 0; y < gaps[x]; y++) {
        jewels[x][y] = randomJewel();
        moved.push({
          toX: x, toY: y,
          fromX: x, fromY: y - gaps[x],
          type: jewels[x][y]
        });
      }
    }

    if (hadChains) {
      events.push({
        type: "remove",
        data: removed
      }, {
        type: "score",
        data: score
      }, {
        type: "move",
        data: moved
      });

      // Refill the board if necessary
      if (!hasMoves()) {
        fillBoard();
        events.push({
          type: "refill",
          data: getBoard()
        });
      }

      // Check the board again
      return check(events);
    }
    else {
      return events;
    }
  }

  /**
   * Gets a copy of the current board
   */
  function getBoard() {
    var copy = [],
        x;

    // Duplicate each row of the board
    for (x = 0; x < cols; ++x) {
      copy[x] = jewels[x].slice(0);
    }

    return copy;
  }

  function swap(x1, y1, x2, y2, callback) {
    var tmp, swap1, swap2
        events = [];

    // Prepare the swap events
    swap1 = {
      type: "move",
      data: [{
        type: getJewel(x1, y1),
        fromX: x1, fromY: y1, toX: x2, toY: y2 
      }, {
        type: getJewel(x2, y2),
        fromX: x2, fromY: y2, toX: x1, toY: y1
      }]
    }
    swap2 = {
      type: "move",
      data: [{
        type: getJewel(x2, y2),
        fromX: x1, fromY: y1, toX: x2, toY: y2 
      }, {
        type: getJewel(x1, y1),
        fromX: x2, fromY: y2, toX: x1, toY: y1
      }]
    }

    if (canSwap(x1, y1, x2, y2)) {
      // Swap the jewels
      tmp = getJewel(x1, y1);
      jewels[x1][y1] = jewels[x2][y2];
      jewels[x2][y2] = tmp;

      // Check the board for a list of events
      events = check();

      callback(events);
    }
    else {
      callback(false);
    }
  }

  return {
    initialize: initialize,
    print: print,
    getBoard: getBoard,
    swap: swap
  }
})();