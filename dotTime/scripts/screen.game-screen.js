dotTime.screens['game-screen'] = (function() {
  var input = dotTime.input,
      display = dotTime.display,
      settings = dotTime.settings,
      world = dotTime.world,
      firstRun = true, 
      GameTime = dotTime.GameTime,
      testEntity;

  /**
   * Sets up the game screen
   */
  function setup() {
    input.initialize();
    input.bind("timeAccelerate", timeAccelerate);
    input.bind("timeDecelerate", timeDecelerate);

    world.setup();

    testEntity = new dotTime.TestTimeEntity();
    testEntity.initialize();
  }

  /**
   * Accelerates time by one unit
   */
  function timeAccelerate() {
    settings.gameSpeedMultiplier += 1.0;
  }

  /**
   * Accelerates time by one unit
   */
  function timeDecelerate() {
    settings.gameSpeedMultiplier -= 1.0;
  }

  /**
   * Processing for one cycle of the game
   */
  function run() {
    if (firstRun) {
      setup();
      firstRun = false;
    }

    display.initialize(function() {
      setInterval(function () {
        var elapsedTime = new GameTime(30.0 / 1000.0)
        
        if (settings.gameSpeedMultiplier < 0) {
          var elapsedGameTime = new GameTime(Math.abs(settings.gameSpeedMultiplier) * 30.0 / 1000.0)
          world.getGameTime().subtractTime(elapsedGameTime);  
          testEntity.update(elapsedTime, elapsedGameTime);
        }
        else {
          var elapsedGameTime = new GameTime(Math.abs(settings.gameSpeedMultiplier) * 30.0 / 1000.0)
          world.getGameTime().addTime(elapsedGameTime);  
          testEntity.update(elapsedTime, elapsedGameTime);
        }
        
        display.clearDisplay();
        display.renderTime(world.getGameTime(), 48, 48);
        display.renderText("Multiplier: " + settings.gameSpeedMultiplier, 48, 72);
        testEntity.render(display.getContext());
      }, 30);
    });
  }

  return {
    run: run
  };
})();