jewel.screens["splash-screen"] = (function() {
  var game = jewel.game,
      dom = jewel.dom,
      firstRun = true;  // True if this is the first time this screen has run

  /**
   * Sets up the screen
   */
  function setup() {
    dom.bind('#splash-screen', 'click', function() {
      game.showScreen('main-menu');
    })
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