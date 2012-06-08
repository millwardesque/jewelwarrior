jewel.display = (function() {
    var game = jewel.game,
        dom = jewel.dom,
        $ = dom.$,
        board = jewel.board,
        firstRun = true;    // True if this is the first time this screen has run

    /**
     * Setups up the display
     */
    function setup() {
    }

  /**
   * Processing for one cycle of the game
   */
  function run() {
    if (firstRun) {
      setup();
      firstRun = false;
    }
  }

  return {
    run: run
  };
})();