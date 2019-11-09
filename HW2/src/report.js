//Bowen Zhang
//bz896

const readline = require('readline');
const fs = require('fs');
const bite = require('./bitefunc.js');
const request = require('request');


  // let file = undefined;

  // fs.readFile("data/DOHMH_Dog_Bite_Data.csv", "utf-8", function (err, data){
  //   if (err) {
  //     console.log("Error! ", err);
  //   }
  //   else {
  //     file = data.split("\n");
  //     for(let i = 0; i < file.length-1; i++){
  //       let info = file[i].match(/(\s*"[^"]+"\s*|\s*[^,]+|,)(?=,|$)/g);
  //       for(let j = 0; j < info.length; j++){
  //         if(info[j] === ','){
  //           info[j] = "";
  //         }
  //       }
  //       file[i] = {UniqueID: info[0],
  //                 DateOfBite: info[1],
  //                 Species: info[2],
  //                 Breed: info[3],
  //                 Age: info[4],
  //                 Gender: info[5],
  //                 SpayNeuter: info[6],
  //                 Borough: info[7],
  //                 ZipCode: info[8]};
  //      }
  //      file.splice(0,1);
  //      let opt = anaylse(file);
  //      console.log(opt);
  //   }
  // });

  // function anaylse(file){
  //   let result = bite.processBiteData(file);
  //   return result;
  // }

  let l = [];
  const lol = 'http://jvers.com/csci-ua.0480-fall2018-001-003/homework/02/dogbite/c86d267e9c6c89416bf9e96ba7fa62a4ba1ec93f.json';
  const base = 'http://jvers.com/csci-ua.0480-fall2018-001-003/homework/02/dogbite/';
  let iniadd = 'c86d267e9c6c89416bf9e96ba7fa62a4ba1ec93f';
  const end = '.json';

  let start = getdata(base, end);
  while(true){
    iniadd = start(iniadd);
    if(iniadd == null || iniadd == undefined){
      break;
    }
  }
  dothis();// call this function to analyse data
//  console.log(l.length);

  function getdata(base, end){
    const baseVal = base;
    const endVal = end;
    function go(add){
      let next = undefined;
      request(baseVal + add + endVal, function(error, response, body){
      //  console.log(1);
        let json = JSON.parse(body);
        for(let i = 0; i < json.data.length; i ++){
          l.push(json.data[i]);
        }
    //    console.log(l.length);

        next = String(json.next);
      //  console.log(next);
      });
      return next;
    }
    return go;
  }

  function dothis(){
    let opt = bite.processBiteData(l);
    console.log(opt);
}
