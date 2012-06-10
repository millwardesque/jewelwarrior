var jewel = {};

importScripts('game.board.js');

/**
 * Listen for messages from the main thread
 */
addEventListener("message", function(event) {
  var board = jewel.board,
      message = event.data;

  // Process the message command
  switch (message.command) {
    case "initialize":
      jewel.settings = message.data;
      board.initialize(callback);
      break;
    
    case "swap":
      board.swap(
        message.data.x1,
        message.data.y1,
        message.data.x2,
        message.data.y2,
        callback);
      break;

    default:
      break;
  }

  /**
   * Callback used to post results to the main thread
   */
  function callback(data) {
    postMessage({
      id: message.id,
      data: data,
      jewels: board.getBoard()
    });
  }
}, false);