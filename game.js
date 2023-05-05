const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// we will need the gamecontainer to make it blurry
// when we display the end menu
const gameContainer = document.getElementById('game-container');

const harrypotterImg = new Image();
harrypotterImg.src= 'imagens/harrypotter.png';

//Game constants
const FLAP_SPEED = -5;
const POTTER_WIDTH = 40;
const POTTER_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Bird variables
let potterX = 50;
let potterY = 50;
let potterVelocity = 0;
let potterAcceleration = 0.1;

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// score and highscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// we add a bool variable, so we can check when flappy passes we increase
// the value
let scored = false;

// lets us control the bird with the space key
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        potterVelocity = FLAP_SPEED;
    }
}

// lets us restart the game if we hit game-over
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})



function increaseScore() {
    // increase now our counter when our flappy passes the pipes
    if(potterX > pipeX + PIPE_WIDTH && 
        (potterY < pipeY + PIPE_GAP || 
          potterY + POTTER_HEIGHT > pipeY + PIPE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // reset the flag, if bird passes the pipes
    if (potterX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Create bounding Boxes for the bird and the pipes

    const potterBox = {
        x: potterX,
        y: potterY,
        width: POTTER_WIDTH,
        height: POTTER_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + POTTER_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + POTTER_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Check for collision with upper pipe box
    if (potterBox.x + potterBox.width > topPipeBox.x &&
        potterBox.x < topPipeBox.x + topPipeBox.width &&
        potterBox.y < topPipeBox.y) {
            return true;
    }

    // Check for collision with lower pipe box
    if (potterBox.x + potterBox.width > bottomPipeBox.x &&
        potterBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        potterBox.y + potterBox.height > bottomPipeBox.y) {
            return true;
    }

    // check if bird hits boundaries
    if (potterY < 0 || potterY + POTTER_HEIGHT > canvas.height) {
        return true;
    }


    return false;
}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // This way we update always our highscore at the end of our game
    // if we have a higher high score than the previous
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// we reset the values to the beginning so we start 
// with the bird at the beginning
function resetGame() {
    potterX = 50;
    potterY = 50;
    potterVelocity = 0;
    potterAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Flappy Bird
    ctx.drawImage(harrypotterImg, potterX, potterY);

    // Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // now we would need to add an collision check to display our end-menu
    // and end the game
    // the collisionCheck will return us true if we have a collision
    // otherwise false
    if (collisionCheck()) {
        endGame();
        return;
    }


    // forgot to mvoe the pipes
    pipeX -= 1.5;
    // if the pipe moves out of the frame we need to reset the pipe
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    // apply gravity to the bird and let it move
    potterVelocity += potterAcceleration;
    potterY += potterVelocity;

    // always check if you call the function ...
    increaseScore()
    requestAnimationFrame(loop);
}

loop();