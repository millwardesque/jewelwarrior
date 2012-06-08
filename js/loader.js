var jewel = { // Namespace for the engine
  screens: {} // Screens in the game
};

window.addEventListener("load", function() {
  // Load additional script resources
  Modernizr.load([
    {
      // Load the following scripts
      load: [
        "js/sizzle.js",
        "js/dom.js",
        "js/game.js",
        "js/screen.splash.js",
        "js/screen.main-menu.js",
        "js/screen.game-screen.js",
        "js/screen.about.js",
        "js/game.maze.js",
        "js/display.canvas.js"
      ],

      // Log the results of the load
      complete: function() {
        jewel.display.run();
        jewel.game.showScreen("splash-screen");
      }
    }
  ]);
}, false);