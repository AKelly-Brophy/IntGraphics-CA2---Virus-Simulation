//HEALTHY CLASS
//This class inherits from the parent class, Molecule. As such, the constructor does not need to specify any default values, save for the unique color
//Each value in the constructor is instead inherited from the super class, as denoted by the key word "super"
class Healthy extends Molecule{
  constructor({_px, _py, _r, _i, _vx, _vy, _color = color(0, 255, 0)}) {
    super({_px, _py, _r, _i, _vx, _vy});
    this.color = _color;
    this.currentColor = this.color;
  }

  //Similarly, the whole render() function from the parent class does not need to be written out again - it can simply be called through the parent class
  //This is the benefit of inheritance - it saves from having to write out lines of code over and over when it can be reused between similar objects. It is a fundamental aspect of object-oriented programming
  render() {
    super.render();
  }

}
