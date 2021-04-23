let molecules = [];
let grid = [];
let graphArray = [];
let colWidth, rowHeight;
let graphHeight = 100;
let checkNum = 0;
let percentOfInfected = 0.3;

function setup() {
  createCanvas(1000, 1000);
  colWidth = width / obj.numCols;
  rowHeight = height / obj.numRows;
  molecules = [];
  graphArray = [];

  for (let i = 0; i < obj.numOfMolecules; i++) {
    let randomNum = Math.random();

    if (randomNum < percentOfInfected) {
      molecules.push(new Infected({
        _i: i
      }));
    } else {
      molecules.push(new Healthy({
        _i: i
      }));
    }
  }

  gridify();
  checkLoop();
}

function draw() {

  background(0);

  molecules.forEach((molecule) => {
    molecule.reset();
  });

  splitObjectIntoGrid();

  drawGraph();

  obj.gridState ? drawGrid() : null;

  obj.socialDistancing ? distance() : null;

  molecules.forEach((molecule) => {
    molecule.render();
    molecule.step();
    //there might be a better way to do this
    if ((molecule.lifeLength) === frameCount) {
      recover();
    }
  });
}

//new function
//Code is more efficient (less frame rate lags)
//What it does:
/*Behaves the same as the above function, but with one important difference
This functions does accept a parameter - a new value called _collection
This is used in the nested for loop instead of molecules.length
This speeds up the intersection calculation process because instead of checking each molecule in the entire array for intersections,
it only checks against each molecule in the _collection
Therefore, if this function is called instead of checkIntersectionsOld(), it requires much less computation
*/
function checkIntersections(_collection) {

  for (let a = 0; a < _collection.length; a++) {
    for (let b = a + 1; b < _collection.length; b++) {
      let moleculeA = molecules[_collection[a]];
      let moleculeB = molecules[_collection[b]];
      if (obj.lineState) {
        stroke(125, 100);
        line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
      };
      if (moleculeA.isIntersecting(moleculeB)) {
        if (moleculeA.constructor.name === "Infected" && moleculeB.constructor.name === "Healthy") {
          let infChance = random(1);

          if (infChance < obj.infectionRate) {
            let tempObj = {
              _i: moleculeB.index,
              _r: moleculeB.radius,
              _px: moleculeB.position.x,
              _py: moleculeB.position.y,
              _vx: moleculeB.velocity.x,
              _vy: moleculeB.velocity.y,
              _timeCreated: frameCount,
              _lifeLength: moleculeB.lifeLength
            };
            //replace moleculeB with tempObj
            molecules.splice(tempObj._i, 1, new Infected(tempObj));
          }
        } else {
          if (moleculeB.constructor.name === "Infected" && moleculeA.constructor.name === "Healthy") {
            let infChance = random(1);

            if (infChance < obj.infectionRate) {
              let tempObj2 = {
                _i: moleculeA.index,
                _r: moleculeA.radius,
                _px: moleculeA.position.x,
                _py: moleculeA.position.y,
                _vx: moleculeA.velocity.x,
                _vy: moleculeA.velocity.y,
                _timeCreated: frameCount,
                _lifeLength: moleculeA.lifeLength
              };
              //replace moleculeA with tempObj2
              molecules.splice(tempObj2._i, 1, new Infected(tempObj2));
            }
          }
        }
      }
    }
  }
  checkNum++;
}

//accepts no parameters, and returns no values
//what this does:
/*determines the starting position of each molecule object in relation to the grid defined in the GUI
Uses a nested for loop - iterates first through numRows (j), then numCols (i)
The new array moleculeCollection is filled by first using .filter, then .map
.filter lets us take specifically the x position of i, and the y position of j, while .map lets us return specifically
the index of each object*/
function splitObjectIntoGrid() {

  //NEED TO HAVE L CHECKER CODE IN HERE TOO - DUPLICATE SECTION BELOW AND CHANGE RELEVANT I and J VALUES
  checkNum = 0;

  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {

      let moleculeCollection = molecules.filter(molecule =>
        molecule.position.x > (i * colWidth) &&
        molecule.position.x < ((i + 1) * colWidth) &&
        molecule.position.y > j * rowHeight &&
        molecule.position.y < (j + 1) * rowHeight
      ).map(molecule => molecule.index);

      checkIntersections(moleculeCollection);
    }
  }
}

//accepts no parameters and returns no values
//What it does:
/*The number of divisions in the grid is set by getting the square root of the number of objects,
then ceiling that value.The spacing is set by getting the width minus a small "margin" at the edges of the canvas, then dividing that
by the numDivision
A foreach loop is then used, accepting a molecule object and its index as parameters, to set each colPos and rowPos
colPos is set by taking the remainder of index/numDivision multiplied by spacing
rowPos is set by index/numDivision, flooring that value, then multiplying by spacing
molecule's x position is then set to colPos + 20, y position rowPos + 20*/
function gridify() {
  let numDivision = ceil(Math.sqrt(obj.numOfMolecules));
  let spacing = (width) / numDivision;

  molecules.forEach((molecule, index) => {

    let colPos = (index % numDivision) * spacing;
    let rowPos = floor(index / numDivision) * spacing;
    //console.log(`The col pos ${colPos} and the row pos ${rowPos}`);
    molecule.position.x = colPos + obj.maxMoleculeSize;
    molecule.position.y = rowPos + obj.maxMoleculeSize;

  });
}

// The function drawGrid draws a grid using a nested loop iterating columns(i)
// within rows(j). colWidth and rowWidth are calculated in the setup(). The style
// of grid is defined by fill, stroke and strokeWeight. There
// are no parameters required to fulfil the function and no returns
function drawGrid() {
  noFill();
  stroke(155, 155, 155, 50);
  strokeWeight(1);

  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {

      rect(i * colWidth, j * rowHeight, colWidth, rowHeight)
    }
  }
}

//this function draw the graph of the rate of infection over time
//INSERT EXPLANATION FOR THIS HERE
function drawGraph() {

  let numInfected = molecules.filter(molecule => molecule.constructor.name == "Infected");
  let numHealthy = molecules.filter(molecule => molecule.constructor.name == "Healthy");
  let numRecovered = molecules.filter(molecule => molecule.constructor.name == "Recovered");

  infHeight = map(numInfected.length, 0, obj.numOfMolecules, 0, graphHeight);
  healthHeight = map(numHealthy.length, 0, obj.numOfMolecules, 0, graphHeight);
  recHeight = map(numRecovered.length, 0, obj.numOfMolecules, 0, graphHeight);

  if (graphArray.length >= 500) {
    graphArray.shift();
  }

  graphArray.push({
    numInfected: numInfected.length,
    numHealthy: numHealthy.length,
    numRecovered: numRecovered.length,
    infHeight: infHeight,
    healthHeight: healthHeight,
    recHeight: recHeight
  });


  push();

  translate(350, 975)
  graphArray.forEach(function(data, index) {
    noStroke();

    //Infection rate over time shows as red on graph
    fill(255, 0, 0);
    rect(index, 0, 1, -data.infHeight);

    //Healthy rate over time shows as green on graph
    fill(0, 255, 0);
    rect(index, -data.infHeight, 1, -data.healthHeight);

    //Recovery rate over time shows as light purple on graph
    fill(204, 153, 255);
    rect(index, -data.healthHeight, 1, -data.recHeight);
  });

  pop();

}

function recover() {

  molecules.forEach((molecule) => {
    if (molecule.constructor.name === "Infected") {
      let tempObj3 = {
        _i: molecule.index,
        _r: molecule.radius,
        _px: molecule.position.x,
        _py: molecule.position.y,
        _vx: molecule.velocity.x,
        _vy: molecule.velocity.y
      };

      console.log(tempObj3._i);
      molecules.splice(tempObj3._i, 1, new Recovered(tempObj3));
    }
  });

  console.log("Recovered");
}

//ADD IN SOCIAL DISTANCING METHOD
function distance() {
  //plus or minus radius
}

//if loopState is toggled on in the gui, redraw each frame
//if not - don't
function checkLoop() {
  if (obj.loopState) {
    loop();
  } else {
    noLoop();
  }

}
