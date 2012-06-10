/**
 * A game board that uses web-workers
 */
jewel.board = (function() {
  var dom = jewel.dom,
      rows,
      cols,
      settings,
      jewels,
      worker,
      messageCount,
      callbacks;

  /**
   * Initialize the board
   */
  function initialize(callback) {
    settings = jewel.settings;
    rows = settings.rows;
    cols = settings.cols;

    messageCount = 0;
    callbacks = [];
    worker = new Worker("scripts/board.worker.js");

    dom.bind(worker, "message", messageHandler);
    post("initialize", settings, callback);
  }

  /**
   * Handles messages sent from the worker thread
   */
  function messageHandler(event) {
    console.log(event.data);

    var message = event.data;
    jewels = message.jewels;

    if (callbacks[message.id]) {
      callbacks[message.id](message.data);
      delete callbacks[message.id];
    }
  }

  /**
   * Swap two jewels
   */
  function swap(x1, y1, x2, y2, callback) {
    post("swap", {
      x1: x1, 
      y1: y1,
      x2: x2,
      y2: y2,
    }, callback);
  }

  /**
   * Prints the board to the console
   * Taken from game.board.js
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
   * Gets a jewel at the given coordinates.  Returns -1 if the coordinates are invalid.
   * Taken from game.board.js
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
  
  /**
   * Posts a message to a worker
   */
  function post(command, data, callback) {
    callbacks[messageCount] = callback;
    worker.postMessage({
      id: messageCount,
      command: command,
      data: data
    });

    messageCount++;
  }

  return {
    initialize: initialize,
    swap: swap,
    getBoard: getBoard,
    print: print
  }
})();