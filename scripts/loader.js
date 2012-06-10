var jewel = { // Namespace for the engine
  screens: {}, // Screens in the game
  images: {}, // Images in the game
  settings: { // Default game settings
    rows: 8,
    cols: 8,
    baseScore: 100,
    numJewelTypes: 7
  }
};

window.addEventListener("load", function() {
  // Determine jewel size
  var jewelProto = document.getElementById("jewel-proto"),
      rect = jewelProto.getBoundingClientRect();

  jewel.settings.jewelSize = rect.width;

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
        jewel.images[resource.url] = image;
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
        jewel.game.setup();
        if (Modernizr.standalone) {
          jewel.game.showScreen("splash-screen", getLoadProgress);
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
        test: Modernizr.webworkers,
        yep: [
          "loader!scripts/board.worker-interface.js",
          "preload!scripts/board.worker.js"
        ],
        nope: "loader!scripts/game.board.js"
      }, {
        load: [
          "loader!scripts/screen.main-menu.js",
          "loader!scripts/screen.about.js",
          "loader!images/jewels" + jewel.settings.jewelSize + ".png"
        ]
      }
    ]);
  }
}, false);
