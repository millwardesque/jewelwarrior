jewel.screens['game-screen'] = (function() {
  var game = jewel.game,
      dom = jewel.dom,
      firstRun = true,    // True if this is the first time this screen has run
      restartRequested = true;   // True if a game restart has been requested
  
  /**
   * Sets up the screen
   */
  function setup() {

    // Set up the maze itself
    restart_game();

    // Bind the controls to actions
    dom.bind("#game-screen ul.menu", "click", function(e) {
      if (e.target.nodeName.toLowerCase() === "button") {
        var action = e.target.getAttribute("name");

        if (action == "exit") {
          game.showScreen("main-menu");
          return;
        }
        
        game.maze.move(action);
        game.maze.print();

        if (game.maze.hasFoundSolution()) {
          console.log("SUCCESS!");
          game.showScreen("main-menu");
          restart_requested = true;
        }
      }
    });
  }

  /**
   * Resets the status of the game
   */
  function restart_game() {
    game.maze.setup();
    game.maze.print();
    restart_requested = false;
  }

  /**
   * Processing for one cycle of the game
   */
  function run() {
    if (firstRun) {
      setup();
      firstRun = false;
    }
    else if (restart_requested) {
      restart_game();
    }
  }

  return {
    run: run
  };
})();