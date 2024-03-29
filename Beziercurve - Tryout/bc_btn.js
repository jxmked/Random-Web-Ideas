/**
 * Visualized
 *
 *
 * every touch start, check if the cursor is inside of an element,
 * if inside, user are able to move the the element within the
 * canvas, else user won't be able even the cursor move into element.
 *
 * Means, you can only move the element if the touchstart or event down
 * has been started at the element itself.
 *
 * */

class Canvas_Button {
  constructor(canvas, element_size, pos) {
    this.canvas = canvas;

    this.c_touch = pos;

    this.does_start_at_the_element = false;
    this.element_size = element_size;
    this.position = { x: 0, y: 0 };
    this.registered_id = null;
  }

  /**
   * Would be the center of the element
   * */
  translate({ x, y }) {
    this.position = { x, y };
  }

  _is_within({ x, y }) {
    const w = this.element_size.width;
    const h = this.element_size.height;
    const pos = this.position;

    // checking for x coordinate
    if (!(pos.x - w <= x && pos.x + w >= x)) return false;

    if (!(pos.y - h <= y && pos.y + h >= y)) return false;

    return true;
  }

  onTouchStart({ x, y }, id) {
    if (!this._is_within({ x, y })) return;
    if (this.registered_id !== null) return;

    this.does_start_at_the_element = true;

    this.registered_id = id;

    this.c_touch = { x, y };
  }

  onTouchMove({ x, y }, id) {
    if (!this.does_start_at_the_element) return;
    if (id !== this.registered_id) return;

    this.c_touch = { x, y };
  }

  onTouchEnd({ x, y }, id) {
    this.does_start_at_the_element = false;
    this.registered_id = null;
  }

  update(time = 0) {
    throw new MethodNotImplemented("update method not implmented");
  }

  display(ctx) {
    throw new MethodNotImplemented("display method not implmented");
  }
}
