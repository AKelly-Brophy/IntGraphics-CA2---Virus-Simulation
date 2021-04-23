//INTERACTIVE GRAPHICS CA2 - VIRUS INFECTION SIMULATOR
//This simulation is intended to showcase how an infection, such as a virus, can quickly and easily spread among a population and infect healthy members
//It is much more simplified than in real life - for example, molecules can not die from the infection, and there are no measures in place to contain the spread
//However, it shows just how easily infections can be spread, especially if the members of the population remain in close contact.

//Referenced: https://www.washingtonpost.com/graphics/2020/world/corona-simulator/

//Three different types of object - Healthy, Infected, and Recovered - needed to be made for the purpose of this simulation. The aim was that most molecules would start off as Healthy, then get infected by those already Infected at the start of the program, then, after a period of time, become Recovered molecules.

let molecules = [];
let grid = [];
let graphArray = [];
let colWidth, rowHeight;
let graphHeight = 100;
let checkNum = 0;
let percentOfInfected = 0.5;
let canvasHeight = 1000;
let dashPos;

function setup() {
  //draws a 1000 by 1000 canvas
  createCanvas(canvasHeight, canvasHeight);
  //draws the position of the stats dashboard
  //creates a percentage value by dividing the dashboard height specified in the gui by 100, then multiplying that by the canvas height
  dashPos = (obj.dashboardHeight / 100) * canvasHeight;
  colWidth = width / obj.numCols;
  rowHeight = (canvasHeight - dashPos) / obj.numRows;
  molecules = [];
  graphArray = [];

  //here we want to populate the molecules array - length of which is created in the gui - with both healthy and infected objects
  //a random number is declared, and if the random number is less than the percent of infected molecules, a new infected molecule is placed in the array
  //otherwise, a healthy one is placed instead.
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

  //place every object on screen in a grid formation at start of program
  gridify();
  //check if loop is turned on in gui
  checkLoop();
}

function draw() {

  //creates an almost-black background
  background(20);

  splitObjectIntoGrid();

  //draw dashboard features - stats and graph of infection and recovery over time
  drawGraph();

  //if the gridState is toggled on in the gui - draw the grid created in the drawGrid() function
  //otherwise - don't draw a grid
  obj.gridState ? drawGrid() : null;

  //the original intent here was to implement a social distancing feature. This toggle, if checked on, would have activated this feature, and if checked off, would have disabled it.
  obj.socialDistancing ? distance() : null;

  //render and move each molecule
  //additionally, if a molecule's name is "Infected", and the frame and life length of that molecule combined equals to the current frame count, make the infected molecule recover.
  molecules.forEach((molecule) => {
    molecule.render();
    molecule.step();

    //there might be a better way to do this, but it was never implemented.
    if ((molecule.frame + molecule.lifeLength) === frameCount && molecule.constructor.name === "Infected") {
      recover();
    }
  });
}


// This functions does accept a parameter - a new value called _collection
// This is used in the nested for loop instead of molecules.length
// This speeds up the intersection calculation process because instead of checking each molecule in the entire array for intersections,
// it only checks against each molecule in the _collection
// Therefore, if this function is called instead of checkIntersectionsOld(), it requires much less computation
function checkIntersections(_collection) {

  for (let a = 0; a < _collection.length; a++) {
    for (let b = a + 1; b < _collection.length; b++) {
      let moleculeA = molecules[_collection[a]];
      let moleculeB = molecules[_collection[b]];
      if (obj.lineState) {
        stroke(125, 100);
        line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
      };

      //the code below demonstrates how a healthy molecule can become infected
      //if moleculeA is an infected molecule, and moleculeB a healthy molecule, moleculeB has a chance of becoming infected
      //a random number between 0 and 1 is declared; if this is less than the infectionRate toggled in the gui, the healthy molecule is replaced with a new Infected object in the molecules array
      //this is achieved using the splice() method
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
              _frameCreated: frameCount,
              _lifeLength: moleculeB.lifeLength
            };
            //replaces moleculeB with tempObj
            molecules.splice(tempObj._i, 1, new Infected(tempObj));
          }
        }
        //conversely, if moleculeB is an infected molecule, and moleculeA is healthy, moleculeA has a chance of becoming infected, just like above
        else {
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
                _frameCreated: frameCount,
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

//there was an attempt to utilise the more efficient "L-checker" method of checking for intersections here, but it was largely unsuccessful.
function splitObjectIntoGrid() {

  //I and J
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

  //I+1, J+1
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

  //I-1, J-1
  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {

      let moleculeCollection = molecules.filter(molecule =>
        molecule.position.x > (i * colWidth) &&
        molecule.position.x < ((i - 1) * colWidth) &&
        molecule.position.y > j * rowHeight &&
        molecule.position.y < (j - 1) * rowHeight
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
//using .filter, each type of molecule is placed in its own array, called numInfected, numHealthy, and numRecovered respectively.
//then, to draw the graph, the Javascript map() function is used to get the values - such as the length of each previous array, and the total number of molecules - needed to draw each rectangle in the graph
function drawGraph() {

  let numInfected = molecules.filter(molecule => molecule.constructor.name == "Infected");
  let numHealthy = molecules.filter(molecule => molecule.constructor.name == "Healthy");
  let numRecovered = molecules.filter(molecule => molecule.constructor.name == "Recovered");

  infHeight = map(numInfected.length, 0, obj.numOfMolecules, 0, graphHeight);
  healthHeight = map(numHealthy.length, 0, obj.numOfMolecules, 0, graphHeight);
  recHeight = map(numRecovered.length, 0, obj.numOfMolecules, 0, graphHeight);

  //if the length of the values in the graph exceeds 500 - the graph will "move" to the left, showing the remaining values
  if (graphArray.length >= 500) {
    graphArray.shift();
  }

  //places all the values created by filtering and mapping the molecules array into the graph array created at the start of the program
  graphArray.push({
    numInfected: numInfected.length,
    numHealthy: numHealthy.length,
    numRecovered: numRecovered.length,
    infHeight: infHeight,
    healthHeight: healthHeight,
    recHeight: recHeight
  });

  //start drawing graph
  push();

  translate(400, 940)
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
  //end drawing graph

  //displays the stats of the simulation as text on screen. This text is aligned left and has a white colour.
  textAlign(LEFT);
  fill(255);
  textSize(28);
  text('No. of Molecules: ' + molecules.length, 85, 850);
  text('Healthy: ' + numHealthy.length, 85, 880);
  text('Infected: ' + numInfected.length, 85, 910);
  text('Recovered: ' + numRecovered.length, 85, 940);

}

//function called earlier in the program for when a molecule meets the necessary conditions to recover. If the molecule is and Infected molecule, a new object - like in the checkIntersections() function above - is placed into the molecules array in place of the previous Infected object, using the splice() method.
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

      // console.log(tempObj3._i);
      molecules.splice(tempObj3._i, 1, new Recovered(tempObj3));
    }
  });

  // console.log("Recovered");
}

//this was intended to be called when the social distancing toggle was checked in the gui. it would implement code that would force each molecule to stay apart, in order to slow the spread of infection.
function distance() {
  //
}

//if loopState is toggled on in the gui, redraw each frame
//if it isn't - don't redraw each frame
//image will be static
function checkLoop() {
  if (obj.loopState) {
    loop();
  } else {
    noLoop();
  }

}
