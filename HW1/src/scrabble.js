// scrabble.js
//Bowen Zhang
//bz896

const readline = require('readline');
const fs = require('fs');
const letterValues = {
        "E": 1, "A": 1, "I": 1, "O": 1, "N": 1, "R": 1, "T": 1, "L": 1, "S": 1, "U": 1,
        "D": 2, "G": 2, "B": 3, "C": 3, "M": 3, "P": 3, "F": 4, "H": 4, "V": 4, "W": 4,
        "Y": 4, "K": 5, "J": 8, "X": 8, "Q": 10, "Z": 10
};

function main(){

  let input = undefined;
  let file = undefined;
  let result = [];

  const answer = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  fs.readFile("data/enable1.txt", "utf-8", function (err, data){
    if (err) {
      console.log("Error! ", err);
    }
    else {
      //console.log(data);
      file = data.split("\r\n");
    }
  });

  answer.question("Please enter some letters:", handleUserInput);

  function handleUserInput(response){
    input = response.split("");

    for(let i = 0; i < file.length; i++){
      let word = file[i].split("");
      let tempinput = input.slice();
      let isGoodWord = true;
      let score = 0;

      for(let j = 0; j < word.length; j++){
        let index = tempinput.indexOf(word[j]);
        if( index != -1){
          score += letterValues[word[j].toUpperCase()];
          tempinput.splice(index, 1);
        }
        else {
          isGoodWord = false;
          break;
        }
      }

      if(isGoodWord){
        result.push([file[i], score]);
        score = 0;
      }
      else {
        score = 0;
      }
    }

    result.sort(function(a, b){
      if(a[1] < b[1]){
        return 1;
      }
      else if (a[1] > b[1]) {
        return -1;
      }
      else {
        return 0;
      }
    });

   console.log("\nThe top scoring words are:");
   if(result.length > 5){
     for(let x = 0; x < 5; x++){
       console.log(result[x][1] + " - " + result[x][0]);
     }
   }
   else {
     for(let x = 0; x < result.length; x++){
       console.log(result[x][1] + " - " + result[x][0]);
     }
   }
    answer.close();
  }
}
main();
