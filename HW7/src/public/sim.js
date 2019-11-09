const forest_base = ['🍄','🍂','🍁','🍀','☘️','🌿','🌲','🌱','🌻','🌺','🥀','🌸','💐','🐭','🐼'];
let arr = undefined; // the array of emoji that will be used to set up forest.
let flag = false; // the flag if the array is set to read from input, then it will turn to be true. it will be reset to false if reset is clicked
let smallestsimp = undefined; // the variable stores the lowest simpsonsIndex ever enountered. it will be reset to undefined if reset is clicked
let original = undefined; // the variable that holds the dom of old panel.(will be used to reset).

const simpsonsIndex = forest =>
1 - Object.entries(
[...forest.join("")].reduce(
    (counts, emoji) => ({...counts, [emoji]: (counts[emoji] || 0) + 1}),
    {}
)
).reduce(([top, bottom], [species, count]) => [top + (count * (count - 1)), bottom + count], [0, 0])
.reduce((sumLilN,bigN) => sumLilN / (bigN * (bigN - 1)));

function generate(evt){

  if (flag === false) {
    const panel = document.getElementById('inputForest');
    const config = panel.value;
    if(config === ""){
      arr = forest_base;
    }
    else {
      arr = [...config];
    }
    addDiv();
    flag = true;
  }

  let output = [];

  for(let i = 0; i < 8; i++){
    const line = document.getElementById("l"+(i+1));
    if(line.classList.contains("pin")){
      output[i] = line.innerHTML;
    }
    else{
      output[i] = "";
      for(let j = 0; j < 8; j++){
        const id = Math.floor(Math.random()* (arr.length+12));
        if(id >= arr.length){
          output[i] += "&nbsp";
        }
        else {
          output[i] += arr[id];
        }
      }
      line.innerHTML = output[i];
    }
  }

  const index = simpsonsIndex(output).toFixed(2);
  const simp = document.getElementById('index');
  simp.textContent = "The current Simpson's Index is " + index;
  if(index < 0.8){
    const pushtray = document.getElementById("pushtray");
    const warn = document.createElement('div');
    warn.id = "warning";
    warn.innerHTML = "WARNING: The Simpson's Index Dropped to " + index;
    if(smallestsimp === undefined){
      smallestsimp = index;
      pushtray.appendChild(warn);
    }
    else {
      if (smallestsimp > index) {
        smallestsimp = index;
        pushtray.removeChild(pushtray.childNodes[0]);
        pushtray.appendChild(warn);
      }

    }
  }
}

function pin(evt){
  const line = document.getElementById(evt.target.id);
  line.classList.toggle('pin');
}

function reset(evt){
  flag = false;
  smallestsimp = undefined;
  const w = document.getElementById('test');
  w.innerHTML = "huaq!!!";
  const content = document.getElementById('content');
  const divs = document.getElementsByTagName('div');
  content.replaceChild(original, divs[1]);
  const push = document.getElementById("pushtray");
  while (push.firstChild) {
    push.removeChild(push.firstChild);
}
}

function addDiv(){

  const content = document.getElementById('content');
  const divs = document.getElementsByTagName('div');

  const newdiv = document.createElement('div');
  const simdiv = document.createElement('div');
  const btndiv = document.createElement('div');

  const h4 = document.createElement('h4');
  h4.id = "index";
  simdiv.appendChild(h4);
  newdiv.appendChild(simdiv);

  const forest = document.createElement('div');
  forest.id = "forest";
  for(let i = 1; i <= 8; i++){
    const line = document.createElement('p');
    line.id = "l" + i;
    line.class = "unpin";
    line.addEventListener('click', pin);
    forest.appendChild(line);
  }
  newdiv.appendChild(forest);

  const button = document.createElement('button');
  button.textContent = "generate";
  button.addEventListener('click', generate);
  btndiv.appendChild(button);

  const button2 = document.createElement('button');
  button2.textContent = "reset";
  button2.addEventListener('click', reset);
  btndiv.appendChild(button2);
  newdiv.appendChild(btndiv);

  const test = document.createElement('p');
  test.id = 'test';
  newdiv.appendChild(test);
  original = divs[1];

  content.replaceChild(newdiv, divs[1]);
}

function main() {;
  let btn = document.querySelector('button');
  btn.addEventListener('click', generate);
}

document.addEventListener("DOMContentLoaded", main);
