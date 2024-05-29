const board = document.getElementById('game-board');
const boardWidth = 20;
const boardHeight = 20;
const cellSize = 20;
const speed = 100;

let snake = [{ x: 10, y: 10 }];
let direction = 'right';
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;

function restartGame() {
    // Reset snake, direction, score, and food
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    food = generateFood();

    // Update score display
    updateScore();

    // Clear existing snake and food elements
    clearSnake();
    drawFood();

    // Restart game loop
    clearInterval(gameLoop);
    gameLoop = setInterval(moveSnake, speed);
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('high-score').innerText = `High Score: ${highScore}`;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * boardWidth),
    y: Math.floor(Math.random() * boardHeight)
  };
}

function clearSnake() {
    const snakeElements = document.querySelectorAll('.snake');
    snakeElements.forEach(element => element.remove());
  }
  
function drawSnake() {
    const snakeElements = document.querySelectorAll('.snake');
    snakeElements.forEach(element => element.classList.remove('snake'));

    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridColumn = segment.x + 1;
        snakeElement.style.gridRow = segment.y + 1;
        snakeElement.classList.add('snake');
        board.appendChild(snakeElement);
    });
}

function drawFood() {
    // Remove existing food elements
    const existingFood = document.querySelectorAll('.food');
    existingFood.forEach(element => element.remove());
  
    const foodElement = document.createElement('div');
    foodElement.style.gridColumn = food.x + 1;
    foodElement.style.gridRow = food.y + 1;
    foodElement.classList.add('food'); // Add food class for styling
    board.appendChild(foodElement);
  }
  
function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (head.x < 0 || head.x >= boardWidth || head.y < 0 || head.y >= boardHeight || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        clearInterval(gameLoop);
        alert('Game Over!');
        updateHighScore(); // Update the high score before alerting game over
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateHighScore(); // Update the high score if necessary
        food = generateFood();
        drawFood(); // Draw the new food
    } else {
        snake.pop();
    }

    updateScore(); // Update the score display
    drawSnake();
}

function changeDirection(event) {
    if (event.key === 'r' || event.key === 'R') {
      restartGame();
      return;
    }
  
    // Prevent default behavior for arrow keys
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
    }
  
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'down') direction = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') direction = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') direction = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left') direction = 'right';
        break;
    }
  }
  
drawFood();
drawSnake();
let gameLoop = setInterval(moveSnake, speed);

document.addEventListener('keydown', changeDirection);
