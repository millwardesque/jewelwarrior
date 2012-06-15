dotTime.screens["main-menu"] = (function() {
  var game = dotTime.game,
      dom = jewel.dom,
      firstRun = true;  // True if this is the first time this screen has run

  /**
   * Sets up the screen
   */
  function setup() {
    dom.bind("#main-menu ul.menu", "click", function(e) {
      if (e.target.nodeName.toLowerCase() === "button") {
        var action = e.target.getAttribute("name");
        game.showScreen(action);
      }
    });
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