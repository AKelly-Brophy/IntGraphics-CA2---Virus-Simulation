class Molecule {
  constructor({_px, _py, _r = 20, _i, _vx = random(-2.5, 2.5), _vy = random(-2.5, 2.5), _timeCreated, _lifeLength}) {
    this.position = createVector(_px, _py);
    this.radius = _r;
    this.index = _i;
    this.velocity = createVector(_vx, _vy);
    this.color = color(0, 255, 0);
    // this.intersectingColor = color(0, 60, 0);
    this.currentColor = this.color;
    this.timeCreated = _timeCreated;
    this.lifeLength = _lifeLength;
  }

  render() {
    noStroke();
    fill(this.currentColor);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    fill(0);
    (obj.showText) ? (
      textSize(16),
      textAlign(CENTER),
      color(0),
      text(this.index, this.position.x, this.position.y + 6)) : null;
  }


  isIntersecting(_molecule) {
    let indexValue = _molecule.index;
    let fixedBall = molecules[_molecule.index];

    let resultantV = p5.Vector.sub(this.position, fixedBall.position);
    let distance = resultantV.mag();
    let gap = distance - this.radius - _molecule.radius;
    let check = (gap <= 0) ? true : false;

    //need to fix if intersections less than 0//

    if (check) {

      let rHeading = resultantV.heading();
      let rDist = (resultantV.mag() - this.radius - fixedBall.radius) / 2;

      // Here we thake away the calculated distance from the current position
      let moveX = cos(rHeading) * rDist;
      let moveY = sin(rHeading) * rDist;

      this.position.x -= moveX;
      this.position.y -= moveY;

      molecules[_molecule.index].position.x += moveX;
      molecules[_molecule.index].position.y += moveY;

      let dx = this.position.x - _molecule.position.x;
      let dy = this.position.y - _molecule.position.y;
      // let dist = Math.sqrt(dx * dx + dy * dy);

      let normalX = dx / distance;
      let normalY = dy / distance;

      let midpointX = (this.position.x + _molecule.position.x) / 2;
      let midpointY = (this.position.y + _molecule.position.y) / 2;

      let dVector = (this.velocity.x - _molecule.velocity.x) * normalX;
      dVector += (this.velocity.y - _molecule.velocity.y) * normalY;

      let dvx = dVector * normalX;
      let dvy = dVector * normalY;
      dvx = constrain(dvx, -2.5, +2.5);
      dvy = constrain(dvy, -2.5, +2.5);

      this.velocity.x -= dvx;
      this.velocity.y -= dvy;

      molecules[indexValue].velocity.x += dvx;
      molecules[indexValue].velocity.y += dvy;

    }
    return check;

  }

  //some of this can go into isIntersecting?
  //less mathematical calculations = better processing
  //incorporate "dock" code into isIntersecting
  //use constrain() function to keep constant velocity
  // dock(_molecule) {
  //
  //   // console.log("dock");
  //   //
  //   // This is where we want to dock it to
  //
  //
  //
  //
  //   // console.log(molecules);
  // }

  changeColor() {
    this.currentColor = this.intersectingColor;
  }

  reset() {
    this.currentColor = this.color;
  }

  step() {

    (this.position.x > width - this.radius || this.position.x < 0 + this.radius) ?
    this.velocity.x *= -1: null;

    (this.position.y > height - this.radius || this.position.y < 0 + this.radius) ?
    this.velocity.y *= -1: null;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

}
