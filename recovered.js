class Recovered extends Molecule {
  constructor({_px, _py, _r, _i, _vx, _vy, _color = color(204, 153, 255)}) {
    super({_px, _py, _r, _i, _vx, _vy});
    this.color = _color;
    // this.intersectingColor = _intersectingColor;
    this.currentColor = this.color;

  }

  // outputName() {
  //   console.log(this.name);
  // }

  render() {
    super.render();
    // noStroke();
    // fill(this.currentColor);
    // ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    // fill(0);
    // textSize(16);
    // textAlign(CENTER);
    // color(0);
    // text(this.index, this.position.x, this.position.y + 6);
  }

}
