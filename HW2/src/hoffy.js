// hoffy.js
//Bowen Zhang
//bz896

function longestString(...args){
  if(args[0] === undefined){
    return undefined;
  }
  else {
    let result = args.reduce((acc, ele) => {return ((acc.length > ele.length) ? acc : ele);}, "");
    return result;
  }
}

function maybe(fn){
  function newMaybe(...args){
    if(args.includes(undefined)|| args.includes(null)){
      return undefined;
    }
    else {
      const result = fn(...args);
      return result;
    }
  }
  return newMaybe;
}

function filterWith(fn){
  function filter(arr){
    return arr.filter(fn);
  }
  return filter;
}

function steppedForEach(arr, fn, step){
  if(arr.length > step){
    fn(arr.splice(0, step));
  }
  else {
    fn(arr.splice(0, arr.length));
  }
  if(arr.length > 0){
    steppedForEach(arr, fn, step);
  }
}

function constrainDecorator(fn, min, max){
  function deco(...args){
    const result = fn(args);
    if (min === undefined || max === undefined) {
      return result;
    }
    else if (result > max) {
      return max;
    }
    else if (result < min) {
      return min;
    }
    else {
      return result;
    }
  }
  return deco;
}

function limitCallsDecorator(fn, n){
  let time = n;
  function deco(x){
    if (time > 0) {
      time--;
      return fn(x);
    }
    else {
      return undefined;
    }
  }
  return deco;
}

function bundleArgs(fn, ...args){
  const para = args;
  function bundle(...x){
    return fn(...para,...x);
  }
  return bundle;
}

function sequence(...fnc){
  function run(arg){
    let result = fnc.reduce(function(acc, cur){
      return cur(acc);
    }, arg);
    return result;
  }
  return run;
}

module.exports = {
  longestString: longestString,
  steppedForEach: steppedForEach,
  maybe: maybe,
  filterWith: filterWith,
  constrainDecorator: constrainDecorator,
  limitCallsDecorator: limitCallsDecorator,
  bundleArgs: bundleArgs,
  sequence: sequence
}
