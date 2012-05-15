jewel.game.maze = (function() {
  var game = jewel.game,
      dom = jewel.dom,
      board = [],
      board_traversal = [], // Maps the user's traversal on the board
      show_fog_of_war = true,
      rows = 8,
      columns = 8,
      current_position = {
        x: 0,
        y: 0
      },
      end_position = {
        x: 0,
        y: 0
      },
      board_solution = null,
      found_solution = false;

  // Describes the state of a square on the board
  var board_state = {
    OPEN: 0,
    BLOCKED: 1,
    START: 2,
    FINISH: 3
  };

  /**
   * Gets a random board state
   */
  function get_random_state() {
    // Since the only valid initial states are OPEN and BLOCKED, we can just round the random number to either 0 or 1 and map it to one of the board states
    var random_value = Math.round(Math.random());
    return (random_value == 0) ? board_state.OPEN : board_state.BLOCKED;
  }

  /**
   * Gets a random board position
   */
  function get_random_position() {
    var random_y = Math.round(Math.random() * (rows - 1));
    var random_x = Math.round(Math.random() * (columns - 1));

    return {
      x: random_x,
      y: random_y
    };
  }

  /**
   * Gets a random element from an array
   */
  function get_random_element(elements) {
    var random_value = Math.round(Math.random() * (elements.length - 1));
    return elements[random_value];
  }

  /**
   * Sets up a new game board
   */
  function setup() {
    found_solution = false;
    current_position = { x: 0, y: 0 };
    end_position = { x: 0, y: 0 };
    board = [];
    board_traversal = [];

    // Initialize the board
    for (var y = 0; y < rows; ++y) {
      board.push([]);
      board_traversal.push([]);
      for (var x = 0; x < columns; ++x) {
        board[y].push(get_random_state());
        board_traversal[y].push(false);
      }
    }

    // Generate start and end positions
    var start_position = get_random_position();
    end_position = get_random_position();

    // Ensure the start and end positions are different
    while (isSamePosition(start_position, end_position)) {
      start_position = get_random_position();
      end_position = get_random_position();
    }

    board[start_position.y][start_position.x] = board_state.START;
    board[end_position.y][end_position.x] = board_state.FINISH;
    board_traversal[start_position.y][start_position.x] = true;
    current_position = start_position;

    // Ensure the maze is solvable
    var min_solution_length = 5;
    board_solution = solve();
    console.log(board_solution);
    if (!board_solution || board_solution.length < min_solution_length) {
      setup();
    }
  }

  /**
   * Returns true if two positions are equal
   */
  function isSamePosition(p1, p2) {
    return (p1.x == p2.x && p1.y == p2.y);
  }

  /**
   * Solves the current maze.  Returns an array of moves that solve the maze, or false if the maze is unsolvable
   */
  function solve() {
    var open_list = [],
        closed_list = [],
        g_cost = 10;

    // Add the current position to the open list
    var first_node = {
      position: current_position,
      my_parent: null,
      h: hCost(current_position)
    };
    open_list.push(first_node);

    var current_node = null;
    var current_node_index = -1;
    while (0 != open_list.length) {
      // Calculate the next node to process
      var lowest_f = -1;
      for (var i = 0; i < open_list.length; ++i) {
        var f = gCost(open_list[i].my_parent) + open_list[i].h;
        if (f < lowest_f || lowest_f == -1) {
          lowest_f = f;
          current_node = open_list[i];
          current_node_index = i;
        }
      }

      // Move the current node to the closed list
      closed_list.push(open_list[current_node_index]);
      open_list.splice(current_node_index, 1);

      // Add (unprocessed) adjacent nodes to the open list
      var current_y = current_node.position.y,
          current_x = current_node.position.x;

      var new_positions = [
        { x: current_x, y: current_y - 1 },
        { x: current_x - 1, y: current_y },
        { x: current_x + 1, y: current_y },
        { x: current_x, y: current_y + 1 },
      ];

      for (var i = 0; i < new_positions.length; ++i) {
        var new_position = new_positions[i]

        // If the adjacent square is traversable and not in the closed list, add it to the open list
        if (isOpenSquare(new_position) && !isPositionInList(new_position, closed_list)) {

          // If the adjacent square is already in the open list, check to see if the current node is a faster path to it
          var openListNode = isPositionInList(new_position, open_list)
          if (openListNode) {
            if (gCost(current_node) < gCost(openListNode.my_parent)) {
              openListNode.my_parent = current_node;
            }
          }
          else {  // Add to the open list
            open_list.push({
              position: { x: new_position.x, y: new_position.y },
              my_parent: current_node,
              h: hCost(new_position)
            });
          }
        } 
      }
    }

    var endListPosition = isPositionInList(end_position, closed_list);
    if (endListPosition) {
      // Build the solution list
      var solution = [];
      var current_node = endListPosition;
      while (current_node) {
        solution.unshift(current_node);
        current_node = current_node.my_parent;
      }
      return solution;
    }
    else {
      return false;
    }
  }

  /**
   * Checks to see if a position is in a given node list
   */
  function isPositionInList(position, list) {
    for (var i = 0; i < list.length; ++i) {
      if (position.x == list[i].position.x && position.y == list[i].position.y) {
        return list[i];
      }
    }

    return false;
  }

  /**
   * Calculates the A* algorithm's H (heuristic) cost
   *
   * The position we're calculating the H cost of
   */
  function hCost(position) {
    return Math.abs(position.x - end_position.x) + Math.abs(position.y - end_position.y);
  }

  /**
   * Calculates the A* algorithm's G (distance) cost
   *
   * @param node_parent
   *   The node parent of the node we're calculating the G cost of
   */
  function gCost(node_parent) {
    if (!node_parent) {
      return 0;
    }
    else {
      return 10 + gCost(node_parent.my_parent);
    }
  }

  /**
   * Attempts to move the player to the given square
   */
  function move(direction) {
    var new_position = {
      x: current_position.x,
      y: current_position.y,
    };

    switch (direction) {
      case "up":
        new_position.y--;
        break;
      case "down":
        new_position.y++;
        break;
      case "left":
        new_position.x--;
        break;
      case "right":
        new_position.x++;
        break;
      default:
        break;
    }

    // Attempt to move to the new square
    if (isOpenSquare(new_position)) {
      current_position = new_position;
      board_traversal[new_position.y][new_position.x] = true;
    }

    // Check for endgame
    if (current_position.x == end_position.x && current_position.y == end_position.y) {
      found_solution = true;
    }
  }

  /**
   * Returns true if the position is open, else false
   */
  function isOpenSquare(position) {
    if (position.x < 0 || position.x >= columns ||
        position.y < 0 || position.y >= rows) {
      return false;
    }

    switch(board[position.y][position.x]) {
      case board_state.OPEN:
      case board_state.START:
      case board_state.FINISH:
        return true;

      case board_state.BLOCKED:
        return false;

      default:
        return false;
    }

    return false;
  }

  /**
   * Checks to see if a given square on the board is visible from the player's position
   */
  function isVisible(position) {
    var y = position.y,
        x = position.x,
        is_visible = false;

      var adjacent_positions = [
        { x: x, y: y },
        { x: x, y: y - 1 },
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x, y: y + 1 },
      ];

      // Check all adjacent squares to see if it's been traversed recentlys
      for (var i = 0; i < adjacent_positions.length; ++i) {
        var adj_x = adjacent_positions[i].x,
            adj_y = adjacent_positions[i].y;

        if (adj_x >= 0 && adj_x < columns &&
            adj_y >= 0 && adj_y  < rows && 
            board_traversal[adj_y][adj_x]) {
          is_visible = true;
          break;
        }
      }

      return is_visible;
    }

  /**
   * Returns true if the player has found the solution, else false
   */
  function hasFoundSolution() {
    return found_solution;
  }

  /**
   * Prints the board
   */
  function print() {
    var board_separator = '';
    for (var i = 0; i < columns; ++i) {
      board_separator += '####';
    }
    console.log(board_separator);
    for (var y = 0; y < rows; ++y) {
      var row_text = '';
      for (var x = 0; x < columns; ++x) {
        var state = board[y][x];

        if (!isVisible({ x: x, y: y }) && show_fog_of_war) {
          state = "   ";
        }
        else if (x == current_position.x && y == current_position.y) {
          state = "[" + "@" + "]";
        }
        else {
          if (board_traversal[y][x]) {
            state = "[" + state + "]";
          }
          else {
            state = " " + state + " ";
          }
        }
        row_text += state + " ";
      }
      console.log(row_text);
    } 
  }

  return {
    setup: setup,
    print: print,
    move: move,
    hasFoundSolution: hasFoundSolution
  };
})();