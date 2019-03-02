var gameArea = document.getElementById("gameArea");
var ctx = gameArea.getContext("2d");
var snakeSize = 13;
  var w = 350;
  var h = 350;

var maxNum = w / snakeSize - 1;

var score = 0;
var speed = 120;
var snake;
var food;

var bgColor = "#F8F9FC";
var snColor = "#DE3C3C";
var pzColor = "#F7B32D";

//Module Pattern
var drawModule = (function() {
  console.log("1- drawmodule started");
  var bodysnake = function(x, y) {
    console.log("2- bodysnke");
    ctx.fillStyle = snColor;
    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    ctx.strokeStyle = bgColor;
    ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
  };

  var pizza = function(x, y) {
    console.log("3- pizza");
    // This is the border of the pizza
    ctx.fillStyle = pzColor;
    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    // This is the single square
    ctx.fillStyle = pzColor;
    ctx.fillRect(
      x * snakeSize + 1,
      y * snakeSize + 1,
      snakeSize - 2,
      snakeSize - 2
    );
  };

  var scoreText = function() {
    console.log("4- score");
    var scoreText = "Score : " + score;
    ctx.fillStyle = "#003399";
    ctx.fillText(scoreText, 145, h - 5);
  };

  var drawSnake = function() {
    console.log("5- dr snake");
    var length = 4;
    snake = [];

    for (var i = length; i >= 0; i--) {
      snake.push({ x: i, y: 0 });
    }
  };

  var createFood = function() {
    console.log("6- create food");
    food = {
      //Generate random numbers.
      x: Math.floor(Math.random() * maxNum + 1),
      y: Math.floor(Math.random() * maxNum + 1)
    };

    //Look at the position of the snake's body.
    for (var i = 0; i > snake.length; i++) {
      var snakeX = snake[i].x;
      var snakeY = snake[i].y;

      if (
        food.x === snakeX ||
        food.y === snakeY ||
        (food.y === snakeY && food.x === snakeX)
      ) {
        food.x = Math.floor(Math.random() * maxNum + 1);
        food.y = Math.floor(Math.random() * maxNum + 1);
      }
    }
  };

  var checkCollision = function(x, y, array) {
    console.log("7- check coliition");
    for (var i = 0; i < array.length; i++) {
      console.log(array[i].x);
      console.log(x);
      console.log(array[i].y);
      console.log(y);
      if (array[i].x == x && array[i].y == y) return true;
    }
    return false;
  };

  var paint = function() {
    console.log("8- paint");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    btn.style.display = "none";

    var snakeX = snake[0].x;
    var snakeY = snake[0].y;

    if (direction == "right") {
      snakeX++;
    } else if (direction == "left") {
      snakeX--;
    } else if (direction == "up") {
      snakeY--;
    } else if (direction == "down") {
      snakeY++;
    }
    if (
      snakeX == -1 ||
      snakeX >= w / snakeSize ||
      snakeY == -1 ||
      snakeY >= h / snakeSize ||
      checkCollision(snakeX, snakeY, snake)
    ) {
        btn.innerHTML = "Game Over. Start Again";
      btn.style.display = "block";

      ctx.clearRect(0, 0, w, h);
      gameloop = clearInterval(gameloop);
      return;
    }

    if (snakeX == food.x && snakeY == food.y) {
      var tail = {
        x: snakeX,
        y: snakeY
      };
      score++;

      createFood();
    } else {
      var tail = snake.pop();
      tail.x = snakeX;
      tail.y = snakeY;
    }

    snake.unshift(tail);

    for (var i = 0; i < snake.length; i++) {
      bodysnake(snake[i].x, snake[i].y);
    }
    pizza(food.x, food.y);

    scoreText();
  };
  var init = function() {
    console.log("9- init");
    direction = "right";
    drawSnake();
    createFood();
    gameloop = setInterval(paint, speed);
  };

  return {
    init: init
  };
})();

(function(window, document, drawModule, undefined) {
  console.log("10 - keyfunction");

  var btn = document.getElementById("btn");
  btn.addEventListener("click", function() {
    drawModule.init();
  });

  document.onkeydown = function(event) {
    console.log("11- keyget");
    keyCode = window.event.keyCode;
    keyCode = event.keyCode;
    console.log("12- keycheck");
    switch (keyCode) {
      case 37:
        if (direction != "right") {
          direction = "left";
          break;
        }
      case 39:
        if (direction != "left") {
          direction = "right";
          break;
        }
      case 38:
        if (direction != "down") {
          direction = "up";
          break;
        }
      case 40:
        if (direction != "up") {
          direction = "down";
        }
        break;
    }
  };
  gameArea.addEventListener("touchstart", startTouch, false);
  gameArea.addEventListener("touchmove", moveTouch, false);

  // Swipe Up / Down / Left / Right
  var initialX = null;
  var initialY = null;

  function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  }

  function moveTouch(e) {
    if (initialX === null) {
      return;
    }

    if (initialY === null) {
      return;
    }

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;

    var diffX = initialX - currentX;
    var diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        direction = "left";
        console.log("swiped left");
      } else {
        // swiped right
        direction = "right";
        console.log("swiped right");
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        direction = "up";
        console.log("swiped up");
      } else {
        // swiped down
        direction = "down";
        console.log("swiped down");
      }
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
  }
})(window, document, drawModule);
