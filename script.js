const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restartBtn");
const newBtn = document.getElementById("newBtn");

const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");

let board = ["","","","","","","","",""];
let currentPlayer = "X";

let running = true;
let aiMode = false;

let xScore = 0;
let oScore = 0;

const winPatterns = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];

cells.forEach(cell=>{
cell.addEventListener("click",cellClick);
});

restartBtn.addEventListener("click",restartGame);
newBtn.addEventListener("click",newMatch);

pvpBtn.addEventListener("click",()=>{
aiMode=false;
setModeButtons();
restartGame();
});

aiBtn.addEventListener("click",()=>{
aiMode=true;
setModeButtons();
restartGame();
});

function cellClick(){

const index=this.dataset.index;

if(board[index]!=="" || !running)
return;

updateCell(this,index);

checkWinner();

if(aiMode && currentPlayer==="O" && running){

setTimeout(aiMove,400);

}
}

function updateCell(cell,index){

board[index]=currentPlayer;

cell.textContent=currentPlayer;

currentPlayer=currentPlayer==="X" ? "O":"X";

statusText.textContent=`Player ${currentPlayer} Turn`;

}

function checkWinner(){

let won=false;

winPatterns.forEach(pattern=>{

const[a,b,c]=pattern;

if(
board[a] &&
board[a]===board[b] &&
board[b]===board[c]
){

won=true;

const winner=board[a];

statusText.textContent=`Player ${winner} Wins`;

running=false;

updateScore(winner);

}

});

if(!won && !board.includes("")){

statusText.textContent="Draw";

running=false;

}
}

function aiMove(){

let empty = board
.map((cell,index)=> cell === "" ? index : null)
.filter(v => v !== null);

let move = null;

/* AI difficulty randomness
20% chance AI makes random move
80% chance AI plays smart
*/

const randomPlay = Math.random() < 0.20;

if(!randomPlay){

// Try winning move

move = findBestMove("O");

/* Block player */

if(move === null){

move = findBestMove("X");

}

/* Take center */

if(move === null && board[4] === ""){

move = 4;

}

/* Take corners */

const corners = [0,2,6,8]
.filter(i => board[i] === "");

if(move === null && corners.length){

move =
corners[Math.floor(Math.random()*corners.length)];

}

/* Any available */

if(move === null){

move =
empty[Math.floor(Math.random()*empty.length)];

}

}
else{

// intentional random mistake sometimes

move =
empty[Math.floor(Math.random()*empty.length)];

}

cells[move].click();

}


/* Helper function */

function findBestMove(player){

for(let pattern of winPatterns){

const [a,b,c] = pattern;

const values = [
board[a],
board[b],
board[c]
];

if(
values.filter(v => v === player).length === 2 &&
values.includes("")
){

if(board[a] === "") return a;

if(board[b] === "") return b;

if(board[c] === "") return c;

}

}

return null;

}

function restartGame(){

board=["","","","","","","","",""];

running=true;

currentPlayer="X";

statusText.textContent="Player X Turn";

cells.forEach(cell=>cell.textContent="");

}

function newMatch(){

restartGame();

xScore=0;

oScore=0;

document.getElementById("xScore").textContent=0;

document.getElementById("oScore").textContent=0;

}

function updateScore(winner){

if(winner==="X"){

xScore++;

document.getElementById("xScore").textContent=xScore;

}
else{

oScore++;

document.getElementById("oScore").textContent=oScore;

}

}

function setModeButtons(){

pvpBtn.classList.remove("active");

aiBtn.classList.remove("active");

if(aiMode)
aiBtn.classList.add("active");

else
pvpBtn.classList.add("active");

}