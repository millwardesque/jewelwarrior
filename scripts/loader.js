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
        "scripts/sizzle.js",
        "scripts/dom.js",
        "scripts/game.js",
      ]
    }, {
      test: Modernizr.standalone,
      yep: "scripts/screen.splash.js",
      nope: "scripts/screen.install.js",
      complete: function() {
        jewel.game.setup();
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
          "scripts/screen.main-menu.js",
          "scripts/screen.game-screen.js",
          "scripts/screen.about.js",
          "scripts/game.maze.js",
          "scripts/display.canvas.js"
        ]
      }
    ]);
  }
}, false);