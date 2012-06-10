jewel.screens["splash-screen"] = (function() {
  var game = jewel.game,
      dom = jewel.dom,
      $ = dom.$,
      firstRun = true;  // True if this is the first time this screen has run

  /**
   * Sets up the screen
   *
   * @param getLoadProgress
   *   Function for getting the current loading progress
   */
  function setup(getLoadProgress) {
    var scr = $("#splash-screen")[0];

    function checkProgress() {
      var p = getLoadProgress() * 100;
      $(".indicator", scr)[0].style.width = p + "%";

      if (p == 100) {
        $(".continue", scr)[0].style.display = "block";
        dom.bind(scr, "click", function(event) {
          jewel.game.showScreen("main-menu");
        });
      }
      else {
        setTimeout(checkProgress, 30);
      }
    }

    checkProgress();
  }

  /**
   * Processing for one cycle of the game
   *
   * @param getLoadProgress
   *   Function for getting the current loading progress
   */
  function run(getLoadProgress) {
    if (firstRun) {
      setup(getLoadProgress);
      firstRun = false;
    }
  }

  return {
    run: run
  };
})();