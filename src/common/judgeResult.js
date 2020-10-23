export async function judgeResult(last, data) {
  let x = Math.floor((Number(last) - 1) / 4);
  let y = (Number(last) - 1) % 4;
  
  if (await judgeRow(x, y, data)) {
    console.log('row');
    return true;
  } else if (await judgeColumn(x, y, data)) {
    console.log('column');
    return true;
  } else if (x === y && await judgeSameNumber(x, y, data)) {
    console.log('same');
    return true;
  } else if (x + y === 3 && await judgeSumThree(x, y, data)) {
    console.log('three');
    return true;
  } else {
    console.log("失敗");
    return false;
  }
}

async function judgeRow(x, y, data) {
    let otherPieces = [];
    for (let i = 0; i < 4; i++) {
        if (i !== y) {
          otherPieces.push(data[x][i]);
        }
    }
    
    if (await research(x, y, data, otherPieces)) {
      return true;
    } else {
      return false;
    }
}

async function judgeColumn(x, y, data) {
    let otherPieces = [];
    for (let i = 0; i < 4; i++) {
        if (i !== x) {
          otherPieces.push(data[i][y]);
        } 
    }

    if (await research(x, y, data, otherPieces)) {
      return true;
    } else {
      return false;
    }
}

async function judgeSameNumber(x, y, data) {
    let otherPieces = [];
    for (let i = 0; i < 4; i++) {
        if (i !== x) {
          otherPieces.push(data[i][i]);
        }
    }

    if (await research(x, y, data, otherPieces)) {
        return true;
    } else {
        return false;
    }
}

async function judgeSumThree(x, y, data) {
    let otherPieces = [];
    for (let i = 0; i < 4; i++) {
        if (i !== x) {
          otherPieces.push(data[x][3 - x]);
        }
    }

    if (await research(x, y, data, otherPieces)) {
        return true;
    } else {
        return false;
    }
}

function research(x, y, data, others) {
    const checkList = ["color", "shape", "number", "language"];
    let pass = false;
    for (let i in checkList) {
        let match = 0;
        for (let j = 0; j < 3; j++) {
            if (data[x][y][checkList[i]] === others[j][checkList[i]]) {
                match++;
            } else {
              break;
            }
        }
        pass = pass || match === 3 ? true : false;
    }
    return pass;
}