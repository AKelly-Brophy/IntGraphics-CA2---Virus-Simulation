class Ball {
  constructor({_i, _px = random(0, width), _py = random(0, height)}) {
    this.position = createVector(_px,_py);
    this.color = color(0,0,0);
    this.index = _i;
  }

  render() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, 50, 50);
  }

}

class Healthy extends Ball {
  constructor({_i, _px = random(0, width), _py = random(0, height)}) {
    super({_i, _px, _py});
    this.color = color(0,255,0);
  }
}

class Infected extends Ball {
  constructor({_i, _px = random(0, width), _py = random(0, height)}) {
    super({_i, _px, _py});
    this.color = color(255,0,0);
  }
}
