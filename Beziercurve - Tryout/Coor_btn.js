class Coor_button extends Canvas_Button {
  constructor(canvas, element_size, pos, color) {
    super(canvas, element_size, pos);
    this.angle = 0;
    this.radius = element_size;
    this.color = color;
    this.position = pos;
  }

  update(time = 0) {
    this.translate(this.c_touch);
  }

  display(ctx) {
    ctx.beginPath();

    ctx.ellipse(
      this.position.x,
      this.position.y,
      this.element_size.width / 2,
      this.element_size.height / 2,
      this.angle,
      0,
      Math.PI * 2,
    );

    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.closePath();
  }
}
