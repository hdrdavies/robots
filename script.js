(function(){
  var form = document.getElementsByTagName('form')[0],
      outputElement = document.getElementById('output'),
      output = '',
      orientationArray = ['N','E','S','W'],
      scentArray = [];

  form.addEventListener('submit', function(e) {

      e.preventDefault();

      var input = form.children[0].value;

      // parse and clean input
      var inputArray = cleanArray(input.split(/\s/g)),
          // map the world
          worldCoords = [Number(inputArray[0]), Number(inputArray[1])];

      // track each robot
      for (i = 2; i < inputArray.length; i += 4) {
        var robotCoords = [Number(inputArray[i]), Number(inputArray[i+1])],
            orientation = inputArray[i+2],
            instructions = inputArray[i+3];

        // execute each instruction
        for (j = 0; j < instructions.length; j++) {
          var instruction = instructions[j];

          if (instruction === 'F') robotCoords = tryMovingForward(robotCoords, worldCoords, orientation);
          if (instruction === 'R') orientation = turnRight(orientation);
          if (instruction === 'L') orientation = turnLeft(orientation);

          // if the robot is lost, escape the loop
          if (!robotCoords) break;
        }
        if (robotCoords) output += robotCoords.join(' ') + ' ' + orientation + '\n';
      }
      outputElement.innerHTML = output;
  });

  // cleans out carriage returns. http://stackoverflow.com/questions/281264/
  function cleanArray (actual) {
    var newArray = [];
    for (var i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }

  function tryMovingForward (robotCoords, worldCoords, orientation) {

    var newCoords = robotCoords.slice();

    // see where robot's heading
    if (orientation === 'N') newCoords[1]++;
    if (orientation === 'E') newCoords[0]++;
    if (orientation === 'S') newCoords[1]--;
    if (orientation === 'W') newCoords[0]--;

    // check whether robot's going off the edge
    if (newCoords[0] > worldCoords[0] || newCoords[0] < 0 || newCoords[1] > worldCoords[1] || newCoords[1] < 0) {
      // if robot detects scent, ignore instruction
      if (sniff(robotCoords)) return robotCoords;
      // else leave a scent...
      scentArray.push(robotCoords);
      // ...and set output to LOST value
      output += robotCoords.join(' ') + ' ' + orientation + ' LOST\n';
      return false;
    }
    // Phew. Move robot to newCoords
    return newCoords;
  }

  function sniff (robotCoords) {
    for (var i = 0; i < scentArray.length; i++) {
      if (scentArray[i][0] === robotCoords[0] && scentArray[i][1] === robotCoords[1]) return true;
    }
    return false;
  }

  function turnRight (orientation) {
    var newOrientation = orientationArray[orientationArray.indexOf(orientation)+1];
    return newOrientation ? newOrientation : orientationArray[0];
  }

  function turnLeft (orientation) {
    var newOrientation = orientationArray[orientationArray.indexOf(orientation)-1];
    return newOrientation ? newOrientation : orientationArray[orientationArray.length-1];
  }
})();
