const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let direction = 'RIGHT';
let level = 1;
let speed = 100;
let game; 

document.getElementById('highScore').innerHTML = 'High Score: ' + highScore;
document.addEventListener('keydown', changeDirection);

const foodImg = new Image();
foodImg.src = 'apple.png';

// Efek suara
const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

let particles = [];

function changeDirection(event) {
    const key = event.keyCode;
    if ((key === 37 || key === 65) && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if ((key === 38 || key === 87) && direction !== 'DOWN') {
        direction = 'UP';
    } else if ((key === 39 || key === 68) && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if ((key === 40 || key === 83) && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 5 + 2,
            velocityX: (Math.random() - 0.5) * 5,
            velocityY: (Math.random() - 0.5) * 5,
            alpha: 1
        });
    }
}

function updateParticles() {
    particles.forEach((particle, index) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.alpha -= 0.02;
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.fillStyle = `rgba(255, 0, 0, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'lime' : '#ffffff';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    if (foodImg.complete) {
        ctx.drawImage(foodImg, food.x, food.y, box, box);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').innerHTML = 'Score: ' + score;
        eatSound.play();
        createParticles(food.x + box / 2, food.y + box / 2);
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };

        if (score % 5 === 0) {
            level++;
            document.getElementById('level').innerHTML = 'Level: ' + level;
            speed -= 5;
            clearInterval(game);
            game = setInterval(draw, speed);
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        gameOverSound.play();

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('highScore').innerHTML = 'High Score: ' + highScore;
        }

        setTimeout(() => {
            alert('Game Over! Skor akhir: ' + score);
        }, 100);
    }

    snake.unshift(newHead);

    drawParticles();
    updateParticles();
}

function resetGame() {
    clearInterval(game);
    snake = [{ x: 9 * box, y: 10 * box }];
    score = 0;
    level = 1;
    speed = 100;
    document.getElementById('score').innerHTML = 'Score: 0';
    document.getElementById('level').innerHTML = 'Level: 1';
    direction = 'RIGHT';
    particles = [];
    game = setInterval(draw, speed);
}