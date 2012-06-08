var jewel = { // Namespace for the engine
  screens: {} // Screens in the game
};

window.addEventListener("load", function() {
  // Add detection for standalone app mode
  Modernizr.addTest("standalone", function() {
    return (window.navigator.standalone != false);
  });

  // Loading stage 1
  Modernizr.load([
    {
      // Load the following scripts
      load: [
        "js/sizzle.js",
        "js/dom.js",
        "js/game.js",
      ]
    }, {
      test: Modernizr.standalone,
      yep: "js/screen.splash.js",
      nope: "js/screen.install.js",
      complete: function() {

        if (Modernizr.standalone) {
          jewel.game.showScreen("splash-screen");
        }
        else {
          jewel.game.showScreen("install-screen");
        }
      }
    }
  ]);

  // Loading stage 2
  if (Modernizr.standalone) {
    Modernizr.load([
      {
        load: [
          "js/screen.main-menu.js",
          "js/screen.game-screen.js",
          "js/screen.about.js",
          "js/game.maze.js",
          "js/display.canvas.js"
        ]
      }
    ]);
  }
}, false);