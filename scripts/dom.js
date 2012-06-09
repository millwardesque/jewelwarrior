jewel.dom = (function() {
  var $ = Sizzle;

  /**
   * Returns true if an element has a class, else false
   */
  function hasClass(el, clsName) {
    var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
    return regex.test(el.className);
  }

  /**
   * Adds a class to an element
   */
  function addClass(el, clsName) {
    if (!hasClass(el, clsName)) {
      el.className += " " + clsName;
    }
  }

  /**
   * Removes a class from an element
   */
  function removeClass(el, clsName) {
    var regex = new RegExp("(^|\\s)" + clsName + "(\\s|$)");
    el.className = el.className.replace(regex, " ");
  }

  /**
   * Binds an event to an element.
   *
   * @param element
   *   Either a string of the element selector or an actual DOM element. If a string, only the first match will be bound
   */
  function bind(element, event, handler) {
    // Convert a string element to its DOM equivalent
    if (typeof element == "string") {
      element = $(element)[0];
    }

    if (element) {
      element.addEventListener(event, handler, false);
    }
  }

  return {
    $: $,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    bind: bind
  }
})();