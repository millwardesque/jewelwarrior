dotTime.world = (function() {
  var gameTime, // The game-time
      timeSpeed;  // The speed at which time passes. 

  /**
   * Sets up the game world
   */
  function setup() {
    gameTime = new dotTime.GameTime();
    timeSpeed = new dotTime.GameTime();
  }

  /**
   * Gets the game time
   */
  function getGameTime() {
    return gameTime;
  }

  return {
    getGameTime: getGameTime,
    setup: setup
  }
})();