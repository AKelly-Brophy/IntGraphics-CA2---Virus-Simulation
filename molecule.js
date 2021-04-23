//MOLECULE SUPER CLASS
//The Molecule class is where the three different object types - Healthy, Infected, Recovered - inherit most of their characteristics from.
//Default values  for the molecule object are created in the constructor. If no other values are given to a new instance of this object in the program, it will use these values by default.
class Molecule {
  constructor({_px, _py, _r = 20, _i, _vx = random(-2.5, 2.5), _vy = random(-2.5, 2.5)}) {
    this.position = createVector(_px, _py);
    this.radius = _r;
    this.index = _i;
    this.velocity = createVector(_vx, _vy);
    this.color = color(0, 255, 0);
    this.currentColor = this.color;
    this.frame = frameCount;
  }

  //function that defines how the objects appear on screen. By default, they have no stroke, are filled the default color, and are drawn at the default x and y position with a size corresponding to the radius by 2
  render() {
    noStroke();
    fill(this.currentColor);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    fill(0);
    //if text toggled on in gui - display index values of each object in their centre
    (obj.showText) ? (
      textSize(16),
      textAlign(CENTER),
      color(0),
      text(this.index, this.position.x, this.position.y + 6)) : null;
  }

  //this function determines whether the molecule is touching another
  //the direction both molecules are travelling is given as a vector - it has both direction and magnitude
  //accepts a second molecule as a parameter - this way, we can pass it a second molecule to check if it is intersecting with it or not
  isIntersecting(_molecule) {
    let indexValue = _molecule.index;

    //effectively, the intersecting molecule must be "docked" to the other - it must not "stick", but instead just touch off it
    //this prevents an undesired "clustering" behaviour that can easily happen when objects are programmed to intersect
    let fixedBall = molecules[_molecule.index];

    //the position of the "fixed" molecule (in this case, the one the first molecule is colliding with) is taken from the position of the first
    let resultantV = p5.Vector.sub(this.position, fixedBall.position);
    //the distance can be found using p5's mag() function
    let distance = resultantV.mag();
    //the gap between molecules is calculated by taking both the radius of the molecule passed into the function, and the radius of the first, from the distance variable
    let gap = distance - this.radius - _molecule.radius;
    //if this gap is less than or equal to zero - intersection is true; if not, the objects are not touching
    let check = (gap <= 0) ? true : false;

    //if check is true
    if (check) {

      //get the heading of the molecules using p5's heading() function
      let rHeading = resultantV.heading();
      let rDist = (resultantV.mag() - this.radius - fixedBall.radius) / 2;

      // Here we take away the calculated distance from the current position
      let moveX = cos(rHeading) * rDist;
      let moveY = sin(rHeading) * rDist;

      this.position.x -= moveX;
      this.position.y -= moveY;

      molecules[_molecule.index].position.x += moveX;
      molecules[_molecule.index].position.y += moveY;

      let dx = this.position.x - _molecule.position.x;
      let dy = this.position.y - _molecule.position.y;

      let normalX = dx / distance;
      let normalY = dy / distance;

      let midpointX = (this.position.x + _molecule.position.x) / 2;
      let midpointY = (this.position.y + _molecule.position.y) / 2;

      let dVector = (this.velocity.x - _molecule.velocity.x) * normalX;
      dVector += (this.velocity.y - _molecule.velocity.y) * normalY;

      let dvx = dVector * normalX;
      let dvy = dVector * normalY;

      //if the velocity of the molecules is not constrained, they increase in velocity each time they collide
      //obviously, for the purpose of this program, this is undesired
      dvx = constrain(dvx, -2.5, +2.5);
      dvy = constrain(dvy, -2.5, +2.5);

      this.velocity.x -= dvx;
      this.velocity.y -= dvy;

      molecules[indexValue].velocity.x += dvx;
      molecules[indexValue].velocity.y += dvy;

    }
    //returns whether the intersection has been checked.
    return check;
  }

  //this fuction enables each molecule to move on screen
  //specifically - if the x or y position is greater than the canvas width or height respectively, or less than 0 plus the radius, then the velocity is multiplied by -1
  //this effectively "reverses" the motion of the object - it makes it appear as if it is moving the opposite direction to before
  step() {

    (this.position.x > width - this.radius || this.position.x < 0 + this.radius) ?
    this.velocity.x *= -1: null;

    (this.position.y > (canvasHeight - dashPos) - this.radius || this.position.y < 0 + this.radius) ?
    this.velocity.y *= -1: null;

    //increase the position of each object in accordance with its velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

}
