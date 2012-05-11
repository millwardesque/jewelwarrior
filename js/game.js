jewel.game = (function() {
  var dom = jewel.dom,
      screens = jewel.screens,
      $ = dom.$;

  /**
   * Hides the active screen (if any) and shows the requested screen
   */
   function showScreen(screenId) {
    var activeScreen = $("#game .screen.active")[0],
        screen = $("#" + screenId)[0];

    // Hide the active screen
    if (activeScreen) {
      dom.removeClass(activeScreen, "active");
    }

    // Show the new screen
    if (screen) {
      screens[screenId].run();
      dom.addClass(screen, "active");
    }
  }

  // Public members of the jewel.game object
  return {
    showScreen: showScreen
  };
})();