// bitefunc.js
//Bowen Zhang
//bz896



function processBiteData(bites){
  let result = "";
  let func = [averageAge, percentageSN, topTenBreed, rankBorough, topThreeMon];
  for(let i = 0; i < func.length; i++){
    result += func[i](bites);
    result += "\n";
  }
  return result;
}

function averageAge(bites){
  let count = 0;
  let result = bites.reduce(function(acc, cur){
    if(isNaN(cur["Age"]) === false && cur["Age"] != ""){
      count += 1;
      return acc + parseInt(cur["Age"]);
    }else {
      return acc;
    }
  }, 0);
  return "Average age of these chompy friends is: " + (result/count).toFixed(2) + "\n";
}

function percentageSN(bites){
  let truenum = 0;
  bites.forEach(function(item){
    if(item["SpayNeuter"] === "true"){
      truenum += 1;
    }
  });
  // console.log(truenum);
  // console.log(bites.length);
  // console.log("The percentage of biting dogs that are spayed/neutered: " + (truenum/bites.length*100).toFixed(2) + "%\n");
  return "The percentage of biting dogs that are spayed/neutered: " + (truenum/bites.length*100).toFixed(2) + "%\n";
}

function topTenBreed(bites){
  let rank = {};
  for(let i = 0; i < bites.length; i++){
    if(rank[bites[i]["Breed"]] != undefined ){
      rank[bites[i]["Breed"]] += 1;
    }
    else{
      rank[bites[i]["Breed"]] = 1;
    }
  }
  let result = [];
  for(let i in rank){
    result.push([i, rank[i]]);
  }
  result = result.filter(item => item[0] != "UNKNOWN");
  result.sort(function(a, b){
    return b[1] - a[1];
    });
    let output = "";
  output += "Top Ten Most Chompy Breeds:\n";
  for(let i = 0; i < 10; i++){
    output += ((i+1) + ". " + (result[i])[0] + " with " + (result[i])[1] + " reported bites\n");
  }
  return output;
}

function rankBorough(bites){
  let rank = {};
  for(let i = 0; i < bites.length; i++){
    if(rank[bites[i]["Borough"]] != undefined ){
      rank[bites[i]["Borough"]] += 1;
    }
    else{
      rank[bites[i]["Borough"]] = 1;
    }
  }
  let result = [];
  for(let i in rank){
    result.push([i, rank[i]]);
  }
  result.sort(function(a, b){
    return b[1] - a[1];
    });
  let output = "";
    console.log(result);
  output += ("Dog Bite Leaderboard\n");
  for(let i = 0; i < 5; i++){
  output += ((i+1) + ". " + (result[i])[0] + " with " + (result[i])[1] + " bites\n");
  }
  return output;
}

function topThreeMon(bites){
  let rank = {"January": 0,
              "February": 0,
              "March": 0,
              "April": 0,
              "May": 0,
              "June": 0,
              "July": 0,
              "August": 0,
              "September": 0,
              "October": 0,
              "November": 0,
              "December": 0
  };
  let time = [];
  for(let i = 0; i < bites.length; i++){
    if(bites[i]["DateOfBite"] != undefined ){
      time.push(bites[i]["DateOfBite"]);
    }
  }

  time = time.map(function(str){
    str = str.replace(/[0-9]/g, '');
    str = str.trim();
    return str;
  });
  for(let idx = 0; idx < time.length; idx++){
    rank[time[idx]] += 1;
  }
  let result = [];
  for(let i in rank){
    result.push([i, rank[i]]);
  }
  result.sort(function(a, b){
    return b[1] - a[1];
    });
  return ("The top three months for dog biting are " + result[0][0] + ", " + result[1][0] + ", " + result[2][0] + ".");
}

module.exports = {
  averageAge: averageAge,
  percentageSN: percentageSN,
  topTenBreed: topTenBreed,
  rankBorough: rankBorough,
  topThreeMon: topThreeMon,
  processBiteData: processBiteData
}
