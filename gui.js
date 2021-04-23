let obj = {
  numOfMolecules: 10,
  numRows: 2,
  numCols: 2,
  showText: true,
  loopState: true,
  gridState: false,
  lineState: false,
  dashboardHeight: 400,
  minMoleculeSize: 10,
  maxMoleculeSize: 20,
  infectionRate: 0.5,
  infectionLifetime: 1000,
  socialDistancing: false
};

var gui = new dat.gui.GUI();

gui.remember(obj);

section01 = gui.addFolder('Layout');
section01.add(obj, 'numOfMolecules').min(0).max(800).step(1).onChange(function() {
  setup();
  draw();
});
section01.add(obj, 'numRows').min(1).max(20).step(1).onChange(function() {
  setup();
  draw();
});
section01.add(obj, 'numCols').min(1).max(20).step(1).onChange(function() {
  setup();
  draw();
});
section01.add(obj, 'showText').onChange(function() {
  draw();
});
section01.add(obj, 'loopState').onChange(function() {
  checkLoop()
});
section01.add(obj, 'gridState').onChange(function() {
  draw()
});
section01.add(obj, 'lineState').onChange(function() {
  draw()
});
section01.add(obj, 'dashboardHeight').onChange(function() {
  draw();
})

section02 = gui.addFolder('Design');

section02.add(obj, 'minMoleculeSize').min(1).max(75).step(1).onChange(function() {
  setup();
  draw()
});
section02.add(obj, 'maxMoleculeSize').min(1).max(50).step(1).onChange(function() {
  setup();
  draw()
});

section03 = gui.addFolder('Infection');

section03.add(obj, 'infectionRate').min(0.1).max(1).step(0.1).onChange(function() {
  draw();
});
section03.add(obj, 'infectionLifetime').min(100).max(5000).step(10).onChange(function() {
  draw();
});
section03.add(obj, 'socialDistancing').onChange(function() {
  draw();
});
