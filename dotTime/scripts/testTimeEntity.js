dotTime.TestTimeEntity = function() {
  var size = 20.0,
      age = null,
      lifespan = 1,
      milestones = [],
      previousMilestoneIndex,
      nextMilestoneIndex,
      milestoneDelta,
      color = {
        r: 0,
        g: 0, 
        b: 0
      };

  /**
   * Initializes the entity
   */
  function initialize(entity_lifespan) {
    lifespan = entity_lifespan;
    size = 1.0;
    age = new dotTime.GameTime();

    // Initial milestone
    milestones.push({
      age: new dotTime.GameTime(0, 0, 0, 0),
      size: 5.0,
      color: {
        r: 0,
        g: 255, 
        b: 0
      }
    });

    // Add the one-day milestone
    milestones.push({
      age: new dotTime.GameTime(10, 0, 0, 0),
      size: 20.0,
      color: {
        r: 255,
        g: 0, 
        b: 0
      }
    });

    // Add the end milestone
    milestones.push({
      age: new dotTime.GameTime(20, 0, 0, 0),
      size:10.0,
      color: {
        r: 0,
        g: 0, 
        b: 255
      }
    });

    previousMilestoneIndex = 0;
    nextMilestoneIndex = 1;
    milestoneDelta = 0.0;
  }

  /**
   * Updates the entity
   */
  function update(elapsedRealTime, elapsedGameTime) {
    age.addTime(elapsedGameTime);

    var previous = milestones[previousMilestoneIndex],
        next = milestones[nextMilestoneIndex];

    // Process a change in milestone    
    while (next.age.lessThan(age)) {
      if (nextMilestoneIndex + 1 < milestones.length) {
        nextMilestoneIndex++;
        previousMilestoneIndex++;

        milestoneDelta = 0.0;
        next = milestones[nextMilestoneIndex];
        previous = milestones[previousMilestoneIndex];
      }
      else {
        break;
      }
    }

    var milestoneLength = new dotTime.GameTime(next.age);
    milestoneLength.subtractTime(previous.age);
    milestoneDelta += elapsedGameTime.divideBy(milestoneLength);

    size = lerp(previous.size, next.size, milestoneDelta);
    color.r = lerp(previous.color.r, next.color.r, milestoneDelta);
    color.g = lerp(previous.color.g, next.color.g, milestoneDelta);
    color.b = lerp(previous.color.b, next.color.b, milestoneDelta);
  }

  /**
   * Linear interpolation between two points
   */
  function lerp(p1, p2, t) {
    return p1 * (1.0 - t) + p2 * t;
  }

  /**
   * Renders the entity
   */
  function render(ctx) {
    newColor = "rgb(" + Math.round(color.r) + ", " + Math.round(color.g) + ", " + Math.round(color.b) + ")";
    ctx.fillStyle = newColor;
    ctx.fillRect(10, 10, size, size);
  }

  return {
    initialize: initialize,
    update: update,
    render: render
  };
}