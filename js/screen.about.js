jewel.screens["about"] = (function() {
  var game = jewel.game,
      dom = jewel.dom,
      firstRun = true;  // True if this is the first time this screen has run

  /**
   * Sets up the screen
   */
  function setup() {
    dom.bind("#about ul.menu", "click", function(e) {
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