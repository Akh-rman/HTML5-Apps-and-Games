var GF = function () {
    // vars for counting frames/s
    var frameCount = 0;
    var lastTime, fpsContainer, fps;
    
    // for time based animation
    var delta, oldTime = 0;
    
    var canvas, ctx, w, h;
    var gamepad;
    
    // vars for handling inputs
    var inputStates = {};
    
    // the monster
    var monster = {
        x: 10,
        y: 10,
        speed: 100 // pixels/s   
    };
    
    var calcDistanceToMove = function (delta, speed) {
        return (speed * delta) / 1000;
    };
    
    var measureFps = function (newTime) {
        if (lastTime == undefined) {
            lastTime = newTime;
            return;
        }
        
        // calculate the delta between last & current frame
        var diffTime = newTime - lastTime;
        
        if (diffTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = newTime;
        }
        
        fpsContainer.innerHTML = "FPS " + fps;
        frameCount++;
    }
        
    function clearCanvas() {
        ctx.clearRect(0, 0, w, h);
    }
    
    function getMousePos (evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    
    function drawMonster(x, y) {
        ctx.save();
        ctx.translate(x, y);

        ctx.strokeRect(0, 0, 100, 100);

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
        if (inputStates.left) {
            ctx.fillText("left", 150, 20);
            monster.speedX = -monster.speed;
        }
        
        if (inputStates.up) {
            ctx.fillText("up", 150, 50);
            monster.speedY = -monster.speed;
        }
        
        if (inputStates.right) {
            ctx.fillText("right", 150, 80);
            monster.speedX = monster.speed;
        }
        
        if (inputStates.down) {
            ctx.fillText("down", 150, 120);
            monster.speedY = monster.speed;
        }
        
        if (inputStates.space) {
            ctx.fillText("space bar", 140, 150);
        }
        
        if (inputStates.mousePos) {
            ctx.fillText("x = " + inputStates.mousePos.x + " y = " + inputStates.mousePos.y, 5, 150);
        }
        
        if (inputStates.mousedown) {
            ctx.fillText("mousedown  b" + inputStates.mouseButton, 5, 180);
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
    
    function timer (currentTime) {
        var delta = currentTime - oldTime;
        oldTime = currentTime;
        return delta;
    }
    
    var mainLoop = function (time) {
        measureFps(time);
        
        // number of ms since last frame draw
        delta = timer(time);
        
        // clear canvas
        clearCanvas();
        
        // gamepad
        updateGamePadStatus();
        
        // draw a monster
        drawMonster(monster.x, monster.y);
        
        updateMonsterPosition(delta);
        
        requestAnimationFrame(mainLoop);
    }
    
    var start = function (time) {
        canvas = document.querySelector("#myCanvas");

        w = canvas.width;
        h = canvas.height;

        ctx = canvas.getContext("2d");
        ctx.font = "20px Arial";
        
        fpsContainer = document.createElement("div");
        document.body.insertBefore(fpsContainer, canvas);
        
        // add the listener to the main, window object, and update the states
        window.addEventListener("keydown", (event) => {
            if (event.keyCode === 37) {
                inputStates.left = true;
            } else if (event.keyCode === 38) {
                inputStates.up = true;
            } else if (event.keyCode === 39) {
                inputStates.right = true;
            } else if (event.keyCode === 40) {
                inputStates.down = true;
            } else if (event.keyCode === 32) {
                inputStates.space = true;
            }
        }, false);
        
        // if the key is released, change the states object
        window.addEventListener("keyup", (event) => {
            if (event.keyCode === 37) {
                inputStates.left = false;
            } else if (event.keyCode === 38) {
                inputStates.up = false;
            } else if (event.keyCode === 39) {
                inputStates.right = false;
            } else if (event.keyCode === 40) {
                inputStates.down = false;
            } else if (event.keyCode === 32) {
                inputStates.space = false;
            }
        }, false);
        
        // mouse event listeners
        canvas.addEventListener("mousemove", (evt) => {
            inputStates.mousePos = getMousePos(evt);
        }, false);
        
        canvas.addEventListener("mousedown", (evt) => {
            inputStates.mousedown = true;
            inputStates.mouseButton = evt.button;
        }, false);
        
        canvas.addEventListener("mouseup", (evt) => {
            inputStates.mousedown = false;
        }, false);
        
        requestAnimationFrame(mainLoop);
    }
    
    return {
        start: start
    };
}

window.onload = function init () {
    var game = new GF();
    game.start();
}
