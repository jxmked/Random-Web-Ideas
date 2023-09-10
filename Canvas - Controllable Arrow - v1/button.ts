/**
 * Project name: Project Name: Press and Hold For Web Buttons
 * */

/**
 * in 'onHold' and 'onUnHold' method, we pass an object
 * variable where we can access the declared function
 * from 'onClick'. We can also use that object as variable
 * that related to that object
 *
 * 'main' => declared function fron 'onclick'
 *
 * */

class HoldButton {
  /**
   * Private Properties
   * */
  __has: { [id: string]: boolean };
  __callbacks: { [id: string]: Function };
  __setTimeout: number;
  __responseTime: number;
  __userdata: { [id: string]: any };
  __element: HTMLElement;

  /**
   * Require DOM element
   * */

  constructor(element: HTMLElement) {
    /*
        if(element instanceof Element)
            throw new TypeError("HoldButton requires DOM element")
        */
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

    this.__responseTime = 1000; // Millisecond
    this.__element = element;

    this.__init__();
  }

  /**
   * Private Properties
   * */

  __init__(): void {
    if ("ontouchstart" in this.__element && "ontouchend" in this.__element) {
      // For Mobile Devices
      this.__element.addEventListener(
        "touchend",
        (e: Event) => this.__stop__(e),
        false,
      );
      this.__element.addEventListener(
        "touchstart",
        (e: Event) => this.__start__(e),
        false,
      );
    } else if (
      "onmousedown" in this.__element &&
      "onmouseup" in this.__element
    ) {
      // For Desktop type devices

      /**
       * My best way of solving...mouseup did not fire if
       * the cursor is out of element.
       *
       * Side Effect: If mouse leave the element
       *      while onclick it also stop
       * */
      this.__element.addEventListener(
        "mouseleave",
        (e: Event) => this.__stop__(e),
        false,
      );
      this.__element.addEventListener(
        "mouseup",
        (e: Event) => this.__stop__(e),
        false,
      );
      this.__element.addEventListener(
        "mousedown",
        (e: Event) => this.__start__(e),
        false,
      );
    } else {
      throw new Error("No Available Event Listener");
    }
  }

  /**
   * Events
   * */
  __stop__(e: Event): void {
    if (e.cancelable) e.preventDefault();

    try {
      if (e.type != "mouseleave") this.click();

      this.__callbacks["unhold"](this.__userdata);
    } catch (TypeError) {}

    /** Stop or Prevent Timeout to initiate **/
    clearTimeout(this.__setTimeout);
  }
  __start__(e: Event): void {
    if (e.cancelable) e.preventDefault();

    this.__setTimeout = window.setTimeout(() => {
      this.__callbacks["hold"](this.__userdata);
    }, this.__responseTime);
  }

  /**
   * Public Properties
   * */
  click(): void {
    this.__callbacks["main"](this.__userdata);
  }

  onClick(callback: Function): this {
    this.__callbacks["main"] = callback;
    this.__userdata["main"] = callback;
    return this;
  }

  onHold(callback: Function, response?: number): this {
    if (response && typeof response === "number")
      this.__responseTime = response;

    if (this.__has["onhold"])
      throw new TypeError("onHold can be called only once");

    this.__has["onhold"] = true;
    this.__callbacks["hold"] = callback;

    return this;
  }

  onUnHold(callback: Function): this {
    if (this.__has["onunhold"])
      throw new TypeError("onUnHold can be called only once");

    this.__has["onunhold"] = true;
    this.__callbacks["unhold"] = callback;
    return this;
  }
}

/**
 * Written By Jovan De Guia
 * Project Name: Press and Hold For Web Buttons
 * Github: jxmked
 * */
