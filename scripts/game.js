jewel.game = (function() {
  var dom = jewel.dom,
      screens = jewel.screens,
      $ = dom.$;

  /**
   * Setup
   */
  function setup() {
    // Disable native touchmove to prevent overscroll
    dom.bind(document, "touchmove", function(event) {
      event.preventDefault();
    });

    // Hide the address bar on Android
    if (/Android/.test(navigator.userAgent)) {
      $("html")[0].style.height = "200%";
      setTimeout(function() {
        window.scrollTo(0, 1);
      }, 0);
    }
  }

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
    setup: setup,
    showScreen: showScreen
  };
})();