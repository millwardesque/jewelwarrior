dotTime.input = (function() {
  var dom = jewel.dom,
      $ = dom.$,
      settings = dotTime.settings,
      inputHandlers;

  var keys = {
    37: "KEY_LEFT",
    38: "KEY_UP",
    39: "KEY_RIGHT",
    40: "KEY_DOWN",
    13: "KEY_ENTER",
    32: "KEY_SPACE",
    65: "KEY_A",
    66: "KEY_B",
    67: "KEY_C",
    // @ToDo: Add alpha keys 68 - 87
    88: "KEY_X",
    89: "KEY_Y",
    90: "KEY_Z"
  };

  /**
   * Initialize the input module
   */
  function initialize() {
    inputHandlers = {};

    // Keyboard input
    dom.bind(document, "keydown", function(event) {
      var keyName = keys[event.keyCode];
      if (keyName && settings.controls[keyName]) {
        event.preventDefault();
        trigger(settings.controls[keyName]);
      }
    });
  }

  /**
   * Binds a handler function to a game action
   */
  function bind(action, handler) {
    if (!inputHandlers[action]) {
      inputHandlers[action] = [];
    }
    inputHandlers[action].push(handler);
  }

  /**
   * Triggers a game action
   */
  function trigger(action) {
    var handlers = inputHandlers[action],
        args = Array.prototype.slice.call(arguments, 1);

    if (handlers) {
      for (var i = 0; i < handlers.length; ++i) {
        handlers[i].apply(null, args);
      }
    }
  }

  return {
    initialize: initialize,
    bind: bind
  }
})();