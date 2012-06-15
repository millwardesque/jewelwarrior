dotTime.game = (function() {
  var dom = jewel.dom,
      screens = dotTime.screens,
      $ = dom.$;

  /**
   * Creates the game background
   */
  function createBackground() {
    if (!Modernizr.canvas) {
      return;
    }

    var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        background = $("#game .background")[0],
        rect = background.getBoundingClientRect(),
        gradient,
        i;

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.scale(rect.width, rect.height);

    gradient = ctx.createRadialGradient(
      0.25, 0.15, 0.5,
      0.25, 0.15, 1.0
    );
    gradient.addColorStop(0, "rgb(55, 65, 50)");
    gradient.addColorStop(1, "rgb(0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 1);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 0.008;
    ctx.beginPath();
    for (i = 0; i < 2; i += 0.020) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i - 1, 1);
    }
    ctx.stroke();

    background.appendChild(canvas);
  }

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

    createBackground();
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

    // Extract screen parameters from arguments
    var args = Array.prototype.slice.call(arguments, 1);

    // Run the screen module
    if (screen) {
      dotTime.screens[screenId].run.apply(dotTime.screens[screenId], args);
      dom.addClass(screen, "active");
    }
  }

  // Public members of the .game object
  return {
    setup: setup,
    showScreen: showScreen
  };
})();