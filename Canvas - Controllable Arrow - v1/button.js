"use strict";
class HoldButton {
  __has;
  __callbacks;
  __setTimeout;
  __responseTime;
  __userdata;
  __element;
  constructor(element) {
    if (element instanceof Element)
      throw new TypeError("HoldButton requires DOM element");
    this.__has = {
      onhold: false,
      onunhold: false,
    };
    this.__callbacks = {
      main: () => {},
      hold: () => {},
      unhold: () => {},
    };
    this.__setTimeout = 0;
    this.__userdata = {
      main: () => {},
    };
    this.__responseTime = 1000;
    this.__element = element;
    this.__init__();
  }
  __init__() {
    if ("ontouchstart" in this.__element && "ontouchend" in this.__element) {
      this.__element.addEventListener(
        "touchend",
        (e) => this.__stop__(e),
        false,
      );
      this.__element.addEventListener(
        "touchstart",
        (e) => this.__start__(e),
        false,
      );
    } else if (
      "onmousedown" in this.__element &&
      "onmouseup" in this.__element
    ) {
      this.__element.addEventListener(
        "mouseleave",
        (e) => this.__stop__(e),
        false,
      );
      this.__element.addEventListener(
        "mouseup",
        (e) => this.__stop__(e),
        false,
      );
      this.__element.addEventListener(
        "mousedown",
        (e) => this.__start__(e),
        false,
      );
    } else {
      throw new Error("No Available Event Listener");
    }
  }
  __stop__(e) {
    if (e.cancelable) e.preventDefault();
    try {
      if (e.type != "mouseleave") this.click();
      this.__callbacks["unhold"](this.__userdata);
    } catch (TypeError) {}
    clearTimeout(this.__setTimeout);
  }
  __start__(e) {
    if (e.cancelable) e.preventDefault();
    this.__setTimeout = window.setTimeout(() => {
      this.__callbacks["hold"](this.__userdata);
    }, this.__responseTime);
  }
  click() {
    this.__callbacks["main"](this.__userdata);
  }
  onClick(callback) {
    this.__callbacks["main"] = callback;
    this.__userdata["main"] = callback;
    return this;
  }
  onHold(callback, response) {
    if (response && typeof response === "number")
      this.__responseTime = response;
    if (this.__has["onhold"])
      throw new TypeError("onHold can be called only once");
    this.__has["onhold"] = true;
    this.__callbacks["hold"] = callback;
    return this;
  }
  onUnHold(callback) {
    if (this.__has["onunhold"])
      throw new TypeError("onUnHold can be called only once");
    this.__has["onunhold"] = true;
    this.__callbacks["unhold"] = callback;
    return this;
  }
}
//# sourceMappingURL=button.js.map
