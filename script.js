import { randomElementFromArray, wait } from "./utils.js";

const foodItemsArray = [
  "🐁",
  "🍇",
  "🍉",
  "🍈",
  "🍓",
  "🍍",
  "🍌",
  "🥝",
  "🍏",
  "🍎",
  "🍔",
  "🍅",
  "🥚",
];

// game display elements 
const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("span");
const startBtn = document.querySelector(".start-btn");
const keyBtns = document.querySelector(".keys-container button");

// game variables 
const width = 10;
const numCells = width * width;
grid.style.width = `${width * 10 * 2}px`;
grid.style.height = `${width * 10 * 2}px`;

let currentSnake = [2, 1, 0];
let snakeColor = Math.floor(Math.random() * 360);
let snakeColorIncrement = 10;

let direction = 1;
let intervalTime = 200;
let interval = 0;

let foodItemIndex = 0; // first cell
let score = 0;

// create grid cells 
for (let i = 0; i < width * width; i++){
    const cell = document.createElement("div");
    cell.style.width = `${width * 2}px`;
    cell.style.height = `${width * 2}px`;
    grid.appendChild(cell);
}
const cells = document.querySelectorAll(".grid div");

async function createFood() {
  foodItemIndex = Math.floor(Math.random() * numCells);
  if (currentSnake.includes(foodItemIndex)) {
    await wait(100);
    createFood();
  } else {
    cells[foodItemIndex].classList.add("food-item");
    cells[foodItemIndex].innerText = randomElementFromArray(foodItemsArray);
  }
}

// Start Game Function
function startGame() {

    grid.classList.remove("shake");

    currentSnake.forEach((i) => {
        cells[i].style.background = "none";
        cells[i].classList.remove("snake");
        cells[i].innerHTML = "";
    })
    clearInterval(interval);
    direction = 1;

    currentSnake = [2, 1, 0];
    currentSnake.forEach((i) => {
        snakeColor += snakeColorIncrement % 360;
        cells[i].style.background = `hsl(${snakeColor}, 100%, 50%)`;
        cells[i].classList.add("snake");
    });

    cells[foodItemIndex].classList.remove("food-item");
    cells[foodItemIndex].innerText = "";
    createFood();
    score = 0;
    scoreDisplay.innerHTML = score;

    interval = setInterval(gameLoop, intervalTime);
}

startBtn.addEventListener("click", startGame);

// Game Loop Function
function gameLoop() {
    cells[currentSnake[0]].innerText = "";

    // Collision Detection 
    if (
        (currentSnake[0] + width >= width * width && direction === width) || // hits bottom wall
        (currentSnake[0] % width === width - 1 && direction === 1) || // hits right wall
        (currentSnake[0] % width === 0 && direction === -1) || // hits left wall
        (currentSnake[0] - width < 0 && direction === -width) || // hits the top wall
        cells[currentSnake[0] + direction].classList.contains("snake") // hits itself
      ) {
        grid.classList.add("shake");
        clearInterval(interval);
        return;
      }

    const tail = currentSnake.pop();
    cells[tail].classList.remove("snake");
    cells[tail].style.background = "none";
    currentSnake.unshift(currentSnake[0] + direction);

    if (cells[currentSnake[0]].classList.contains("food-item")) {
      cells[currentSnake[0]].classList.remove("food-item");
      cells[tail].classList.add("snake");
      snakeColor += snakeColorIncrement % 360;
      cells[tail].style.background = `hsl(${snakeColor}, 100%, 50%)`;
      currentSnake.push(tail);
      score++;
      scoreDisplay.textContent = score;
      createFood();
    }

    cells[currentSnake[0]].classList.add("snake");
    cells[currentSnake[0]].innerText = "👀";
    snakeColor += snakeColorIncrement % 360;
    cells[currentSnake[0]].style.background = `hsl(${snakeColor}, 100%, 50%)`;
}

// Mobile control 
// function handleButtonKeyMove(e) {
//   const { id } = e.currentTarget;
//   moveSnake(id);
// }
// keyBtns.forEach((keyBtn) => {
//   keyBtn.addEventListener("mousedown", handleButtonKeyMove);
//   keyBtn.addEventListener("touchstart", handleButtonKeyMove);
// });

// Controlling Snake 
function moveSnake(moveDirection) {
  let directionVal;
  if (moveDirection === "ArrowRight" && direction !== -1) {
    directionVal = 1;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowLeft" && direction !== 1) {
    directionVal = -1;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowUp" && direction !== width) {
    directionVal = -width;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowDown" && direction !== -width) {
    directionVal = width;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
}

function handleKeyMove(e) {
    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"])
        return;
    moveSnake(e.key)
}

document.addEventListener("keydown", handleKeyMove)

// Collision Detection 
