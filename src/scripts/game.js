var GF = function () {
    var canvas, ctx, w, h;
    var gamepad;
    
    // vars for handling inputs
    var inputStates = {};
    
    // game states
    var gameStates = {
        mainMenu: 0,
        gameRunning: 1,
        gameOver: 2
    };
    var currentGameState = gameStates.gameRunning;
    var currentLevel = 1;
    var TIME_BETWEEN_LEVELS = 5000; // 5 seconds
    var currentLevetTime = TIME_BETWEEN_LEVELS;
    // sound of a ball exploding
    var plopSound;
    
    // the monster
    var monster = {
        x: 10,
        y: 10,
        width: 50,
        height: 50,
        speed: 100, // pixels/s
        dead: false
    };
    
    /*
    // woman object and sprites
    var WOMAN_DIR_RIGHT = 6;
    var WOMAN_DIR_LEFT = 2;
    var woman = {
        x: 100,
        y: 200,
        width: 48,
        speed: 100, // pixels/s this time
        direction: WOMAN_DIR_RIGHT
    };
    
    var womanSprites = [];
    */
    // array of balls to animate
    var ballArray = [];
    var nbBalls = 5;
    var currentScore = 0;
        
    function clearCanvas() {
        ctx.clearRect(0, 0, w, h);
    }
    
    function drawMonster(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(0.5, 0.5);

        ctx.strokeRect(0, 0, monster.width * 2, monster.height * 2);

        // eyes
        ctx.fillRect(20, 20, 10, 10);
        ctx.fillRect(65, 20, 10, 10);

        // nose
        ctx.strokeRect(45, 40, 10, 40);

        // mouth
        ctx.strokeRect(35, 84, 30, 10);

        // teeth 
        ctx.fillRect(38, 84, 10, 10);
        ctx.fillRect(52, 84, 10, 10);

        ctx.restore();
    }
    
    function updateMonsterPosition (delta) {
        monster.speedX = monster.speedY = 0;
        
        // check inputStates
        if (inputStates.left && monster.x > 0) {
            //ctx.fillText("left", 150, 20);
            monster.speedX = -monster.speed;
        }
        
        if (inputStates.up && monster.y > 0) {
            //ctx.fillText("up", 150, 50);
            monster.speedY = -monster.speed;
        }
        
        if (inputStates.right && ((monster.x + monster.width) < canvas.width)) {
            //ctx.fillText("right", 150, 80);
            monster.speedX = monster.speed;
        }
        
        if (inputStates.down && ((monster.y + monster.height) < canvas.height)) {
            //ctx.fillText("down", 150, 120);
            monster.speedY = monster.speed;
        }
        
        if (inputStates.space) {
            ctx.fillText("space bar", 140, 150);
        }
        
        if (inputStates.mousePos) {
            //ctx.fillText("x = " + inputStates.mousePos.x + " y = " + inputStates.mousePos.y, 5, 150);
        }
        
        if (inputStates.mousedown) {
            //ctx.fillText("mousedown  b" + inputStates.mouseButton, 5, 180);
            monster.speed = 500;
        } else {
            monster.speed = 100;
        }
        
        monster.x += calcDistanceToMove(delta, monster.speedX);
        monster.y += calcDistanceToMove(delta, monster.speedY);
    }
    
    window.addEventListener("gamepadconnected", function (e) {
        gamepad = e.gamepad;
        var index = gamepad.index;
        var id = gamepad.id;
        var nbButtons = gamepad.buttons.length;
        var nbAxes = gamepad.axes.length;
        console.log("Gamepad № " + index + ", with id " + id + " is connected. It has " + nbButtons + " buttons and " + nbAxes + " axes");
    });
    
    window.addEventListener("gamepaddisconnected", function (e) {
        var gamepad = e.gamepad;
        var index = gamepad.index;
        console.log("Gamepad № " + index + " has been disconnected");
    });
    
    // detect axes (joystick states)
    function checkAxes (gamepad) {
        if (gamepad === undefined) return;
        if (!gamepad.connected) return;

        // set inputStates.left, right, up, down
        inputStates.left = inputStates.right = inputStates.up = inputStates.down = false;
        
        // horizontal detection
        if (gamepad.axes[0] > 0.5) {
            inputStates.right = true;
            inputStates.left = false;
        } else if (gamepad.axes[0] < -0.5) {
            inputStates.left = true;
            inputStates.right = false;
        }
        
        // vertical detection
        if (gamepad.axes[1] > 0.5) {
            inputStates.down = true;
            inputStates.up = false;
        } else if (gamepad.axes[1] < -0.5) {
            inputStates.up = true;
            inputStates.down = false;
        }
        
        inputStates.angle = Math.atan2(-gamepad.axes[1], gamepad.axes[0]);
    }
    
    // detect button states
    function checkButtons (gamepad) {
        if (gamepad === undefined) return;
        if (!gamepad.connected) return;
        
        for (var i = 0; i < gamepad.buttons.length; i++) {
            var b = gamepad.buttons[i];
            
            if (b.pressed) {
                console.log("button pressed");
                if (b.value !== undefined) {
                    console.log("analog button pressed");
                }
            }
        }
    }
    
    function scangamepads () {
        var gamepads = navigator.getGamepads();
        
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                gamepad = gamepads[i];
            }
        }
    }
    
    function updateGamePadStatus () {
        scangamepads();
        checkButtons(gamepad);
        checkAxes(gamepad);
    }
    
    function createBalls (numberOfBalls) {
        ballArray = [];
        
        for (var i = 0; i < numberOfBalls; i++) {
            // create a ball with random position and speed
            var ball = new Ball(w * Math.random(), h * Math.random(), (2 * Math.PI) * Math.random(), (80 * Math.random()), 30);
            
            if (!circRectsOverlap(monster.x, monster.y, monster.width, monster.height, ball.x, ball.y, ball.radius * 3)) {
                ballArray[i] = ball;
            } else {
                i--;
            }
        }
    }
    
    function updateBalls (delta) {
        for (var i = 0; i < ballArray.length; i++) {
            var ball = ballArray[i];
            
            // 1) move the ball
            ball.move();
            
            // 2) test if the ball collides with a wall 
            testCollisionWithWalls(ball, w, h);
            
            // test monster collides with wall
            if (circRectsOverlap(monster.x, monster.y, monster.width, monster.height, ball.x, ball.y, ball.radius)) {
                ball.color = "red";
                monster.dead = true;
                plopSound.play();
            }
            
            // 3) draw ball
            ball.draw(ctx);
        }
    }

    class SpriteImage {
        constructor (img, x, y, width, height) {
            this.img = img;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        
        draw(ctx, xPos, yPos, scale) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height, xPos, yPos, this.width * scale, this.height * scale);
        }
    }
    
    class Sprite {
        constructor () {
            this.spriteArray = [];
            this.currentFrame = 0;
            this.delayBetweenFrames = 10;
            this.then = performance.now();
            this.totalTimeSinceLastRedraw = 0;
        }
        
        extractSprites(spritesheet, nbPostures, postureToExtract, nbFramesPerPosture, spriteWidth, spriteHeight) {
            // number of sprites per row in the spritesheet
            var nbSpritesPerRow = Math.floor(spritesheet.width / spriteWidth);
            
            // extract each sprite
            var startIndex = (postureToExtract - 1) * nbFramesPerPosture;
            var endIndex = startIndex + nbFramesPerPosture;
            
            for (var index = startIndex; index < endIndex; index++) {
                var x = (index % nbSpritesPerRow) * spriteWidth;
                var y = Math.floor(index / nbSpritesPerRow) * spriteHeight;
                
                // build a spriteImage object
                var s = new SpriteImage(spritesheet, x, y, spriteWidth, spriteHeight);
                
                this.spriteArray.push(s);
            }
        }
        
        draw(ctx, x, y) {
            // use time based animation to draw only a few images per second
            var now = performance.now();
            var delta = now - this.then;
            
            // draw currentSpriteImage
            var currentSpriteImage = this.spriteArray[this.currentFrame];
            currentSpriteImage.draw(ctx, x, y, 1); 
            
            // if the delay between images is elapsed, go to the next one
            if (this.totalTimeSinceLastRedraw > this.delayBetweenFrames) {
                // go to the next sprite image
                this.currentFrame++;
                this.currentFrame %= this.spriteArray.length;
                
                // reset the total time since last image has been drawn
                this.totalTimeSinceLastRedraw = 0;
            } else {
                // sum the total time since last redraw
                this. totalTimeSinceLastRedraw += delta;
            }
            
            this.then = now;
        }
        
        drawStoped(ctx, x, y) {
            var currentSpriteImage = this.spriteArray[this.currentFrame];
            currentSpriteImage.draw(ctx, x, y, 1);
        }
        
        setNbImagesPerSecond(nb) {
            // delay in ms between images
            this.delayBetweenFrames = 1000 / nb;
        }
    }
    
    function updateWomanPosition (delta) {
        // check collision on left or right
        if (((woman.x + woman.width) > canvas.width) || (woman.x < 0)) {
            woman.speed = -woman.speed;
        } 
        // change sprite direction
        if (woman.speed >= 0) {
            woman.direction = WOMAN_DIR_RIGHT;
        } else {
            woman.direction = WOMAN_DIR_LEFT;
        }
        
        woman.x += calcDistanceToMove(delta, woman.speed);
    }
    
    var loadAssets = (callback) => {
        /*
        var SPRITESHEET_URL = "http://i.imgur.com/3VesWqx.png";
        var SPRITE_WIDTH = 48;
        var SPRITE_HEIGHT = 92;
        var NB_POSTURES = 8;
        var NB_FRAMES_PER_POSTURE = 13;
        
        // load the spritesheet
        var spritesheet = new Image();
        spritesheet.src = SPRITESHEET_URL;
        
        // called when the spritesheet has been loaded
        spritesheet.onload = () => {
            // create woman sprites
            for (var i = 0; i < NB_POSTURES; i++) {
                var sprite = new Sprite();
                
                sprite.extractSprites(spritesheet, NB_POSTURES, (i + 1),
                    NB_FRAMES_PER_POSTURE,
                    SPRITE_WIDTH, SPRITE_HEIGHT);
                sprite.setNbImagesPerSecond(20);
                womanSprites[i] = sprite;
            }
            
            callback();
        };
        */
        plopSound = new Howl({
            urls: ['https://mainline.i3s.unice.fr/mooc/plop.mp3'],
            autoplay: false,
            volume: 1,
            onload: () => {
                console.log("All sounds loaded");
                callback();
            }
        });
    };
    
    function startNewGame () {
        monster.dead = false;
        currentLevetTime = 5000;
        currentLevel = 1;
        nbBalls = 5;
        createBalls(nbBalls);
        currentGameState = gameStates.gameRunning;
    }
    
    function goToNextLevel () {
        currentLevetTime = 5000;
        currentLevel++;
        nbBalls += 2;
        createBalls(nbBalls);
    }
    
    function displayScore () {
        ctx.save();
        ctx.fillStyle = "Green";
        ctx.fillText("Level " + currentLevel, 300, 30);
        ctx.fillText("Time " + (currentLevetTime / 1000).toFixed(1), 300, 60);
        ctx.fillText("Balls " + nbBalls, 300, 90);
        ctx.restore();
    }

    var mainLoop = function (time) {
        measureFps(time);
        
        // number of ms since last frame draw
        delta = timer(time);
        
        // clear canvas
        clearCanvas();
        
        // gamepad
        updateGamePadStatus();
        
        if (monster.dead) {
            currentGameState = gameStates.gameOver;
        }
        
        switch (currentGameState) {
            case gameStates.gameRunning:
                // draw a monster
                drawMonster(monster.x, monster.y);
        
                // check inputs and move the monster
                updateMonsterPosition(delta);
                
                // update and draw balls
                updateBalls(delta);
                
                // display score
                displayScore();
                
                // when < 0 go to next level
                currentLevetTime -= delta;
                
                if (currentLevetTime < 0) {
                    goToNextLevel();
                }
                break;
            case gameStates.mainMenu:
                break;
            case gameStates.gameOver:
                ctx.fillText("Game OVER", 50, 100);
                ctx.fillText("Press SPACE to start again", 50, 150);
                ctx.fillText("Move with arrow keys", 50, 200);
                ctx.fillText("Survive 5 seconds for next level", 50, 250);
                
                if (inputStates.space) {
                    startNewGame();
                }
                break;
        }
        
        /*
        // draw a woman
        womanSprites[woman.direction].draw(ctx, woman.x, woman.y);
        updateWomanPosition(delta);
        */
        
        // call the animation loop every 1/60 of second
        requestAnimationFrame(mainLoop);
    }
    
    var start = function (time) {
        canvas = document.querySelector("#myCanvas");
        
        initFPSCounter(canvas);

        w = canvas.width;
        h = canvas.height;

        ctx = canvas.getContext("2d");
        ctx.font = "20px Arial";
        
        addListeners(inputStates, canvas);
        
        // create the balls: try to change the parameter
        createBalls(nbBalls);
        
        loadAssets(() => {
            requestAnimationFrame(mainLoop)
        })
    };
    
    return {
        start: start
    };
}

window.onload = function init () {
    var game = new GF();
    game.start();
};