
/**
 * Class containing a time in the game
 *
 * @param seconds
 *  The number of seconds in the time OR a GameTime object to clone
 */
dotTime.GameTime = function(seconds, minutes, hours, days, months, years) {
  var that = this,
      seconds = (seconds) ? seconds : 0,
      minutes = (minutes) ? minutes : 0,
      hours = (hours) ? hours : 0,
      days = (days) ? days : 0,
      months = (months) ? months : 0,
      years = (years) ? years : 0;

  // The seconds parameter can also be another GameTime object to clone
  if (typeof seconds == "object") {
    cloneTime = seconds;

    seconds = cloneTime.getSeconds();
    minutes = cloneTime.getMinutes();
    hours = cloneTime.getHours();
    days = cloneTime.getDays();
    months = cloneTime.getMonths();
    years = cloneTime.getYears();
  }

  processTime();

  /**
   * Adds a time to this time
   */
  function addTime(gameTime) {
    seconds += gameTime.getSeconds();
    minutes += gameTime.getMinutes();
    hours += gameTime.getHours();
    days += gameTime.getDays();
    months += gameTime.getMonths();
    years += gameTime.getYears();

    processTime();
  }

  /**
   * Checks if this time is less than the passed time
   */
  function lessThan(gameTime) {
    var theirYears = gameTime.getYears(),
        theirMonths = gameTime.getMonths(), 
        theirDays = gameTime.getDays(),
        theirHours = gameTime.getHours(),
        theirMinutes = gameTime.getMinutes(),
        theirSeconds = gameTime.getSeconds();

    return (years < theirYears ||
            (years == theirYears && months < theirMonths) ||
            (years == theirYears && months == theirMonths && days < theirDays) ||
            (years == theirYears && months == theirMonths && days == theirDays && hours < theirHours) ||
            (years == theirYears && months == theirMonths && days == theirDays && hours == theirHours && minutes < theirMinutes) ||
            (years == theirYears && months == theirMonths && days == theirDays && hours == theirHours && minutes == theirMinutes && seconds < theirSeconds));
  }

  /**
   * Checks if this time is equal to the passed time
   */
  function equals(gameTime) {
    return (years == theirYears && months == theirMonths && days == theirDays && hours == theirHours && minutes == theirMinutes && seconds == theirSeconds);
  }

  /**
   * Subtracts a time from this time
   */
  function subtractTime(gameTime) {
    seconds -= gameTime.getSeconds();
    minutes -= gameTime.getMinutes();
    hours -= gameTime.getHours();
    days -= gameTime.getDays();
    months -= gameTime.getMonths();
    years -= gameTime.getYears();

    processTime();
  }

  /**
   * Divides this game time by the given game time.
   * Subject to floating point inaccuracies when the divisor is much larger or much smaller than this time
   *
   * Unlike the other mathematical ops, this doesn't change the calling time
   */
  function divideBy(gameTime) {
    var theirSeconds = gameTime.convertToSeconds();

    if (theirSeconds == 0) {
      return 0;
    }
    else {
      return convertToSeconds() / theirSeconds;
    }
  }

  /**
   * Converts the time to seconds
   * Subject to floating point inaccuracies for very large times
   */
  function convertToSeconds() {
    var seconds = years * 12 * 30 * 24 * 60 * 60;
    seconds += months * 30 * 24 * 60 * 60;
    seconds += days * 24 * 60 * 60;
    seconds += hours * 60 * 60;
    seconds += minutes * 60;
    seconds += seconds;
  }

  /**
   * Processes any overflow in the time
   */
  function processTime() {
    // Process underflow
    while (seconds < 0) {
      seconds += 60;
      minutes--;
    }

    while (minutes < 0) {
      minutes += 60;
      hours--;
    }

    while (hours < 0) {
      hours += 24;
      days--;
    }

    while (days < 0) {
      days += 30;
      months--;
    }

    while (months < 0) {
      months += 11;
      years--;
    }

    // Negative time is not allowed
    if (years < 0) {
      seconds = 0;
      minutes = 0;
      hours = 0;
      days = 0;
      months = 0;
      years = 0;
    }

    // Process overflow
    while (seconds >= 60) {
      seconds -= 60;
      minutes++;
    }
    
    while (minutes >= 60) {
      minutes -= 60;
      hours++;
    }

    while (hours >= 24) {
      hours -= 24;
      days++;
    }

    while (days >= 30) {
      days -= 30;
      months++;
    }

    while (months >= 12) {
      months -= 12;
      years++;
    }
  }

  /**
   * Gets the seconds
   */
  function getSeconds() {
    return seconds;
  }

  /**
   * Gets the minutes
   */
  function getMinutes() {
    return minutes;
  }

  /**
   * Gets the hours
   */
  function getHours() {
    return hours;
  }

  /**
   * Gets the days
   */
  function getDays() {
    return days;
  }

  /**
   * Gets the months
   */
  function getMonths() {
    return months;
  }

  /**
   * Gets the years
   */
  function getYears() {
    return years;
  }

  /**
   * Converts the date to a string
   */
  function toString() {
    return "(" + years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds + ")";
  }

  return {
    addTime: addTime,
    subtractTime: subtractTime,
    divideBy: divideBy,
    convertToSeconds: convertToSeconds,
    toString: toString,
    lessThan: lessThan,
    equals: equals,
    getSeconds: getSeconds,
    getMinutes: getMinutes,
    getHours: getHours,
    getDays: getDays,
    getMonths: getMonths,
    getYears: getYears
  }
}