const canvas = document.querySelector("canvas");
const scoreValue = document.querySelector(".scoreValue");
const gameResult = document.querySelector(".gameResult");
const btnReset = document.querySelector(".btnReset");
const dialog = document.querySelector("dialog");
const ctx = canvas.getContext("2d");
// NOTE: Paths in JS like "./images/..." resolve relative to the *page* (index.html),
// not this file. Since index.html sits at the project root, we should not use "../".
const audio = new Audio("./assets/bite-audio.mp3");
const foodImage = new Image();
foodImage.src = "./images/apple.png";
const sizeBlock = 30;
const sizeCanvas = canvas.width;
let direction, currentScore;

const randomNumber = (max) => {
    return Math.floor(Math.random() * max);
};

const randomPosition = () => {
    const num = randomNumber(sizeCanvas - sizeBlock);
    return Math.floor(num / 30) * 30;
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    foodImage
};

const initialPosition = { x: 300, y: 300};

let snake = [initialPosition];

const drawSnake = () => {
    ctx.fillStyle = "#556B2F";
    
    snake.forEach((position, index) => {

        if(index == snake.length-1){
            ctx.fillStyle = "#8FA31E";
        }
        ctx.fillRect(position.x, position.y, sizeBlock, sizeBlock);
    })
};

const drawFood = () => {
    const { x, y, foodImage} = food;
    // Prevent drawImage from throwing if the image failed to loaded.
    if (!foodImage.complete || foodImage.naturalWidth === 0) {
        ctx.fillStyle = "#DE802B";
        ctx.fillRect(x, y, 30, 30);
        return;
    }

    ctx.drawImage(foodImage, x, y, 30, 30);

}

const drawGrid = () => {
    ctx.lineWidth = .5;
    ctx.strokeStyle = "--primaryColor";

    for(let i = 30; i <= canvas.width; i += 30){
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, sizeCanvas);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(sizeCanvas, i);
        ctx.stroke();
    }


    
};

const moveSnake = () => {
    if(!direction) return;
    const head = snake.at(-1);
    
    if(snake.length == 1){
        snake.unshift(snake.at(0));
        snake.unshift(snake.at(1));
    }

    if(direction == "right") {
        snake.push({x: head.x + sizeBlock, y: head.y});
    }
    if(direction == "left"){
        snake.push({x: head.x - sizeBlock, y: head.y});   
    }
    if(direction == "up"){
        snake.push({x: head.x, y: head.y - sizeBlock});   
    }
    if(direction == "down"){
        snake.push({x: head.x, y: head.y + sizeBlock});   
    }
    snake.shift();
};

const scoreIncrement = () => {
    currentScore = Number(scoreValue.innerHTML);
    scoreValue.innerHTML = String(currentScore + 1).padStart(2, "0");
}

const showDialog = () => {
    gameResult.innerHTML = `You lose the game, your score was: ${String(currentScore).padStart(2, "0")}`;
    dialog.show();
};

document.addEventListener("keydown", ({ key }) =>{
    if(key == "ArrowUp" && direction != "down" || key == "w" && direction != "down"){
        direction = "up";
    }
    if(key == "ArrowRight" && direction != "left" || key == "d" && direction != "left"){
        direction = "right";
    }
    if(key == "ArrowDown" && direction != "up" || key == "s" && direction != "up"){
        direction = "down";
    }
    if(key == "ArrowLeft" && direction != "right" || key == "a" && direction != "right"){
        direction = "left";
    }
});

const checkEat = () => {
    const head = snake.at(-1);

    if(head.x == food.x && head.y == food.y){
        scoreIncrement();
        snake.unshift(snake.at(0));
        audio.play();
        let x = randomPosition();
        let y = randomPosition();

        while(snake.find((position) => position.x ==x && position.y == y)){
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
    }
};

const checkContact = () => {
    snake.forEach((parts) =>{
        
    })
};

const checkCollision = () => {
    const head = snake.at(-1);

    const wallCollision = head.x < 0 || head.x > sizeCanvas - 30 
    || head.y < 0 || head.y > sizeCanvas - 30;

    const selfCollision = snake.find((position, index) => {
        return index < snake.length-2 && position.x == head.x && position.y == head.y
    });

    if(wallCollision || selfCollision){
        gameOver();
    }
}

const gameOver = () => {
    showDialog();
    clearInterval(loading);
    btnReset.addEventListener("click", () => {
        scoreValue.innerHTML = "00";
        dialog.close();
        snake = [initialPosition];
        direction = "";
        gameLoading();
    });
}

const gameLoading = () => {
    loading = setInterval(() => {
        ctx.clearRect(0,0, sizeCanvas, sizeCanvas);
        drawGrid();
        drawFood();
        moveSnake();
        drawSnake();
        checkEat();
        checkCollision();
    }, 200);
};

gameLoading();
