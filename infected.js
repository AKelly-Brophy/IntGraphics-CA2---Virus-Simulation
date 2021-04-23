//INFECTED CLASS
//Like the Healthy class, inherits from the Molecule parent class
//However, it has unique values in its constructor not found in either of the other child classes
//It contains a value for frameCreated - the time when it is effectively "born" - and a set lifetime
//this lifetime can be set by the user in the gui - it denotes how long a viral infection will last before recovery
class Infected extends Molecule {
  constructor({_px, _py, _r, _i, _vx, _vy, _color = color(255, 0, 0), _frameCreated = frameCount, _lifeLength = obj.infectionLifetime}) {
    super({_px, _py, _r, _i, _vx, _vy});
    this.color = _color;
    this.currentColor = this.color;
    this.frameCreated = super.frame;
    this.lifeLength = _lifeLength;
  }

  //inherits the parent's render() function
  render() {
    super.render();

  }

}
