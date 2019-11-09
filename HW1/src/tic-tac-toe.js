// tic-tac-toe.js
//Bowen Zhang
//bz896

let iniValue;

function board(rows, columns, initialCellValue = ""){
  iniValue = initialCellValue;
  return new Array(rows * columns).fill(initialCellValue);
}

function toIndex(board, row, col) {
  const side = Math.sqrt(board.length);
  return row * side + col;
}

function toRowCol(board, i){
  const side = Math.sqrt(board.length);
  const col = i % side;
  const row = Math.floor(i / side);
  return {"row": row, "col": col};
}

function setBoardCell(board, letter, row, col){
  let newboard = board.slice();
  newboard[toIndex(board, row, col)] = letter;
  return newboard;
}

//self-created function to put letter for random computer moves.
function setCellCpu(board, letter, index){
  let newboard = board.slice();
  newboard[index] = letter;
  return newboard;
}

function algebraicToRowCol(algebraicNotation){
  const input = String(algebraicNotation).split("");
  if(input.length != 2){
    return undefined;
  }
  if (input[0] >= "A" && input[0] <= "Z") {
    const row = input[0].charCodeAt(0) - 65;
    let colNum = "";
    for (let x = 1; x < input.length; x++) {
      if (isNaN(input[x]) === false) {
        colNum += input[x];
      }
      else {
        return undefined;
      }
    }
    const col = parseInt(colNum) - 1;
    return {"row": row, "col": col};
  }
  else {
    return undefined;
  }
}
//not finished yet not finished yetnot finished yetnot finished yet
function placeLetters(board, ...algebraicNotation){
  if(algebraicNotation.length % 2 === 1){
    algebraicNotation.pop();
  }
  let b = board;
  for (let i = 0; i < algebraicNotation.length; i+= 2) {
    if(isValidMoveAlgebraicNotation(b, algebraicNotation[i+1])){
      let ans = algebraicToRowCol(algebraicNotation[i+1]);
      let col = ans["col"];
      let row = ans["row"];
      b = setBoardCell(b, algebraicNotation[i], row, col);
    }
  }
  return b;
}

function boardToString(board){
  const side = Math.sqrt(board.length);
  let result = "  ";
  let bar = "   ";
  //create the bar
  for(let i = 1; i <= side; i++){
    if(i < 10){
      result = result + "   " + i;
    }else {
      result = result + "  " + i;
    }
    bar += "+---";
  }
  bar += "+";

  for(let j = 0; j < board.length; j++){
    if(j % side === 0){
      result = result + "\n" + bar;
      result = result + "\n " + String.fromCharCode(j / side + 65) + " |";
    }
    if(board[j] === ""){
      result = result + "   |";
    }
    else if (board[j].length > 1) {
      result = result + " " + board[j][0] + " |";
    }
    else {
      result = result + " " + board[j] + " |";
    }
  }
  result = result + "\n" + bar;
  return result;
}

function getWinnerRows(board){
  const side = Math.sqrt(board.length);
  for(let i = 0; i < board.length; i = i + side){
    if(board[i] === "X"){
      for(let x = 1; x < side; x++){
        if (board[i+x] != "X") {
          break;
        }
        if(x === (side -1)){
          return "X";
        }
      }
    }
    else if (board[i] === "O") {
      for(let o = 1; o < side; o++){
        if (board[i+o] != "O") {
          break;
        }
        if(o === (side -1)){
          return "O";
        }
      }
    }
  }
  return undefined;
}

function getWinnerCols(board){
  const side = Math.sqrt(board.length);
  for(let i = 0; i < side; i ++){
    if(board[i] === "X"){
      for(let x = i; x < board.length; x = x + side){
        if (board[x] != "X") {
          break;
        }
        if(x + side > board.length){
          return "X";
        }
      }
    }
    else if (board[i] === "O") {
      for(let o = i; o < board.length; o = o + side){
        if (board[o] != "O") {
          break;
        }
        if(o + side > board.length){
          return "O";
        }
      }
    }
  }
  return undefined;
}

function getWinnerDiagonals(board){
  const side = Math.sqrt(board.length);
  let dia1 = [];
  let dia2 = [];
  for(let i = 0; i < side; i ++){
    dia1.push(board[i*(side + 1)]);
  }
  for(let j = 1; j <= side; j ++){
    dia2.push(board[j*(side - 1)]);
  }
  const checkX = function(ele){return ele === "X"};
  const checkO = function(ele){return ele === "O"};
  if( dia1.every(checkX) || dia2.every(checkX) === true){
    return "X";
  }
  else if (dia1.every(checkO) || dia2.every(checkO) === true) {
    return "O";
  }
  else {
    return undefined;
  }
}

function isBoardFull(board){
  // const checkFull = function(ele){
  //   return ele === iniValue;
  // }
  // return board.some(checkFull);
  let result = true;
  for(let i = 0; i < board.length; i++){
    if(board[i] === ""){
      result = false;
      break;
    }
  }
  return result;
}

function isValidMove(board, row, col){
  const index = toIndex(board, row, col);
  if(index >= 0 && index < board.length && board[index] === iniValue){
    return true;
  }
  else {
    return false;
  }
}

function isValidMoveAlgebraicNotation(board, algebraicNotation){

  const rowcol = algebraicToRowCol(algebraicNotation);
  if(rowcol === undefined){
    return false;
  }
  const index =  toIndex(board, rowcol["row"], rowcol["col"]);
  if(index >= 0 && index < board.length && board[index] === iniValue){
    return true;
  }
  else {
    return false;
  }
}

function getRandomEmptyCellIndex(board){
  let empty = [];
  for(let i = 0; i < board.length; i++){
    if(board[i] === iniValue){
      empty.push(i);
    }
  }
  return empty[Math.floor(Math.random()*empty.length)];
}

module.exports = {
  board: board,
  toIndex: toIndex,
  toRowCol: toRowCol,
  setBoardCell: setBoardCell,
  setCellCpu: setCellCpu,
  algebraicToRowCol: algebraicToRowCol,
  placeLetters: placeLetters,
  boardToString: boardToString,
  getWinnerRows: getWinnerRows,
  getWinnerCols: getWinnerCols,
  getWinnerDiagonals: getWinnerDiagonals,
  isBoardFull: isBoardFull,
  isValidMove: isValidMove,
  isValidMoveAlgebraicNotation: isValidMoveAlgebraicNotation,
  getRandomEmptyCellIndex: getRandomEmptyCellIndex
}
