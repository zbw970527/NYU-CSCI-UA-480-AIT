// game.js
//Bowen Zhang
//bz896

const tic = require('./tic-tac-toe.js');
const readlineSync = require('readline-sync');

function main(){

//check if there is any winner or not
  function win (board){
    let winrow = tic.getWinnerRows(board) === "X" || tic.getWinnerRows(board) === "O";
    let wincol = tic.getWinnerCols(board) === "X" || tic.getWinnerCols(board) === "O";
    let windia = tic.getWinnerDiagonals(board) === "X" || tic.getWinnerDiagonals(board) === "O";
    if(winrow || wincol || windia){
      return true;
    }
    else {
      return false;
    }
  }

  let p; // stores the mark of palyer ("X" or "O")
  let c;// stores the mark of computer ("X" or "O")

  console.log("Let's play tic-tac-toe!\n");

  //ask for input until an valid input is entered.
  let width = readlineSync.question("What is the length of the board? (1 - 26)\n");
  while(!(width >= 1 && width <= 26)){
    width = readlineSync.question("What is the length of the board? (1 - 26)\n");
  }
  //ask for input until an valid input is entered.
  let letter = readlineSync.question("Pick your letter: X or O (please enter in upper case)\n");
  while(!(letter === "X" || letter === "O")){
    letter = readlineSync.question("Pick your letter: X or O\n");
  }
  console.log("\nPlayer is  " + letter);
  p = letter;
  if(p === "X"){
    c = "O";
  }
  else {
    c = "X";
  }

  let board = tic.board(width, width);
  console.log(tic.boardToString(board));

  //scripted version
  if(process.argv[2] != undefined){
    const arr = process.argv[2] ? JSON.parse(process.argv[2]) : undefined;
    let computerMoves = arr[0];
    let playerMoves = arr[1];
    console.log("Now the program will run based on script!\n");
    console.log("Computer's moves are: ");
    console.log(computerMoves);
    console.log("Player's moves are: ");
    console.log(playerMoves);


    if (p === "X") {
      //player starts first
      while (tic.isBoardFull(board) === false && win(board) === false) {

        if(playerMoves.length > 0){
          notify = readlineSync.question("\nPress <ENTER> to show scripted computer's move...");
          let index = playerMoves[0];
          playerMoves.splice(0, 1);
          while(tic.isValidMove(board, index[0], index[1]) === false){
            if(playerMoves.length > 0){
              index = playerMoves[0];
              playerMoves.splice(0, 1);
            }
            else {// if the playerMoves is empty after skipping the bad move
              let move = readlineSync.question("What's your move? \n");
              while(tic.isValidMoveAlgebraicNotation(board, move) === false){
                console.log("Your move must be in a format, and it must specify an existing empty cell!");
                move = readlineSync.question("What's your move? \n");
              }
              board = tic.placeLetters(board, p, move);
              console.log(tic.boardToString(board));
              if(win(board)){
                break;
              }
            }
          }
          board = tic.setBoardCell(board, p, index[0], index[1]);
          console.log(tic.boardToString(board));

        }
        else {// if the playerMoves is empty
          let move = readlineSync.question("What's your move? \n");
          while(tic.isValidMoveAlgebraicNotation(board, move) === false){
            console.log("Your move must be in a format, and it must specify an existing empty cell!");
            move = readlineSync.question("What's your move? \n");
          }
          board = tic.placeLetters(board, p, move);
          console.log(tic.boardToString(board));
        }
        if(win(board)){
          break;
        }

        // if there are still elements in computerMoves
        if(computerMoves.length > 0){
          readlineSync.question("Press <ENTER> to show scripted computer's move...");
          let index = computerMoves[0];
          computerMoves.splice(0, 1);
          if(tic.isValidMove(board, index[0], index[1])){
            board = tic.setBoardCell(board, c, index[0], index[1]);
            console.log(tic.boardToString(board));
          }
          else {
            //do random move if the script is invalid
            board = tic.setCellCpu(board, c, tic.getRandomEmptyCellIndex(board));
            console.log(tic.boardToString(board));
          }
        }
        else {
          readlineSync.question("Press <ENTER> to show computer's move...");
          //do random move if no row and col in computerMoves
          board = tic.setCellCpu(board, c, tic.getRandomEmptyCellIndex(board));
          console.log(tic.boardToString(board));
        }
        if(win(board)){
          break;
        }
      }
    }
    else {
      //COMPUTER STARTS first
      while (tic.isBoardFull(board) === false && win(board) === false) {
        if(computerMoves.length > 0){
          readlineSync.question("Press <ENTER> to show scripted computer's move...");
          let index = computerMoves[0];
          computerMoves.splice(0, 1);
          if(tic.isValidMove(board, index[0], index[1])){
            board = tic.setBoardCell(board, c, index[0], index[1]);
            console.log(tic.boardToString(board));
          }
          else {
            //do random move if the script is invalid
            board = tic.setCellCpu(board, c, tic.getRandomEmptyCellIndex(board));
            console.log(tic.boardToString(board));
          }
        }
        else {
          //do random move if no row and col in computerMoves
          board = tic.setCellCpu(board, c, tic.getRandomEmptyCellIndex(board));
          console.log(tic.boardToString(board));
        }
        if(win(board)){
          break;
        }

        if(playerMoves.length > 0){// if there are still elements in playerMoves
          readlineSync.question("Press <ENTER> to show scripted player's move...");
          let index = playerMoves[0];
          playerMoves.splice(0, 1);
          //if the current move is invalid, skip it and get next scripted move
          while(tic.isValidMove(board, index[0], index[1]) === false){
            if(playerMoves.length > 0){
              index = playerMoves[0];
              playerMoves.splice(0, 1);
            }
            else {// if the playerMoves is empty after skip bad moves
              let move = readlineSync.question("What's your move? \n");
              while(tic.isValidMoveAlgebraicNotation(board, move) === false){
                console.log("Your move must be in a format, and it must specify an existing empty cell!");
                move = readlineSync.question("What's your move? \n");
              }
              board = tic.placeLetters(board, p, move);
              console.log(tic.boardToString(board));
              if(win(board)){
                break;
              }
            }
          }

          board = tic.setBoardCell(board, p, index[0], index[1]);
          console.log(tic.boardToString(board));
          if(win(board)){
            break;
          }
        }
        else {// if the playerMoves is empty
          let move = readlineSync.question("What's your move? \n");
          while(tic.isValidMoveAlgebraicNotation(board, move) === false){
            console.log("Your move must be in a format, and it must specify an existing empty cell!");
            move = readlineSync.question("What's your move? \n");
          }
          board = tic.placeLetters(board, p, move);
          console.log(tic.boardToString(board));
        }
        if(win(board)){
          break;
        }
      }
    }
    // figure out the winner and output message
    if(tic.getWinnerRows(board) === "X" || tic.getWinnerCols(board) === "X" || tic.getWinnerDiagonals(board) === "X"){
      console.log("Winner is X!");
    }
    else if(tic.getWinnerRows(board) === "O" || tic.getWinnerCols(board) === "O" || tic.getWinnerDiagonals(board) === "O"){
      console.log("Winner is O!");
    }
    else if(tic.isBoardFull(board) === true){
      console.log("Game Draw!");
    }
  }


  //non-scripted version
  else{
    //if player starts first
    if (p === "X") {
      while (tic.isBoardFull(board) === false && win(board) === false) {
        let move = readlineSync.question("What's your move? \n");
        console.log(move);
        while(tic.isValidMoveAlgebraicNotation(board, move) === false){
          console.log("Your move must be in a format, and it must specify an existing empty cell!");
          move = readlineSync.question("What's your move? \n");
        }
        board = tic.placeLetters(board, p, move);
        console.log(tic.boardToString(board));
        //check if player wins after this move
        if(win(board)){
          break;
        }
        readlineSync.question("Press <ENTER> to show computer's move...");
        board = tic.setCellCpu(board, c, tic.getRandomEmptyCellIndex(board));
        console.log(tic.boardToString(board));
        if(win(board)){
          break;
        }
      }

    }
    else {
      //when computer starts first
      while (tic.isBoardFull(board) === false && win(board) === false) {
        readlineSync.question("Press <ENTER> to show computer's move...");
        board = tic.setCellCpu(board, c, tic.getRandomEmptyCellIndex(board));
        console.log(tic.boardToString(board));
        if(win(board)){
          break;
        }

        //switch to player
        let move = readlineSync.question("What's your move? \n");
        while(tic.isValidMoveAlgebraicNotation(board, move) == false){
          console.log("Your move must be in a format, and it must specify an existing empty cell!");
          move = readlineSync.question("What's your move? \n");
        }
        board = tic.placeLetters(board, p, move);
        console.log(tic.boardToString(board));
        if(win(board)){
          break;
        }
      }
    }
    //figure out the exact winner
    if(tic.getWinnerRows(board) === "X" || tic.getWinnerCols(board) === "X" || tic.getWinnerDiagonals(board) === "X"){
      console.log("Winner is X!");
    }
    else if(tic.getWinnerRows(board) === "O" || tic.getWinnerCols(board) === "O" || tic.getWinnerDiagonals(board) === "O"){
      console.log("Winner is O!");
    }
    else if(tic.isBoardFull(board) === true){
      console.log("Game Draw!");
    }
  }

}
main();
