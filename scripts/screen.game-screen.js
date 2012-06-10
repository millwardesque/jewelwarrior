jewel.screens['game-screen'] = (function() {
  var board = jewel.board,
      display = jewel.display;

  /**
   * Processing for one cycle of the game
   */
  function run() {
    board.initialize(function() {
      display.initialize(function() {
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