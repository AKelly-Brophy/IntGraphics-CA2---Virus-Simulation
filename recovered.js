class Recovered extends Molecule {
  constructor({_px, _py, _r, _i, _vx, _vy, _color = color(204, 153, 255)}) {
    super({_px, _py, _r, _i, _vx, _vy});
    this.color = _color;
    this.currentColor = this.color;
  }

  render() {
    super.render();
  }

}
