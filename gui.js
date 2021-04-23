//USER CONTROLLED VARIABLES
//In this simulation, the applicatioin user can toggle various options to experiment with various possible outcomes.
//They can change the following: number of objects on screen; number of rows and columns in the grid; toggle text on or off; toggle loop on or off; toggle grid lines; toggle lines; change dashboard height; change infection rate; change infection lifetime; and toggle social distancing.
//NOTE: the social distancing feature was not used.
//NOTE: the min and max molecule size was also not used, as a default size was declared in the constructor of the molecule objects themselves. However, these values were left in as they were referenced in the main program.
let obj = {
  numOfMolecules: 10,
  numRows: 2,
  numCols: 2,
  showText: true,
  loopState: true,
  gridState: true,
  lineState: false,
  dashboardHeight: 26,
  minMoleculeSize: 10,
  maxMoleculeSize: 20,
  infectionRate: 0.5,
  infectionLifetime: 1000,
  socialDistancing: false
};

//creates a new GUI
//from: https://github.com/dataarts/dat.gui
var gui = new dat.gui.GUI();

//save previously used variables on next load
gui.remember(obj);

//layout section - here user can change variables such as number of molecules on screen, number of grid rows and columns, visibility of text, program loop, visibility of grid, and visibility of lines between molecules.
section01 = gui.addFolder('Layout');
//minimum number of molecules that can be displayed is 2; maximum is 500
//minimum number of rows and columns is 1; maximum is 20
section01.add(obj, 'numOfMolecules').min(2).max(500).step(1).onChange(function() {
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
section01.add(obj, 'dashboardHeight').min(20).max(36).step(2).onChange(function() {
  setup();
  draw();
})

//this section of the gui contains variables that the user can change in relation to the viral spread, such as rate of infection, virus lifetime, and an intended - but not implemented - social distancing feature
section03 = gui.addFolder('Infection');

section03.add(obj, 'infectionRate').min(0.1).max(1).step(0.1).onChange(function() {
  setup();
  draw();
});
section03.add(obj, 'infectionLifetime').min(100).max(5000).step(100).onChange(function() {
  setup();
  draw();
});
section03.add(obj, 'socialDistancing').onChange(function() {
  setup();
  draw();
});
