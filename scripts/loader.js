var jewel = { // Namespace for the engine
  screens: {}, // Screens in the game
  settings: { // Default game settings
    rows: 8,
    cols: 8,
    baseScore: 100,
    numJewelTypes: 7
  }
};

window.addEventListener("load", function() {
  // Add detection for standalone app mode
  Modernizr.addTest("standalone", function() {
    return (window.navigator.standalone != false);
  });

  /**
   * Adds preloading to yepnope
   */
  yepnope.addPrefix("preload", function(resource) {
    resource.noexec = true;
    return resource;
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
          "scripts/game.board.js",
          "scripts/screen.game-screen.js",
          "scripts/screen.about.js",
          "scripts/display.canvas.js"
        ]
      }, {
        test: Modernizr.webworkers,
        yep: [
          "scripts/board.worker-interface.js",
          "preload!scripts/board.worker.js"
        ],
        nope: "scripts/board.js"
      }
    ]);
  }
}, false);
