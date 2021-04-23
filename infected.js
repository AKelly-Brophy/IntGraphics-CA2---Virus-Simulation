class Infected extends Molecule {
  constructor({_px, _py, _r, _i, _vx, _vy, _color = color(255, 0, 0), _frameCreated = frameCount, _lifeLength = obj.infectionLifetime}) {
    super({_px, _py, _r, _i, _vx, _vy});
    this.color = _color;
    this.currentColor = this.color;
    this.frameCreated = super.frame;
    this.lifeLength = _lifeLength;
  }

  render() {
    super.render();

  }

}
