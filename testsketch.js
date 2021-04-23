let objects = [];
let numHealthy = 1;
let numInfected = 1;

function setup() {
  createCanvas(1000, 1000);

  for (let i = 0; i < numHealthy; i++) {
    objects.push(new Healthy({
      _i: 2
    }))
  }

  for (let i = 0; i < numInfected; i++) {
    objects.push(new Infected({
      _i: 4
    }))
  }
}

function draw() {
  background(255);

  for (let i = 0; i < objects.length; i++) {
    objects[i].render();
  }

}
