const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-button");
const gameOverMessage = document.getElementById("game-over");
const usernameInput = document.getElementById("username-input");
const submitButton = document.getElementById("submit-button");

const boxSize = 10;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = "right";
let score = 0;
let gameInterval;

let specialFood = null;
let specialFoodCountdown = 0;

function generateSpecialFood() {
    const specialFoodX = Math.floor(Math.random() * (canvas.width / boxSize));
    const specialFoodY = Math.floor(Math.random() * (canvas.height / boxSize));
    return { x: specialFoodX, y: specialFoodY };
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    });
}

function drawFood(food) {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

function moveSnake() {
    const headX = snake[0].x;
    const headY = snake[0].y;

    if (direction === "right") {
        snake.unshift({ x: headX + 1, y: headY });
    } else if (direction === "left") {
        snake.unshift({ x: headX - 1, y: headY });
    } else if (direction === "up") {
        snake.unshift({ x: headX, y: headY - 1 });
    } else if (direction === "down") {
        snake.unshift({ x: headX, y: headY + 1 });
    }

    if (headX === food.x && headY === food.y) {
        // Snake ate the food, generate new food
        food.x = Math.floor(Math.random() * (canvas.width / boxSize));
        food.y = Math.floor(Math.random() * (canvas.height / boxSize));
        score += 10; // Increase the score
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        snake.pop(); // Remove the tail
    }
}

function preventArrowKeyDefault(event) {
    const key = event.keyCode;
    if ([37, 38, 39, 40].includes(key)) {
        event.preventDefault();
    }
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "right") {
        direction = "left";
    } else if (key === 38 && direction !== "down") {
        direction = "up";
    } else if (key === 39 && direction !== "left") {
        direction = "right";
    } else if (key === 40 && direction !== "up") {
        direction = "down";
    }
}

function hideGameOverMessage() {
    gameOverMessage.style.display = "none";
}

function checkCollision() {
    const headX = snake[0].x;
    const headY = snake[0].y;

    // Check if the snake hit the wall or itself
    if (
        headX < 0 || headX * boxSize >= canvas.width ||
        headY < 0 || headY * boxSize >= canvas.height ||
        snake.slice(1).some(segment => segment.x === headX && segment.y === headY)
    ) {
        clearInterval(gameInterval);
        gameOverMessage.style.display = "block"; // Show "Game Over"
        startButton.disabled = false;
        showSubmitButton();
    }
}

function showSubmitButton() {
    usernameInput.style.display = "block";
    submitButton.style.display = "block";
}

submitButton.addEventListener("click", () => {
    const username = usernameInput.value;
    if (username) {
        // Get the existing highscores from localStorage
        const highscores = JSON.parse(localStorage.getItem('highscores')) || [];

        // Add the new score to the highscores array
        highscores.push({ username, score });

        // Sort highscores by score in descending order
        highscores.sort((a, b) => b.score - a.score);

        // Save the updated highscores back to localStorage
        localStorage.setItem('highscores', JSON.stringify(highscores));

        // Now, we'll update the highscores table on the highscores.html page.
        updateHighscoresTable(highscores);

        // Optionally, you can redirect the user to the highscores page:
        window.location.href = 'highscores.html';
    }
});

// Function to update the highscores table on highscores.html
function updateHighscoresTable(highscores) {
    const highscoreTableBody = document.getElementById("highscore-table-body");

    // Clear the existing table content
    highscoreTableBody.innerHTML = '';

    // Iterate through the highscores and add them to the table
    highscores.forEach((highscore, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${highscore.username}</td>
            <td>${highscore.score}</td>
        `;
        highscoreTableBody.appendChild(row);
    });
}

function drawSpecialFood() {
    if (specialFood) {
        ctx.fillStyle = "blue"; // Color for special food
        ctx.fillRect(specialFood.x * boxSize, specialFood.y * boxSize, boxSize, boxSize);
    }
}

function checkForSpecialFood() {
    if (score % 50 === 0 && specialFood === null) {
        specialFood = generateSpecialFood();
        specialFoodCountdown = 100; // 100 game loops = 10 seconds
    }
}

function moveSpecialFood() {
    if (specialFoodCountdown > 0) {
        specialFoodCountdown--;
        if (specialFoodCountdown === 0) {
            // Special food countdown is over, remove it
            specialFood = null;
        }
    }
}

function handleSpecialFoodCollision() {
    if (specialFood && snake[0].x === specialFood.x && snake[0].y === specialFood.y) {
        specialFood = null;
        score += 50; // Increase score for eating special food
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    checkForSpecialFood(); // Check if special food should appear
    moveSpecialFood(); // Countdown for special food
    handleSpecialFoodCollision(); // Check if snake ate special food

    drawSpecialFood(); // Draw special food
    drawSnake();
    drawFood(food);
    moveSnake();
    checkCollision();
}

startButton.addEventListener("click", startGame);

function startGame() {
    hideGameOverMessage(); // Hide "Game Over" message
    usernameInput.style.display = "none"; // Hide the username input
    submitButton.style.display = "none"; // Hide the submit button
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    direction = "right";
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    startButton.disabled = true;
    gameInterval = setInterval(gameLoop, 100);
}

document.addEventListener("keydown", preventArrowKeyDefault);
document.addEventListener("keydown", changeDirection);

// Start the game when the page loads
startGame();
