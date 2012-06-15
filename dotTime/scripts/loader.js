var jewel = { };  // Temporary hack to prevent namespace issues

var dotTime = { // Namespace for the engine
  screens: {}, // Screens in the game
  images: {}, // Images in the game
  settings: { // Default game settings
    controls: {
      KEY_UP: "timeAccelerate",
      KEY_DOWN: "timeDecelerate",
    },
    gameSpeedMultiplier: 1.0
  }
};

window.addEventListener("load", function() {

  // Add detection for standalone app mode
  Modernizr.addTest("standalone", function() {
    return (window.navigator.standalone != false);
  });

  // Add preloading to yepnope
  yepnope.addPrefix("preload", function(resource) {
    resource.noexec = true;
    return resource;
  });

  // Add image preloading to yepnope
  var numPreload = 0,
      numLoaded = 0;
  yepnope.addPrefix("loader", function(resource) {
    var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
    resource.noexec = isImage;
    numPreload++;

    // Called when the resource has been loaded
    resource.autoCallback = function(e) {
      numLoaded++;
      if (isImage) {
        var image = new Image();
        image.src = resource.url;
        dotTime.images[resource.url] = image;
      }
    }

    return resource;
  });

  /**
   * Gets the percentage of game resources loaded
   */
  function getLoadProgress() {
    if (numPreload > 0) {
      return numLoaded / numPreload;
    }
    else {
      return 0;
    }
  }

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
        dotTime.game.setup();
        if (Modernizr.standalone) {
          dotTime.game.showScreen("splash-screen", getLoadProgress);
        }
        else {
          dotTime.game.showScreen("install-screen");
        }
      }
    }
  ]);

  // Loading stage 2
  if (Modernizr.standalone) {
    Modernizr.load([
      {
        test: Modernizr.canvas,
        yep: "loader!scripts/display.canvas.js",
        nope: "loader!scripts/display.none.js",
      }, {
        load: [
          "loader!scripts/gameTime.js",
          "loader!scripts/input.js",
          "loader!scripts/display.canvas.js",
          "loader!scripts/testTimeEntity.js",
          "loader!scripts/world.js",
          "loader!scripts/screen.main-menu.js",
          "loader!scripts/screen.about.js",
          "loader!scripts/screen.game-screen.js",
        ],
        complete: function() {
          dotTime.game.showScreen("game-screen");
        }
      }
    ]);
  }
}, false);
